// Utility functions for documentaries data
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

// Fetch all documentaries
export async function getDocumentaries() {
  try {
    const documentariesRef = collection(db, 'documentaries')
    const q = query(documentariesRef, orderBy('order', 'asc'))
    
    const querySnapshot = await getDocs(q)
    const documentaries = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      documentaries.push({
        id: doc.id,
        ...data,
        // Ensure order field exists (default to 999 if missing)
        order: data.order !== undefined ? data.order : 999,
        // Convert Firestore Timestamp to ISO string if needed
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      })
    })
    
    // Sort by order field
    documentaries.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999
      const orderB = b.order !== undefined ? b.order : 999
      return orderA - orderB
    })
    
    console.log(`Fetched ${documentaries.length} documentaries`)
    return documentaries
  } catch (error) {
    console.error('Error fetching documentaries:', error)
    return []
  }
}

// Fetch a single documentary by ID
export async function getDocumentaryById(docId) {
  try {
    const docRef = doc(db, 'documentaries', docId)
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
    console.error('Error fetching documentary:', error)
    return null
  }
}

// Create a new documentary
export async function createDocumentary(docData) {
  try {
    const documentariesRef = collection(db, 'documentaries')
    const dataToSave = {
      ...docData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    // If order is not provided, set it to a high number (will be added at end)
    if (!dataToSave.order) {
      const existingDocs = await getDocumentaries()
      dataToSave.order = existingDocs.length
    }
    
    const docRef = await addDoc(documentariesRef, dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating documentary:', error)
    return { success: false, error: error.message }
  }
}

// Update an existing documentary
export async function updateDocumentary(docId, docData) {
  try {
    const docRef = doc(db, 'documentaries', docId)
    const dataToSave = {
      ...docData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(docRef, dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Error updating documentary:', error)
    return { success: false, error: error.message }
  }
}

// Delete a documentary
export async function deleteDocumentary(docId) {
  try {
    const docRef = doc(db, 'documentaries', docId)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting documentary:', error)
    return { success: false, error: error.message }
  }
}

