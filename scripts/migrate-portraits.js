// Migration script for Portraits
// Run: node scripts/migrate-portraits.js

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

// Main Portraits (8 portraits)
const mainPortraits = [
  {
    src: "/images/po1.png",
    alt: "Portrait 1",
    width: 400,
    height: 600,
    type: "portrait",
    order: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/po2.png",
    alt: "Portrait 2",
    width: 600,
    height: 600,
    type: "portrait",
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/po3.png",
    alt: "Portrait 3",
    width: 500,
    height: 400,
    type: "portrait",
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/po4.png",
    alt: "Portrait 4",
    width: 600,
    height: 400,
    type: "portrait",
    order: 3,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/po5.png",
    alt: "Portrait 5",
    width: 400,
    height: 600,
    type: "portrait",
    order: 4,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/po6.png",
    alt: "Portrait 6",
    width: 500,
    height: 400,
    type: "portrait",
    order: 5,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/po7.png",
    alt: "Portrait 7",
    width: 500,
    height: 500,
    type: "portrait",
    order: 6,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    src: "/images/po8.png",
    alt: "Portrait 8",
    width: 600,
    height: 500,
    type: "portrait",
    order: 7,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

// Country Projects (4 projects)
const countryProjects = [
  {
    name: "Bangladesh",
    image: "/images/poc1.png",
    link: "#",
    type: "country-project",
    order: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Afghanistan",
    image: "/images/poc2.png",
    link: "#",
    type: "country-project",
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Sri Lanka",
    image: "/images/poc3.png",
    link: "#",
    type: "country-project",
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "South Korea",
    image: "/images/poc4.png",
    link: "#",
    type: "country-project",
    order: 3,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting portraits migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const portraitsRef = collection(db, 'portraits')
    
    // Migrate main portraits
    console.log('📝 Migrating main portraits...')
    for (const portrait of mainPortraits) {
      await addDoc(portraitsRef, portrait)
      console.log(`✅ Migrated: ${portrait.alt}`)
    }
    
    // Migrate country projects
    console.log('📝 Migrating country projects...')
    for (const project of countryProjects) {
      await addDoc(portraitsRef, project)
      console.log(`✅ Migrated: ${project.name}`)
    }
    
    console.log(`✅ Successfully migrated ${mainPortraits.length} portraits and ${countryProjects.length} country projects!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

