// Migration script for Contact Information
// Run: node scripts/migrate-contact.js

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'
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

const contactData = {
  // Header
  title: "Get In Touch",
  description: "Available for editorial assignments, documentary projects, and speaking engagements. Let's collaborate on telling important stories.",
  
  // Contact Information
  email: "contact@example.com",
  phone: "+1 (234) 567-890",
  location: "Based in South Asia",
  locationDescription: "Available for international assignments",
  
  // EmailJS Configuration
  emailjsServiceId: "service_2e9v7qm",
  emailjsTemplateId: "template_bs2ax69",
  emailjsPublicKey: "aZResZzNAe34lYH2k",
  recipientEmail: "mohammadikhlas99@gmail.com",
  
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}

async function migrate() {
  try {
    console.log('🚀 Starting contact information migration...')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const contactRef = doc(db, 'contact', 'mainContact')
    
    await setDoc(contactRef, contactData, { merge: true })
    console.log('✅ Successfully migrated contact information!')
    console.log('📧 Email:', contactData.email)
    console.log('📞 Phone:', contactData.phone)
    console.log('📍 Location:', contactData.location)
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

