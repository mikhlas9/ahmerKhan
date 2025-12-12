/**
 * Migration script for documentaries
 * 
 * This script initializes the documentaries collection in Firestore with default data.
 * 
 * Usage:
 *   node scripts/migrate-documentaries.js
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
function parseDocumentaryEntry(entry) {
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
      /^(The New York Times|The Guardian|AlJazeera|Al Jazeera|Vice|VICE|SCMP|TRT World|The Intercept|Context News|Rai TV)/i
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

// Default documentaries data
const documentariesData = [
  'The Guardian | Can Delhi clean up its toxic trash mountains? https://youtu.be/oRzkXGi153o?si=l4djMc9G96sRcq14',
  'AlJazeera - The Listening Post | "More noise, less information" Indian media\'s credibility crisis https://youtu.be/NLR9D4o2pqc?si=T1JZfw4TegKbg9CQ',
  'Rai TV: India: Hyderabad – "The most surveilled city." https://youtu.be/Z7z84X-GfV8?si=CEyvRcdjyGgLsURg',
  'The Guardian: The fake news divide: how Modi\'s rule is fracturing India https://youtu.be/sVr7g_8f-MA?si=NbXu8ComOLJHQ5TP',
  'AlJazeera - The Listening Post | How \'smart cities\' make us more watched than ever before https://youtu.be/oTZ80nLbz70?si=sEMp-x-gIhenEJ6i',
  'Context News: The spray that makes mangoes last longer https://youtu.be/67cHPpyEW3g?si=ZzzdrzrOWQ6PBBBo',
  'SCMP News: The coin divers of India https://youtu.be/aNcOfmH_Q_g?si=xDVftq8_GQowrBuO',
  'The Guardian: The hunt for India\'s stolen children https://youtu.be/fBo4NXHxoiY?si=aHAwDI13OOTwJG_W',
  'SCMP News: Fighting to save the last trams of India https://youtu.be/1JTQNXY_ufA?si=EKmWtB-rl4EpYsrx',
  'Vice News Tonight | India Is Stripping Muslims of their Homes and Rights https://youtu.be/czzTAjFGWJQ?si=tpdtiXG5wNs_xfyi',
  'The Guardian | Love Jihad: India\'s lethal religious conspiracy theory https://youtu.be/8ZoCEA_V8GA?si=zYBUXn-W_zKg-NFi',
  'Vice News Tonight on HBO: The Hindu Extremists at War With Interfaith Love https://youtu.be/jol-Rf69gxw?si=X9b4o3ONmnyZcXUy',
  'SCMP News: Health workers trek to remote areas to bring Covid-19 vaccines to Indian-administered Kashmir https://youtu.be/nd9hxwnzxhs?si=m9pe49hx7u2uv8lC',
  'TRT World: Love Jihad in India\'s Uttar Pradesh https://youtu.be/WXwcUK1-evo?si=7ahKnwjoZh0LWZYX',
  'The Intercept: The Vaccine Divide https://youtu.be/p_oAUu_HeGY?si=FzUVLeAZ-Mh5lWVk',
  'Vice News Tonight on HBO: India\'s COVID Crisis Is Making Oxygen Scammers Rich https://youtu.be/O6IjFdGZHmI?si=LICoLPiX1FMCV88c',
  'Vice News Tonight on HBO: Inside India\'s Covid Hell https://youtu.be/myb8GxLLpT0?si=_y8VOGKfrXZmuGgN',
  'AlJazeera - The Listening Post | Silenced and shut down: Kashmir\'s year of lockdown https://youtu.be/fOtLcsgGwmk?si=q8e3OW2zpZlyoA0b',
  'VICE on SHOWTIME: India Burning https://youtu.be/MCyBL8dBOEo?si=4J1PVTUs8-TrNAg5',
  'The New York Times: Inside the Kashmir That India Doesn\'t Want the World to See https://youtu.be/nyC_Xq8_qYQ?si=BdbSYXCGndUf0FgV'
]

async function migrateDocumentaries() {
  try {
    console.log('Starting documentaries migration...')
    
    // Check if documentaries already exist
    const documentariesRef = collection(db, 'documentaries')
    const existingDocs = await getDocs(documentariesRef)
    
    if (existingDocs.size > 0) {
      console.log(`⚠️  Found ${existingDocs.size} existing documentaries in the database.`)
      console.log('This script will add new documentaries. To replace all, delete existing ones first.')
    }
    
    // Parse and add documentaries
    const parsedDocumentaries = []
    for (let i = 0; i < documentariesData.length; i++) {
      const entry = documentariesData[i]
      const parsed = parseDocumentaryEntry(entry)
      
      if (parsed) {
        parsed.order = i
        parsedDocumentaries.push(parsed)
        console.log(`✓ Parsed: ${parsed.outlet} - ${parsed.title}`)
      } else {
        console.error(`✗ Failed to parse entry ${i + 1}:`, entry)
      }
    }
    
    // Add to Firestore
    let addedCount = 0
    let skippedCount = 0
    
    for (const doc of parsedDocumentaries) {
      try {
        // Check if this video URL already exists
        const existingQuery = query(documentariesRef, where('videoUrl', '==', doc.videoUrl))
        const existing = await getDocs(existingQuery)
        
        if (existing.size > 0) {
          console.log(`⏭️  Skipping duplicate: ${doc.outlet} - ${doc.title}`)
          skippedCount++
          continue
        }
        
        await addDoc(documentariesRef, {
          ...doc,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        })
        
        addedCount++
        console.log(`✅ Added: ${doc.outlet} - ${doc.title}`)
      } catch (error) {
        console.error(`❌ Error adding ${doc.outlet} - ${doc.title}:`, error.message)
      }
    }
    
    console.log('\n📊 Migration Summary:')
    console.log(`   Total entries: ${documentariesData.length}`)
    console.log(`   Successfully parsed: ${parsedDocumentaries.length}`)
    console.log(`   Added to database: ${addedCount}`)
    console.log(`   Skipped (duplicates): ${skippedCount}`)
    console.log(`   Errors: ${documentariesData.length - parsedDocumentaries.length}`)
    console.log('\n✅ Migration completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateDocumentaries()
  .then(() => {
    console.log('Migration script finished.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

