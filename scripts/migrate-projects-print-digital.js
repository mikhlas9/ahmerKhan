// Migration script for Print & Digital Features (3 projects)
// Run: node scripts/migrate-projects-print-digital.js

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

const features = [
  {
    title: "Muslims in India are Losing Their Rights and Homes",
    role: "Photo Journalist",
    network: "Vice News",
    description: "ASSAM, India – Gayas-ud-din Ahmed thought his children would grow up in the same home that he was born and raised in. But in November, he was given a three-day eviction notice. Ahmed gave his son a hammer and told him to help with the deconstruction. They're moving parts of their house to set up a shelter at a temporary camp with thousands of other Muslims.",
    images: ["/images/pdf1.png"],
    type: "photo",
    category: "print-digital-features",
    order: 0,
    readMoreLink: "https://www.vice.com/en/article/muslim-evictions-assam-india-citizenship-rights/",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Inside India's Covid Hell",
    role: "Photographer",
    network: "Vice News",
    description: "India's crematoriums and hospitals can't keep up with a second wave of Covid-19 patients. Priests are working 24 hour days to perform last rites, people are buying medicine off the black market, and hospitals are running out of oxygen as India faces around 400,000 new cases, and more than 3,000 deaths a day.",
    videoThumbnail: "https://img.youtube.com/vi/myb8GxLLpT0/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=myb8GxLLpT0",
    type: "video",
    category: "print-digital-features",
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Health workers trek to remote areas to bring Covid-19 vaccines to Indian-administered Kashmir",
    role: "Report",
    network: "South China Morning Post",
    description: "A massive vaccination drive is under way in India to protect as many people as possible from the coronavirus pandemic, which has crippled the country's healthcare system and left millions infected and hundreds of thousands dead. Despite being a leading manufacturer of a Covid-19 vaccine, vaccinating its own population has proved challenging, not least because of the difficulties reaching remote areas, including in places such as Indian-administered Kashmir. Health teams must spend an entire day travelling by several modes of transportation to reach nomadic populations that are often wary of the government. But the medical workers who embark on these vaccination missions believe it's the only way India can win its fight against Covid-19.",
    videoThumbnail: "https://img.youtube.com/vi/nd9hxwnzxhs/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=nd9hxwnzxhs",
    type: "video",
    category: "print-digital-features",
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting print & digital features migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const projectsRef = collection(db, 'projects')
    
    for (const project of features) {
      await addDoc(projectsRef, project)
      console.log(`✅ Migrated: ${project.title}`)
    }
    
    console.log(`✅ Successfully migrated ${features.length} print & digital features!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

