// Migration script for About page
// Run: node scripts/migrate-about.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, limit } from 'firebase/firestore'
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

const aboutBio = [
  'Ahmer Khan is a multimedia journalist, filmmaker, and photographer who has spent over a decade documenting politics, conflict, migration, and humanitarian crises across South Asia. His work spans video documentary, long-form photography, and written journalism, often weaving these forms together to tell a single story from multiple angles. He approaches each story as both a witness and a guide, bringing audiences into the lives of people navigating war, displacement, and injustice. His aim is not just to report what happened, but to create work that lingers—that shifts how audiences see the world.',
  'Ahmer has earned multiple major international awards and nominations to date, including two Emmy nominations. His work has been published in over 40 global media outlets, including The New York Times, The Guardian, Al Jazeera, Vice News on HBO, CNN, and TIME. His reporting and documentary work has sparked conversations around some of South Asia\'s most urgent crises, reaching audiences across continents and generations.',
  'In the documentary landscape, Ahmer is also an accomplished filmmaker and editor. His documentary work has been recognized with an Overseas Press Club Award, the DuPont-Columbia Silver Baton, the Edward R. Murrow Award, the Human Rights Press Award, and the AFP Kate Webb Prize, among others. His stories have been nominated for International Emmy Awards in 2021 and 2022, cementing his status as one of the region\'s most compelling visual storytellers.',
  'His work often requires managing high-stakes reporting, whether in terms of physical danger or editorial sensitivity. He has years of experience navigating complex security, legal, and political challenges in conflict zones and restricted areas. Ahmer has reported from India, Bangladesh, Afghanistan, Nepal, Sri Lanka, and Turkey, covering the Nepal earthquake, the Rohingya refugee crisis, the COVID-19 pandemic, Kashmir\'s communications lockdown, India\'s controversial citizenship law, and climate-driven child trafficking.',
  'In 2023, Ahmer served as a judge for the International Emmy Awards. He has previously led multimedia storytelling campaigns for Amnesty International South Asia and worked briefly with the World Health Organization during the 2015 Nepal earthquake, handling communications and coordination. He has shared his expertise through talks and teaching at institutions including IILM University.',
  'Most recently, Ahmer is a Humanitarian Reporting Fellow at The New Humanitarian, where he is reporting from India and the subcontinent. Through the fellowship, he is working to bring deeper local insight to humanitarian issues and challenge traditional models of representing crises and affected communities.',
  'His work has taken him to many of the subcontinent\'s most challenging environments. He lives between Delhi and Srinagar.'
]

const aboutData = {
  bio: aboutBio,
  imagePath: '/images/profile.jpeg',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}

async function migrate() {
  try {
    console.log('🚀 Starting about page migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const aboutRef = collection(db, 'about')
    
    // Check if about data already exists
    const q = query(aboutRef, limit(1))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      console.log('⚠️  About data already exists. Skipping migration.')
      console.log('   To update, use the admin panel at /admin/about')
      process.exit(0)
    }
    
    // Migrate about data
    console.log('📝 Migrating about page data...')
    await addDoc(aboutRef, aboutData)
    console.log('✅ Successfully migrated about page data!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()
