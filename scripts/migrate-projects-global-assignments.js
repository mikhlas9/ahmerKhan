// Migration script for Global Assignments (3 projects)
// Run: node scripts/migrate-projects-global-assignments.js

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

const assignments = [
  {
    title: "The Uighur and Syrian refugees making a home together in Turkey",
    role: "Photo Story",
    network: "Al Jazeera",
    description: "Kayseri, Turkey – In the quiet streets of a suburb of the historic central Anatolian city of Kayseri, a group of children play football. They are Uighurs and Syrians. Thirteen-year-old Moaaz is the oldest among them. He is one of the five children of Mohammad Taufeeq, 55, who fled with his family from the Syrian city of Homs six years ago. Two of his sons are now grown up and have moved away from home, while the younger three – Moaaz and his two sisters – live with their parents in Kayseri.",
    images: ["/images/ga1.png"],
    type: "photo",
    category: "global-assignments",
    order: 0,
    readMoreLink: "https://www.aljazeera.com/features/2021/3/4/the-uighur-and-syrian-refugees-making-a-home-together-in-turkey",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "These are the Rohingya Children who escaped Myanmar's 'Ethnic Cleansing'",
    role: "Photo Story",
    network: "Vice News",
    description: "She's one of the hundreds of thousands of Rohingya children who escaped a vicious military campaign by Myanmar's armed forces in late August that saw houses burned to the ground and widespread rape used as a weapon. The United Nations has since described the campaign as a \"textbook example of ethnic cleansing,\" with the organization's human rights chief telling reporters Tuesday he could not rule out \"elements of genocide.\"",
    images: ["/images/ga2.png"],
    type: "photo",
    category: "global-assignments",
    order: 1,
    readMoreLink: "https://www.vice.com/en/article/these-are-the-rohingya-children-who-escaped-myanmars-ethnic-cleansing/",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "In Sri Lanka, a Dying Livelihood, a Tourist Attraction",
    role: "Photographer",
    network: "The Diplomat",
    description: "WELIGAMA, SRI LANKA — A few dozen meters from the shoreline, fisherman T. H. Sena sits motionless on a wooden stilt, waiting for tourists to come and pose for pictures. A picture in return for money. Stilt fishing is a recent innovation, first adopted just after World War II when food shortages and overcrowded fishing spots prompted people to try fishing further out on the water. Two generations of fishermen have eked out this physically demanding existence at dawn and dusk along a 30-kilometer stretch of southern shore between the towns of Unawatuna and Weligama.",
    images: ["/images/ga3.png"],
    type: "photo",
    category: "global-assignments",
    order: 2,
    readMoreLink: "https://thediplomat.com/2018/06/in-sri-lanka-a-dying-livelihood-a-tourist-attraction/",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function migrate() {
  try {
    console.log('🚀 Starting global assignments migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const projectsRef = collection(db, 'projects')
    
    for (const project of assignments) {
      await addDoc(projectsRef, project)
      console.log(`✅ Migrated: ${project.title}`)
    }
    
    console.log(`✅ Successfully migrated ${assignments.length} global assignments!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

