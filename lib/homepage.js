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

// Default homepage data (matches current static content)
function getDefaultHomepageData() {
  return {
    name: "AHMER KHAN",
    title: "Filmmaker & Investigative Journalist",
    bio: [
      "I am an award-winning independent multi-media journalist documenting conflict, human rights, and resilience across South Asia.",
      "Born and raised in the heart of conflict, I found my purpose in telling stories that matter.",
      "From capturing the struggles of the displaced to exposing human rights violations, my journey as a journalist has been about shedding light on the unseen. Whether through reporting, filmmaking, or investigative storytelling, I believe in the power of truth to spark change.",
      "Every frame, every word, and every story I tell is a testament to resilience, justice, and the voices that refuse to be silenced."
    ],
    credentials: "Emmy nominated | Al Jazeera | BBC | DCE Director",
    portraitImage: "/images/image.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

