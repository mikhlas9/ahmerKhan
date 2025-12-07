// Utility functions for footer data
import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Fetch footer data from Firebase
export async function getFooterData() {
  try {
    const docRef = doc(db, 'footer', 'content')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      // Return default data if not found
      return getDefaultFooterData()
    }
  } catch (error) {
    console.error('Error fetching footer data:', error)
    return getDefaultFooterData()
  }
}

// Save footer data to Firebase
export async function saveFooterData(data) {
  try {
    const docRef = doc(db, 'footer', 'content')
    const dataToSave = {
      ...data,
      updatedAt: new Date().toISOString(),
    }
    await setDoc(docRef, dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Error saving footer data:', error)
    return { success: false, error: error.message }
  }
}

// Initialize footer with default data (for migration)
export async function initializeFooter() {
  try {
    const docRef = doc(db, 'footer', 'content')
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      const defaultData = getDefaultFooterData()
      await setDoc(docRef, defaultData)
      console.log('✅ Footer initialized with default data')
      return { success: true, message: 'Footer initialized' }
    } else {
      return { success: false, message: 'Footer already exists' }
    }
  } catch (error) {
    console.error('Error initializing footer:', error)
    return { success: false, error: error.message }
  }
}

// Default footer data
function getDefaultFooterData() {
  return {
    socialLinks: [
      { 
        name: 'X (Twitter)', 
        href: 'https://twitter.com',
        ariaLabel: 'Follow on X (Twitter)',
        enabled: true
      },
      { 
        name: 'Instagram', 
        href: 'https://instagram.com',
        ariaLabel: 'Follow on Instagram',
        enabled: true
      },
      { 
        name: 'LinkedIn', 
        href: 'https://linkedin.com',
        ariaLabel: 'Connect on LinkedIn',
        enabled: true
      },
      { 
        name: 'Vimeo', 
        href: 'https://vimeo.com',
        ariaLabel: 'Watch on Vimeo',
        enabled: true
      },
      { 
        name: 'Email', 
        href: 'mailto:contact@ahmerkhan.com',
        ariaLabel: 'Send an email',
        enabled: true
      },
    ],
    copyrightText: 'Ahmer Khan. All rights reserved.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

