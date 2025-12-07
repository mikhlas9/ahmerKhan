// Migration script for Main Projects (2 projects)
// Run: node scripts/migrate-projects-main.js

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

const mainProjects = [
  {
    title: "'I TRUSTED HIM': HUMAN TRAFFICKING SURGES IN CYCLONE-HIT EAST INDIA",
    role: "Photo Journalist",
    network: "The Guardian",
    description: "It began gently at first, as a romantic relationship with Rubik, an older man from out of town. He promised her a better life, away from the devastation that Cyclone Amphan had left in their village. But what started as hope quickly turned into a nightmare of exploitation and human trafficking. Already an area where destitution is rife, and about 50% live below the poverty line, the Sundarbans is now on the forefront of the climate crisis. It is the area of India most regularly affected by cyclones, including three super cyclones in the past four years that killed hundreds of people, decimated homes and livelihoods and left the land salinated and arid.",
    images: ["/images/p1.png", "/images/p2.png"],
    type: "photo",
    category: "all",
    order: 0,
    readMoreLink: "https://www.theguardian.com/world/2023/jun/13/i-trusted-him-human-trafficking-surges-in-cyclone-hit-east-india",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "THE HINDU EXTREMISTS AT WAR WITH INTERFAITH LOVE",
    role: "Video Journalist",
    network: "Vice News Tonight",
    description: "Hindu nationalist vigilantes believe India is in the grips of an Islamic plot called 'Love Jihad'. They patrol the streets, breaking up relationships between Hindu women and Muslim men, often through violence and intimidation.",
    videoThumbnail: "https://img.youtube.com/vi/jol-Rf69gxw/maxresdefault.jpg",
    videoTitle: "The Hindu Extremists at War With Interfaith Love",
    videoUrl: "https://www.youtube.com/watch?v=jol-Rf69gxw",
    type: "video",
    category: "all",
    order: 1,
    readMoreLink: "#",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting main projects migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const projectsRef = collection(db, 'projects')
    
    for (const project of mainProjects) {
      await addDoc(projectsRef, project)
      console.log(`✅ Migrated: ${project.title}`)
    }
    
    console.log(`✅ Successfully migrated ${mainProjects.length} main projects!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

