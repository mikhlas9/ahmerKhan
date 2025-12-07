// Utility functions for contact data
import { db } from './firebase'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  Timestamp
} from 'firebase/firestore'

const CONTACT_DOC_ID = 'mainContact'

const defaultContactData = {
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
  recipientEmail: "mohammadikhlas99@gmail.com"
}

// Fetch contact data
export async function getContactData() {
  try {
    const docRef = doc(db, 'contact', CONTACT_DOC_ID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      // If no data exists, initialize with default data
      await setDoc(docRef, {
        ...defaultContactData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      return defaultContactData
    }
  } catch (error) {
    console.error('Error fetching contact data:', error)
    return defaultContactData // Fallback to default data on error
  }
}

// Update contact data
export async function updateContactData(data) {
  try {
    const docRef = doc(db, 'contact', CONTACT_DOC_ID)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating contact data:', error)
    return { success: false, error: error.message }
  }
}

// Initialize contact data
export async function initializeContactData() {
  try {
    const docRef = doc(db, 'contact', CONTACT_DOC_ID)
    await setDoc(docRef, {
      ...defaultContactData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }, { merge: true })
    return { success: true, message: 'Contact data initialized successfully.' }
  } catch (error) {
    console.error('Error initializing contact data:', error)
    return { success: false, error: error.message }
  }
}

