// Utility functions for tearsheets data
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
  orderBy,
  Timestamp
} from 'firebase/firestore'

// Fetch all tearsheets
export async function getTearsheets() {
  try {
    const tearsheetsRef = collection(db, 'tearsheets')
    const q = query(tearsheetsRef)
    
    const querySnapshot = await getDocs(q)
    const tearsheets = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      tearsheets.push({
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
    tearsheets.sort((a, b) => {
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
    
    console.log(`Fetched ${tearsheets.length} tearsheets`)
    return tearsheets
  } catch (error) {
    console.error('Error fetching tearsheets:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    return []
  }
}

// Fetch a single tearsheet by ID
export async function getTearsheetById(tearsheetId) {
  try {
    const docRef = doc(db, 'tearsheets', tearsheetId)
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
    console.error('Error fetching tearsheet:', error)
    return null
  }
}

// Create a new tearsheet
export async function createTearsheet(tearsheetData) {
  try {
    const tearsheetsRef = collection(db, 'tearsheets')
    const dataToSave = {
      ...tearsheetData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    // If order is not provided, set it to a high number (will be added at end)
    if (!dataToSave.order) {
      const existingTearsheets = await getTearsheets()
      dataToSave.order = existingTearsheets.length
    }
    
    const docRef = await addDoc(tearsheetsRef, dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating tearsheet:', error)
    return { success: false, error: error.message }
  }
}

// Update an existing tearsheet
export async function updateTearsheet(tearsheetId, tearsheetData) {
  try {
    const docRef = doc(db, 'tearsheets', tearsheetId)
    const dataToSave = {
      ...tearsheetData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(docRef, dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Error updating tearsheet:', error)
    return { success: false, error: error.message }
  }
}

// Delete a tearsheet
export async function deleteTearsheet(tearsheetId) {
  try {
    const docRef = doc(db, 'tearsheets', tearsheetId)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting tearsheet:', error)
    return { success: false, error: error.message }
  }
}

