// Utility functions for about data
import { db } from './firebase'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  limit,
  Timestamp
} from 'firebase/firestore'

// Fetch about data (there should only be one document)
export async function getAbout() {
  try {
    const aboutRef = collection(db, 'about')
    const q = query(aboutRef, limit(1))
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return null
    }
    
    const doc = querySnapshot.docs[0]
    const data = doc.data()
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
    }
  } catch (error) {
    console.error('Error fetching about:', error)
    return null
  }
}

// Create or update about data (since there should only be one)
export async function saveAbout(aboutData) {
  try {
    const aboutRef = collection(db, 'about')
    const existing = await getAbout()
    
    const dataToSave = {
      ...aboutData,
      updatedAt: Timestamp.now()
    }
    
    if (existing) {
      // Update existing document
      const docRef = doc(db, 'about', existing.id)
      await updateDoc(docRef, dataToSave)
      return { success: true, id: existing.id }
    } else {
      // Create new document
      const dataWithTimestamps = {
        ...dataToSave,
        createdAt: Timestamp.now()
      }
      const docRef = await addDoc(aboutRef, dataWithTimestamps)
      return { success: true, id: docRef.id }
    }
  } catch (error) {
    console.error('Error saving about:', error)
    return { success: false, error: error.message }
  }
}
