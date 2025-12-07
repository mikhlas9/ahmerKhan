// Script to create admin user in Firebase Authentication
// Run: node scripts/setup-admin-user.js
// 
// IMPORTANT: This script creates a user in Firebase Auth.
// You should run this once to set up the initial admin account.
// After running, you can log in with the email and password you provide.

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import readline from 'readline'

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupAdminUser() {
  try {
    console.log('🔐 Admin User Setup')
    console.log('==================\n')
    
    const email = await question('Enter admin email: ')
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address')
      process.exit(1)
    }

    const password = await question('Enter admin password (min 6 characters): ')
    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters')
      process.exit(1)
    }

    console.log('\n🚀 Creating admin user...')
    
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${userCredential.user.email}`)
    console.log(`🆔 User ID: ${userCredential.user.uid}`)
    console.log('\n✨ You can now log in at /login with these credentials')
    
    rl.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('⚠️  This email is already registered. You can use it to log in.')
    } else if (error.code === 'auth/weak-password') {
      console.error('⚠️  Password is too weak. Please use a stronger password.')
    } else if (error.code === 'auth/invalid-email') {
      console.error('⚠️  Invalid email address.')
    }
    
    rl.close()
    process.exit(1)
  }
}

setupAdminUser()

