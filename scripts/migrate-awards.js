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

// All Awards, Nominations & Honours (in exact order as provided)
const mainAwards = [
  {
    year: "2024",
    award: "Developing Asia Journalism Award (DAJA)",
    links: ["https://www.adb.org/adbi/news/adbi-awards-honor-works-of-journalism-urging-actions-for-accelerating-sustainable-transition"],
    order: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2024",
    award: "UNFPA–Laadli Media Award",
    links: ["https://populationfirst.org/wp-content/uploads/2025/01/Brochure-for-14LMA_final_compressed.pdf"],
    order: 1,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2024",
    award: "South Asia Laadli Media & Advertising Award",
    links: ["https://populationfirst.org/wp-content/uploads/2025/01/SALMAAGS-BROCHURE-2024_compressed.pdf"],
    order: 2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2023",
    award: "Martin Adler Prize",
    links: ["https://www.theguardian.com/gnm-press-office/2023/nov/17/guardian-filmmakers-win-at-the-rory-peck-awards"],
    order: 3,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2022",
    award: "Emmy Nomination",
    title: "India's Deadly Covid Wave series",
    status: "Nomination",
    links: ["https://theemmys.tv/wp-content/uploads/2022/09/43rd-NewsDoc-Nom-Release-with-Credits-rev-9.15.22-.pdf"],
    order: 4,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2022",
    award: "Daniel Pearl Award",
    status: "Nomination, South Asian Journalists Association (SAJA)",
    links: ["https://saja.org/page-935554?pg=3"],
    order: 5,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2022",
    award: "Best Documentary",
    status: "Nominee, Bucharest Film Awards",
    links: [],
    order: 6,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Alfred I. duPont–Columbia Award",
    links: ["https://dupont.org/news-and-updates/2021-dupont-columbia-awards"],
    order: 7,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Gold Lovie Award, Diversity, Equity & Inclusion category",
    status: "International Academy of Digital Arts and Sciences (IADAS)",
    links: ["https://x.com/ahmermkhan/status/1461003730220826626"],
    order: 8,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Edward R. Murrow Award, Overseas Press Club",
    links: ["https://opcofamerica.org/Awardarchive/the-edward-r-murrow-award-2020/"],
    order: 9,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "People's Lovie Award",
    status: "International Academy of Digital Arts and Sciences (IADAS)",
    links: ["https://x.com/ahmermkhan/status/1461003730220826626"],
    order: 10,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Deadline Club Award",
    status: "Finalist, Society of Professional Journalists",
    links: ["https://www.deadlineclub.org/2021-awards-finalists/"],
    order: 11,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Lovie Awards",
    status: "Finalist – News and Politics category – International Academy of Digital Arts and Sciences (IADAS)",
    links: ["https://x.com/ahmermkhan/status/1461003730220826626"],
    order: 12,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2021",
    award: "Scripps Howard Awards",
    status: "Finalist",
    links: ["https://scripps.com/press-releases/scripps-howard-awards-honor-best-of-2020-journalism-with-finalists-in-14-categories/"],
    order: 13,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2020",
    award: "Emmy Nomination",
    title: "VICE on Showtime",
    status: "Nomination",
    links: [
      "https://www.livemint.com/mint-lounge/features/emmy-2020-meet-kashmiri-journalist-ahmer-khan-nominated-for-a-caa-documentary/amp-11600604947598.html"
    ],
    order: 14,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2020",
    award: "Human Rights Press Award",
    links: ["https://www.kashmirpen.in/ahmer-khan-and-team-awarded-24th-human-rights-press-award/"],
    order: 15,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2020",
    award: "Rory Peck Award",
    status: "Finalist",
    links: ["https://rorypecktrust.org/awards/finalists/siddharth-bokolia-ahmer-khan/"],
    order: 16,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2019",
    award: "AFP Kate Webb Prize",
    links: ["https://www.afp.com/sites/default/files/afpcommunique/202002/pdf/prafpkatewebbprizeeng2020.pdf"],
    order: 17,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    year: "2018",
    award: "Lorenzo Natali Media Prize, European Commission",
    links: ["https://www.thekashmirmonitor.net/kashmiri-journalist-wins-lorenzo-natali-media-prize/"],
    order: 18,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

// Keep recognitionAwards empty for backward compatibility
const recognitionAwards = []

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
      console.log(`✅ Migrated: ${award.year || ''} - ${award.award}`)
    }
    
    // Migrate recognition awards (if any)
    if (recognitionAwards.length > 0) {
      console.log('📝 Migrating recognition awards...')
      for (const award of recognitionAwards) {
        await addDoc(awardsRef, award)
        console.log(`✅ Migrated: ${award.year || ''} - ${award.award}`)
      }
    }
    
    console.log(`✅ Successfully migrated ${mainAwards.length} awards!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

