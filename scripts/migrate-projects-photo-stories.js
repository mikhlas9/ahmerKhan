// Migration script for Photo Stories (3 projects)
// Run: node scripts/migrate-projects-photo-stories.js

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

const photoStories = [
  {
    title: "On Kolkata's trams, a journey through the city's 'soul'",
    role: "Photo Journalist",
    network: "The Christian Science Monitor",
    description: "As electric trams slowly rumble through the vibrant neighborhoods of Kolkata, formerly known as Calcutta, they take the passengers on a journey back in time. Part of the cultural fabric of the city for more than a century, the tram system has been allowed to atrophy for a lack of riders. Now, enthusiasts and climate activists are fighting to keep tram service as an eco-friendly transportation option.",
    quote: "\"Trams are a great way to reduce emissions in the city,\" says Debasish Bhattacharyya, president of the Calcutta Tramways Users' Association (CTUA). \"In a time of climate crisis, we need to embrace modes of transport that are sustainable and efficient.\"",
    images: ["/images/ps1.png"],
    type: "photo",
    category: "photo-stories",
    order: 0,
    readMoreLink: "https://www.csmonitor.com/The-Culture/2023/0420/In-Pictures-On-Kolkata-s-trams-a-journey-through-the-city-s-soul",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "'A dying art': India's female seaweed divers look to a brighter future for their girls",
    role: "Photographer",
    network: "The Guardian",
    description: "With sacks tied around their saris and well-used goggles as their only equipment, the seaweed collectors of India's south-east coast have been diving in the Gulf of Mannar for decades, passing skills from mother to daughter. The women spend six hours a day in the sea, diving up to 4 metres (13ft) to harvest the seaweed from sharp rocks, holding their breath as they tuck the fronds into bags tied around their waists.",
    images: ["/images/ps2.png"],
    type: "photo",
    category: "photo-stories",
    order: 1,
    readMoreLink: "https://www.theguardian.com/global-development/2023/jun/30/dying-art-india-female-seaweed-divers-look-to-a-brighter-future-for-their-girls",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "'I trusted him': human trafficking surges in cyclone-hit east India",
    role: "Photographer",
    network: "The Guardian",
    description: "It began gently at first, as a romantic relationship with Rubik, an older man from out of town. He promised her a better life, away from the devastation that Cyclone Amphan had left in their village. But what started as hope quickly turned into a nightmare of exploitation and human trafficking. Already an area where destitution is rife, and about 50% live below the poverty line, the Sundarbans is now on the forefront of the climate crisis. It is the area of India most regularly affected by cyclones, including three super cyclones in the past four years that killed hundreds of people, decimated homes and livelihoods and left the land salinated and arid.",
    images: ["/images/ps3.png"],
    type: "photo",
    category: "photo-stories",
    order: 2,
    readMoreLink: "https://www.theguardian.com/world/2023/jun/13/i-trusted-him-human-trafficking-surges-in-cyclone-hit-east-india",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting photo stories migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const projectsRef = collection(db, 'projects')
    
    for (const project of photoStories) {
      await addDoc(projectsRef, project)
      console.log(`✅ Migrated: ${project.title}`)
    }
    
    console.log(`✅ Successfully migrated ${photoStories.length} photo stories!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

