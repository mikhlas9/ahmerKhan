// Utility functions for awards data
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

// Award types
export const AWARD_TYPES = {
  AWARD: 'award',
  RECOGNITION: 'recognition'
}

// Fetch all awards (optionally filtered by type)
export async function getAwards(type = null) {
  try {
    const awardsRef = collection(db, 'awards')
    let q
    
    // Build query - avoid orderBy with where to prevent index issues
    if (type) {
      q = query(awardsRef, where('type', '==', type))
    } else {
      q = query(awardsRef)
    }
    
    const querySnapshot = await getDocs(q)
    const awards = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      awards.push({
        id: doc.id,
        ...data,
        // Ensure order field exists (default to 999 if missing)
        order: data.order !== undefined ? data.order : 999,
        // Convert Firestore Timestamp to ISO string if needed
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      })
    })
    
    // Sort by order field first, then by year (descending), then by createdAt
    awards.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999
      const orderB = b.order !== undefined ? b.order : 999
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      // If order is same, sort by year (newest first)
      const yearA = parseInt(a.year) || 0
      const yearB = parseInt(b.year) || 0
      if (yearA !== yearB) {
        return yearB - yearA
      }
      
      // If year is same, sort by createdAt (newest first)
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bDate - aDate
    })
    
    console.log(`Fetched ${awards.length} awards for type: ${type || 'all'}`)
    return awards
  } catch (error) {
    console.error('Error fetching awards:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    return []
  }
}

// Fetch a single award by ID
export async function getAwardById(awardId) {
  try {
    const docRef = doc(db, 'awards', awardId)
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
    console.error('Error fetching award:', error)
    return null
  }
}

// Create a new award
export async function createAward(awardData) {
  try {
    const awardsRef = collection(db, 'awards')
    const dataToSave = {
      ...awardData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    // If order is not provided, set it to a high number (will be added at end)
    if (!dataToSave.order) {
      const existingAwards = await getAwards(awardData.type)
      dataToSave.order = existingAwards.length
    }
    
    const docRef = await addDoc(awardsRef, dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating award:', error)
    return { success: false, error: error.message }
  }
}

// Update an existing award
export async function updateAward(awardId, awardData) {
  try {
    const docRef = doc(db, 'awards', awardId)
    const dataToSave = {
      ...awardData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(docRef, dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Error updating award:', error)
    return { success: false, error: error.message }
  }
}

// Delete an award
export async function deleteAward(awardId) {
  try {
    const docRef = doc(db, 'awards', awardId)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting award:', error)
    return { success: false, error: error.message }
  }
}

