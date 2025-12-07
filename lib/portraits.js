// Utility functions for portraits data
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
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore'

// Portrait types
export const PORTRAIT_TYPES = {
  PORTRAIT: 'portrait',
  COUNTRY_PROJECT: 'country-project'
}

// Fetch all portraits (optionally filtered by type)
export async function getPortraits(type = null) {
  try {
    const portraitsRef = collection(db, 'portraits')
    let q
    
    // Build query - avoid orderBy with where to prevent index issues
    if (type) {
      q = query(portraitsRef, where('type', '==', type))
    } else {
      q = query(portraitsRef)
    }
    
    const querySnapshot = await getDocs(q)
    const portraits = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      portraits.push({
        id: doc.id,
        ...data,
        // Ensure order field exists (default to 999 if missing)
        order: data.order !== undefined ? data.order : 999,
        // Convert Firestore Timestamp to ISO string if needed
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      })
    })
    
    // Sort by order field first, then by createdAt
    portraits.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999
      const orderB = b.order !== undefined ? b.order : 999
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      // If order is same, sort by createdAt (newest first)
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bDate - aDate
    })
    
    console.log(`Fetched ${portraits.length} portraits for type: ${type || 'all'}`)
    return portraits
  } catch (error) {
    console.error('Error fetching portraits:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    return []
  }
}

// Fetch a single portrait by ID
export async function getPortraitById(portraitId) {
  try {
    const docRef = doc(db, 'portraits', portraitId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching portrait:', error)
    return null
  }
}

// Create a new portrait
export async function createPortrait(portraitData) {
  try {
    const portraitsRef = collection(db, 'portraits')
    const dataToSave = {
      ...portraitData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    // If order is not provided, set it to a high number (will be added at end)
    if (!dataToSave.order) {
      const existingPortraits = await getPortraits(portraitData.type)
      dataToSave.order = existingPortraits.length
    }
    
    const docRef = await addDoc(portraitsRef, dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating portrait:', error)
    return { success: false, error: error.message }
  }
}

// Update an existing portrait
export async function updatePortrait(portraitId, portraitData) {
  try {
    const docRef = doc(db, 'portraits', portraitId)
    const dataToSave = {
      ...portraitData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(docRef, dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Error updating portrait:', error)
    return { success: false, error: error.message }
  }
}

// Delete a portrait
export async function deletePortrait(portraitId) {
  try {
    const docRef = doc(db, 'portraits', portraitId)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting portrait:', error)
    return { success: false, error: error.message }
  }
}

