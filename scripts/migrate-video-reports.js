/**
 * Migration script for video reports
 * 
 * This script initializes the videoReports collection in Firestore with default data.
 * 
 * Usage:
 *   node scripts/migrate-video-reports.js
 * 
 * Make sure you have:
 *   1. Firebase credentials configured
 *   2. Firestore database initialized
 *   3. Proper permissions to write to Firestore
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Helper functions for YouTube
function extractYouTubeVideoId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  return null
}

function getYouTubeThumbnailUrl(videoId, quality = 'maxresdefault') {
  if (!videoId) return ''
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

// Parse the data format: "Outlet | Title https://youtube.com/..."
function parseVideoReportEntry(entry) {
  // Remove any leading/trailing whitespace
  entry = entry.trim()
  
  // Find the last occurrence of "https://" to separate text from URL
  const urlIndex = entry.lastIndexOf('https://')
  if (urlIndex === -1) {
    console.error('No URL found in entry:', entry)
    return null
  }
  
  const textPart = entry.substring(0, urlIndex).trim()
  const urlPart = entry.substring(urlIndex).trim()
  
  // Extract URL (remove query parameters for cleaner storage)
  const urlMatch = urlPart.match(/(https?:\/\/[^\s]+)/)
  const videoUrl = urlMatch ? urlMatch[1].split('?')[0] : urlPart.split('?')[0]
  
  // Parse outlet and title
  // Format: "Outlet | Title" or "Outlet: Title" or just "Outlet Title"
  let outlet = ''
  let title = ''
  
  if (textPart.includes('|')) {
    const parts = textPart.split('|').map(p => p.trim())
    outlet = parts[0]
    title = parts.slice(1).join(' | ')
  } else if (textPart.includes(':')) {
    const colonIndex = textPart.indexOf(':')
    outlet = textPart.substring(0, colonIndex).trim()
    title = textPart.substring(colonIndex + 1).trim()
  } else {
    // If no separator, try to find common outlet patterns
    const outletPatterns = [
      /^(The New York Times|The Guardian|AlJazeera|Al Jazeera|Vice|VICE|SCMP|TRT World|The Intercept|Context News|Rai TV|ITV News|ABC Australia)/i
    ]
    
    let found = false
    for (const pattern of outletPatterns) {
      const match = textPart.match(pattern)
      if (match) {
        outlet = match[1]
        title = textPart.substring(match[0].length).trim()
        // Remove leading colon or dash if present
        title = title.replace(/^[:\-]\s*/, '')
        found = true
        break
      }
    }
    
    if (!found) {
      // Default: first few words as outlet, rest as title
      const words = textPart.split(' ')
      if (words.length > 3) {
        outlet = words.slice(0, 2).join(' ')
        title = words.slice(2).join(' ')
      } else {
        outlet = words[0] || 'Unknown'
        title = words.slice(1).join(' ') || textPart
      }
    }
  }
  
  // Extract video ID and generate thumbnail
  const videoId = extractYouTubeVideoId(videoUrl)
  const videoThumbnail = videoId ? getYouTubeThumbnailUrl(videoId) : ''
  
  return {
    outlet: outlet || 'Unknown',
    title: title || 'Untitled',
    videoUrl: videoUrl,
    videoThumbnail: videoThumbnail,
    order: 0 // Will be set based on array index
  }
}

// Default video reports data
const videoReportsData = [
  'AlJazeera - The Listening Post | Inside India\'s expulsion of Bengali Muslims https://youtu.be/m-udJsQEu8I?si=c2ZOniTKduW3cn1L',
  'ITV News: Local community pays tribute to teenage boy killed in Air India disaster https://youtu.be/3EyeGvie-ZY?si=d9jAvOrbKZAyVadC',
  'ITV News: A week since the Air India disaster, the company\'s boss defends the airline safety record https://youtu.be/Qd744NpUWs0?si=znsXFQJnaBGJqCu9',
  'ABC Australia: Injured but willing to fight again, why Myanmar\'s rebel fighters cross into India https://youtu.be/73icmkPoucE?si=SRe9r66zHVlEXof8',
  'AlJazeera - The Listening Post | India\'s surprising election results and the verdict on the media https://youtu.be/wTITvNd0eHo?si=Bhi9CleHGNrirsr_',
  'The New York Times: How AI Tools Could Change India\'s Elections https://youtu.be/XXUvvn4Dczw?si=G1UVroiCS9xMFwqV',
  'AlJazeera - The Listening Post | India\'s local journalism under pressure: https://youtu.be/_R0hMNaqcns?si=wmgOH8UJrJT5Pwar&t=791',
  'The Guardian: The Hindu priest struggling to cremate India\'s Covid dead https://youtu.be/1MNRmHVL1Wc?si=3Z1STgjVQMKDvtkq',
  'Vice News Tonight: The Most Expensive Spice In the World Comes From Kashmir https://youtu.be/0AGcoEcaVJE?si=8amiXRQQFLgI6WjG',
  'Vice News Tonight: How China\'s Land Grab in India Could Push Modi Toward Trump https://youtu.be/g97sROQwwLk?si=OWRFqIoU1Ntv2ci6',
  'The New York Times: Inside India\'s Crackdown on Kashmir | The Dispatch https://youtu.be/rSE83h59reg?si=fmC3de75bL6PWuXf',
  'The Guardian: Defending Kashmir: Anchar\'s last stand against India\'s control https://youtu.be/_JtibKy_xkk?si=-946By2lU7akJj45'
]

async function migrateVideoReports() {
  try {
    console.log('Starting video reports migration...')
    
    // Check if video reports already exist
    const videoReportsRef = collection(db, 'videoReports')
    const existingReports = await getDocs(videoReportsRef)
    
    if (existingReports.size > 0) {
      console.log(`⚠️  Found ${existingReports.size} existing video reports in the database.`)
      console.log('This script will add new video reports. To replace all, delete existing ones first.')
    }
    
    // Parse and add video reports
    const parsedReports = []
    for (let i = 0; i < videoReportsData.length; i++) {
      const entry = videoReportsData[i]
      const parsed = parseVideoReportEntry(entry)
      
      if (parsed) {
        parsed.order = i
        parsedReports.push(parsed)
        console.log(`✓ Parsed: ${parsed.outlet} - ${parsed.title}`)
      } else {
        console.error(`✗ Failed to parse entry ${i + 1}:`, entry)
      }
    }
    
    // Add to Firestore
    let addedCount = 0
    let skippedCount = 0
    
    for (const report of parsedReports) {
      try {
        // Check if this video URL already exists
        const existingQuery = query(videoReportsRef, where('videoUrl', '==', report.videoUrl))
        const existing = await getDocs(existingQuery)
        
        if (existing.size > 0) {
          console.log(`⏭️  Skipping duplicate: ${report.outlet} - ${report.title}`)
          skippedCount++
          continue
        }
        
        await addDoc(videoReportsRef, {
          ...report,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        })
        
        addedCount++
        console.log(`✅ Added: ${report.outlet} - ${report.title}`)
      } catch (error) {
        console.error(`❌ Error adding ${report.outlet} - ${report.title}:`, error.message)
      }
    }
    
    console.log('\n📊 Migration Summary:')
    console.log(`   Total entries: ${videoReportsData.length}`)
    console.log(`   Successfully parsed: ${parsedReports.length}`)
    console.log(`   Added to database: ${addedCount}`)
    console.log(`   Skipped (duplicates): ${skippedCount}`)
    console.log(`   Errors: ${videoReportsData.length - parsedReports.length}`)
    console.log('\n✅ Migration completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateVideoReports()
  .then(() => {
    console.log('Migration script finished.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

