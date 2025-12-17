// Utility functions for homepage data
import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Fetch homepage data from Firebase
export async function getHomepageData() {
  try {
    const docRef = doc(db, 'homepage', 'content')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      // Return default data if not found
      return getDefaultHomepageData()
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return getDefaultHomepageData()
  }
}

// Save homepage data to Firebase
export async function saveHomepageData(data) {
  try {
    const docRef = doc(db, 'homepage', 'content')
    const dataToSave = {
      ...data,
      updatedAt: new Date().toISOString(),
    }
    await setDoc(docRef, dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Error saving homepage data:', error)
    return { success: false, error: error.message }
  }
}

// Initialize homepage with default data (for migration)
export async function initializeHomepage() {
  try {
    const docRef = doc(db, 'homepage', 'content')
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      const defaultData = getDefaultHomepageData()
      await setDoc(docRef, defaultData)
      console.log('✅ Homepage initialized with default data')
      return { success: true, message: 'Homepage initialized' }
    } else {
      return { success: false, message: 'Homepage already exists' }
    }
  } catch (error) {
    console.error('Error initializing homepage:', error)
    return { success: false, error: error.message }
  }
}

// Default homepage data
function getDefaultHomepageData() {
  return {
    mediaType: "image",
    mediaUrl: "/images/home.jpeg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

