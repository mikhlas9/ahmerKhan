// Migration script to send homepage static data to Firebase
// Run this once: node scripts/migrate-homepage.js

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables
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

async function migrateHomepage() {
  try {
    console.log('🚀 Starting homepage migration...')
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    // Homepage data from current static content
    // Bio is split into paragraphs (each <br /> becomes a new paragraph)
    const homepageData = {
      name: "AHMER KHAN",
      title: "Filmmaker & Investigative Journalist",
      bio: [
        "I am an award-winning independent multi-media journalist documenting conflict, human rights, and resilience across South Asia.",
        "Born and raised in the heart of conflict, I found my purpose in telling stories that matter.",
        "From capturing the struggles of the displaced to exposing human rights violations, my journey as a journalist has been about shedding light on the unseen. Whether through reporting, filmmaking, or investigative storytelling, I believe in the power of truth to spark change.",
        "Every frame, every word, and every story I tell is a testament to resilience, justice, and the voices that refuse to be silenced."
      ],
      credentials: "Emmy nominated | Al Jazeera | BBC | DCE Director",
      portraitImage: "/images/image.png", // Keep the path, we'll handle image upload separately
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    // Save to Firestore
    const docRef = doc(db, 'homepage', 'content')
    await setDoc(docRef, homepageData)
    
    console.log('✅ Homepage data migrated successfully!')
    console.log('📄 Document ID: homepage/content')
    console.log('📊 Data:', JSON.stringify(homepageData, null, 2))
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateHomepage()

