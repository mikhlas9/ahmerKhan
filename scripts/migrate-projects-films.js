// Migration script for Films & Documentaries (3 projects)
// Run: node scripts/migrate-projects-films.js

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

const films = [
  {
    title: "Love Jihad in India's Uttar Pradesh",
    role: "Film Maker & Report",
    network: "TRT World",
    description: "Why has love become a crime in India's largest state? Uttar Pradesh's Hindutva far-right government is using recently enacted anti-conversion laws to target interfaith unions.",
    videoThumbnail: "https://img.youtube.com/vi/WXwcUK1-evo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=WXwcUK1-evo",
    type: "video",
    category: "films-documentaries",
    order: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "India Burning",
    role: "Film Maker & Report",
    network: "Vice News",
    description: "India has been engulfed in riots after the world's biggest democracy suddenly stripped nearly two million people of their citizenship. As the nation's leaders ramp up Hindu nationalist rhetoric, a newly-enacted law has signaled to India's 200 million Muslims that they are the true target. This could mean that they end up in one of the brand-new detention camps quietly being constructed across the country.",
    videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo",
    type: "video",
    category: "films-documentaries",
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Defending Kashmir: Anchar's last stand against India's control",
    role: "Film Maker & Report",
    network: "The Guardian",
    description: "People living in the suburb of Anchar are battling to keep security forces out. Since India stripped Jammu and Kashmir of its special status, the disputed region has been on security lockdown. Anchar, part of the main city of Srinagar, is thought to be the only major pocket of resistance",
    videoThumbnail: "https://img.youtube.com/vi/_JtibKy_xkk/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=_JtibKy_xkk",
    type: "video",
    category: "films-documentaries",
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting films & documentaries migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const projectsRef = collection(db, 'projects')
    
    for (const project of films) {
      await addDoc(projectsRef, project)
      console.log(`✅ Migrated: ${project.title}`)
    }
    
    console.log(`✅ Successfully migrated ${films.length} films & documentaries!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

