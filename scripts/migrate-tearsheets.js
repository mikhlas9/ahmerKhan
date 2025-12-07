// Migration script for Tearsheets
// Run: node scripts/migrate-tearsheets.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
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

// Tearsheets (9 tearsheets)
const tearsheets = [
  {
    src: "/images/t1.jpg",
    alt: "Tearsheet 1",
    width: 600,
    height: 800,
    publication: "The Guardian",
    order: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t2.png",
    alt: "Tearsheet 2",
    width: 800,
    height: 600,
    publication: "National Geographic",
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t3.jpg",
    alt: "Tearsheet 3",
    width: 700,
    height: 500,
    publication: "BBC",
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t4.png",
    alt: "Tearsheet 4",
    width: 600,
    height: 800,
    publication: "Al Jazeera",
    order: 3,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t5.png",
    alt: "Tearsheet 5",
    width: 800,
    height: 600,
    publication: "Vice News",
    order: 4,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t6.png",
    alt: "Tearsheet 6",
    width: 700,
    height: 500,
    publication: "AFP",
    order: 5,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t7.png",
    alt: "Tearsheet 7",
    width: 600,
    height: 800,
    publication: "TRT World",
    order: 6,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t8.jpg",
    alt: "Tearsheet 8",
    width: 800,
    height: 600,
    publication: "RFI",
    order: 7,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/t9.png",
    alt: "Tearsheet 9",
    width: 700,
    height: 500,
    publication: "Reuters",
    order: 8,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting tearsheets migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const tearsheetsRef = collection(db, 'tearsheets')
    
    // Migrate tearsheets
    console.log('📝 Migrating tearsheets...')
    for (const tearsheet of tearsheets) {
      await addDoc(tearsheetsRef, tearsheet)
      console.log(`✅ Migrated: ${tearsheet.alt} - ${tearsheet.publication}`)
    }
    
    console.log(`✅ Successfully migrated ${tearsheets.length} tearsheets!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

