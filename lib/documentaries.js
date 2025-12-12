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
  Timestamp,
  writeBatch
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
    const existingDocs = await getDocumentaries()
    
    // Determine the order for the new item
    let newOrder
    if (docData.order && docData.order >= 1) {
      newOrder = docData.order
    } else {
      // Auto-assign: max order + 1
      const validOrders = existingDocs
        .map(d => d.order || 0)
        .filter(order => order >= 1)
      const maxOrder = validOrders.length > 0 
        ? Math.max(...validOrders)
        : 0
      newOrder = maxOrder + 1
    }
    
    // If inserting at a specific order, shift existing items with order >= newOrder up by 1
    const batch = writeBatch(db)
    let needsShift = false
    
    existingDocs.forEach((documentary) => {
      if (documentary.order >= 1 && documentary.order >= newOrder) {
        const otherDocRef = doc(db, 'documentaries', documentary.id)
        batch.update(otherDocRef, {
          order: documentary.order + 1,
          updatedAt: Timestamp.now()
        })
        needsShift = true
      }
    })
    
    // Commit the order shifts first (if any)
    if (needsShift) {
      await batch.commit()
    }
    
    // Now create the new item with the specified order
    const dataToSave = {
      ...docData,
      order: newOrder,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
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
    
    // Get the current document to check old order
    const currentDoc = await getDoc(docRef)
    if (!currentDoc.exists()) {
      return { success: false, error: 'Documentary not found' }
    }
    
    const oldData = currentDoc.data()
    const oldOrder = oldData.order || 999
    let newOrder = docData.order !== undefined ? docData.order : oldOrder
    
    // Ensure order is at least 1
    if (newOrder < 1) {
      newOrder = 1
    }
    
    // If order is changing, we need to adjust other items
    if (oldOrder !== newOrder) {
      const allDocs = await getDocumentaries()
      const batch = writeBatch(db)
      
      // Update the current item with corrected order
      const dataToSave = {
        ...docData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
      batch.update(docRef, dataToSave)
      
      // Adjust other items' orders
      if (newOrder < oldOrder) {
        // Moving to a lower order (e.g., from 3 to 1)
        // Shift items with order >= newOrder and < oldOrder up by 1
        allDocs.forEach((documentary) => {
          if (documentary.id !== docId && documentary.order >= 1 && documentary.order >= newOrder && documentary.order < oldOrder) {
            const otherDocRef = doc(db, 'documentaries', documentary.id)
            batch.update(otherDocRef, {
              order: documentary.order + 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      } else {
        // Moving to a higher order (e.g., from 1 to 3)
        // Shift items with order > oldOrder and <= newOrder down by 1
        allDocs.forEach((documentary) => {
          if (documentary.id !== docId && documentary.order >= 1 && documentary.order > oldOrder && documentary.order <= newOrder) {
            const otherDocRef = doc(db, 'documentaries', documentary.id)
            batch.update(otherDocRef, {
              order: documentary.order - 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      }
      
      await batch.commit()
    } else {
      // No order change, just update normally (but ensure order is at least 1)
      const dataToSave = {
        ...docData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
      await updateDoc(docRef, dataToSave)
    }
    
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
    
    // Get the item being deleted to know its order
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return { success: false, error: 'Documentary not found' }
    }
    
    const deletedOrder = docSnap.data().order || 999
    
    // Delete the item
    await deleteDoc(docRef)
    
    // Adjust orders of remaining items: shift down items with order > deletedOrder
    const allDocs = await getDocumentaries()
    const batch = writeBatch(db)
    
    allDocs.forEach((documentary) => {
      if (documentary.order >= 1 && documentary.order > deletedOrder) {
        const otherDocRef = doc(db, 'documentaries', documentary.id)
        batch.update(otherDocRef, {
          order: documentary.order - 1,
          updatedAt: Timestamp.now()
        })
      }
    })
    
    if (allDocs.some(d => d.order > deletedOrder)) {
      await batch.commit()
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting documentary:', error)
    return { success: false, error: error.message }
  }
}

