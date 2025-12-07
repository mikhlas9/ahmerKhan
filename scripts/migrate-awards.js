// Migration script for Awards
// Run: node scripts/migrate-awards.js

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

// Main Awards (6 awards)
const mainAwards = [
  {
    year: "2018",
    award: "Lorenzo Natali Price",
    title: "A school under metro bridge teaches Delhi children",
    outlet: "RFI",
    description: "There are millions of children of primary-school age in India who don't attend school. For some, school is too far away, others have to work at home and some can't afford to go.",
    image: "/images/a1.png",
    videoUrl: null,
    type: "award",
    order: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2019",
    award: "AFP's Kate Webb Prize",
    title: "Kashmir Reporting",
    outlet: "AFP",
    description: "Honoured for a series of video and written reports that vividly illustrated the impact on locals in the Muslim-majority area following India's decision to strip occupied Kashmir of its special status in August of last year.",
    image: "/images/a2.png",
    videoUrl: null,
    type: "award",
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2020",
    award: "Edward R. Murrow & Rory Peck Award",
    title: "India Burning",
    outlet: "VICE News",
    description: "Riots in India, citizenship stripping, Hindu nationalist rhetoric, and the targeting of 200 million Muslims for potential detention camps.",
    videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo",
    image: null,
    type: "award",
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2020",
    award: "Human Rights Press Award",
    title: "Defending Kashmir, Short film",
    outlet: "The Guardian",
    description: "People in Anchar battling security forces after Jammu and Kashmir's special status was revoked, leading to a security lockdown.",
    videoThumbnail: "https://img.youtube.com/vi/_JtibKy_xkk/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=_JtibKy_xkk",
    image: null,
    type: "award",
    order: 3,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Lovei Award",
    title: "Love Jihad in India's Uttar Pradesh",
    outlet: "TRT World",
    description: "Why has love become a crime in India's largest state? Uttar Pradesh's Hindutva far-right government is using recently enacted anti-conversion laws to target interfaith unions.",
    videoThumbnail: "https://img.youtube.com/vi/WXwcUK1-evo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=WXwcUK1-evo",
    image: null,
    type: "award",
    order: 4,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2023",
    award: "Martin Adler Prize",
    quote: "Ahmer Khan's journalism sheds light on some of the toughest and most heated issues in India, while his writing shows impact and sensitivity. He tackled one of the most difficult stories in one of the most difficult places. It's fearless reporting at its best.",
    attribution: "Martin Adler Prize Jury",
    image: "/images/a3.jpeg",
    type: "award",
    order: 5,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

// Recognition Awards (3 awards)
const recognitionAwards = [
  {
    year: "2020",
    award: "Emmy Awards",
    title: "India Burning",
    status: "Finalist",
    videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo",
    type: "recognition",
    order: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Scripps Howard Award",
    title: "India Burning",
    status: "Finalist",
    videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo",
    type: "recognition",
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2022",
    award: "Emmy Awards",
    title: "Inside India's Covid Hell",
    status: "Finalist",
    videoThumbnail: "https://img.youtube.com/vi/myb8GxLLpT0/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=myb8GxLLpT0",
    type: "recognition",
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting awards migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const awardsRef = collection(db, 'awards')
    
    // Migrate main awards
    console.log('📝 Migrating main awards...')
    for (const award of mainAwards) {
      await addDoc(awardsRef, award)
      console.log(`✅ Migrated: ${award.year} - ${award.award}`)
    }
    
    // Migrate recognition awards
    console.log('📝 Migrating recognition awards...')
    for (const award of recognitionAwards) {
      await addDoc(awardsRef, award)
      console.log(`✅ Migrated: ${award.year} - ${award.award}`)
    }
    
    console.log(`✅ Successfully migrated ${mainAwards.length} main awards and ${recognitionAwards.length} recognition awards!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

