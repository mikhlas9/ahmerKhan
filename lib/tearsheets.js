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
  Timestamp,
  writeBatch
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
    const existingTearsheets = await getTearsheets()
    
    // Determine the order for the new item
    let newOrder
    if (tearsheetData.order && tearsheetData.order >= 1) {
      newOrder = tearsheetData.order
    } else {
      // Auto-assign: max order + 1
      const validOrders = existingTearsheets
        .map(t => t.order || 0)
        .filter(order => order >= 1)
      const maxOrder = validOrders.length > 0 
        ? Math.max(...validOrders)
        : 0
      newOrder = maxOrder + 1
    }
    
    // If inserting at a specific order, shift existing items with order >= newOrder up by 1
    const batch = writeBatch(db)
    let needsShift = false
    
    existingTearsheets.forEach((tearsheet) => {
      if (tearsheet.order >= 1 && tearsheet.order >= newOrder) {
        const otherDocRef = doc(db, 'tearsheets', tearsheet.id)
        batch.update(otherDocRef, {
          order: tearsheet.order + 1,
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
      ...tearsheetData,
      order: newOrder,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
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
    
    // Get the current document to check old order
    const currentDoc = await getDoc(docRef)
    if (!currentDoc.exists()) {
      return { success: false, error: 'Tearsheet not found' }
    }
    
    const oldData = currentDoc.data()
    const oldOrder = oldData.order || 999
    let newOrder = tearsheetData.order !== undefined ? tearsheetData.order : oldOrder
    
    // Ensure order is at least 1
    if (newOrder < 1) {
      newOrder = 1
    }
    
    // If order is changing, we need to adjust other items
    if (oldOrder !== newOrder) {
      const allTearsheets = await getTearsheets()
      const batch = writeBatch(db)
      
      // Update the current item with corrected order
    const dataToSave = {
      ...tearsheetData,
        order: newOrder,
      updatedAt: Timestamp.now()
    }
      batch.update(docRef, dataToSave)
      
      // Adjust other items' orders
      if (newOrder < oldOrder) {
        // Moving to a lower order (e.g., from 3 to 1)
        // Shift items with order >= newOrder and < oldOrder up by 1
        allTearsheets.forEach((tearsheet) => {
          if (tearsheet.id !== tearsheetId && tearsheet.order >= 1 && tearsheet.order >= newOrder && tearsheet.order < oldOrder) {
            const otherDocRef = doc(db, 'tearsheets', tearsheet.id)
            batch.update(otherDocRef, {
              order: tearsheet.order + 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      } else {
        // Moving to a higher order (e.g., from 1 to 3)
        // Shift items with order > oldOrder and <= newOrder down by 1
        allTearsheets.forEach((tearsheet) => {
          if (tearsheet.id !== tearsheetId && tearsheet.order >= 1 && tearsheet.order > oldOrder && tearsheet.order <= newOrder) {
            const otherDocRef = doc(db, 'tearsheets', tearsheet.id)
            batch.update(otherDocRef, {
              order: tearsheet.order - 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      }
      
      await batch.commit()
    } else {
      // No order change, just update normally (but ensure order is at least 1)
      const dataToSave = {
        ...tearsheetData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
    await updateDoc(docRef, dataToSave)
    }
    
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
    
    // Get the item being deleted to know its order and image URL
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return { success: false, error: 'Tearsheet not found' }
    }
    
    const deletedData = docSnap.data()
    const deletedOrder = deletedData.order || 999
    const imageUrl = deletedData.src
    
    // Delete the item
    await deleteDoc(docRef)
    
    // Adjust orders of remaining items: shift down items with order > deletedOrder
    const allTearsheets = await getTearsheets()
    const batch = writeBatch(db)
    
    allTearsheets.forEach((tearsheet) => {
      if (tearsheet.order >= 1 && tearsheet.order > deletedOrder) {
        const otherDocRef = doc(db, 'tearsheets', tearsheet.id)
        batch.update(otherDocRef, {
          order: tearsheet.order - 1,
          updatedAt: Timestamp.now()
        })
      }
    })
    
    if (allTearsheets.some(t => t.order > deletedOrder)) {
      await batch.commit()
    }
    
    // Return image URL so it can be deleted from storage
    return { success: true, imageUrl }
  } catch (error) {
    console.error('Error deleting tearsheet:', error)
    return { success: false, error: error.message }
  }
}

