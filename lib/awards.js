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
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore'

// Fetch all awards
export async function getAwards() {
  try {
    const awardsRef = collection(db, 'awards')
    const q = query(awardsRef)
    
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
    
    // Sort by order field first (ascending)
    awards.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999
      const orderB = b.order !== undefined ? b.order : 999
      return orderA - orderB
    })
    
    console.log(`Fetched ${awards.length} awards`)
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
    const existingAwards = await getAwards()
    
    // Determine the order for the new item
    let newOrder
    if (awardData.order && awardData.order >= 1) {
      newOrder = awardData.order
    } else {
      // Auto-assign: max order + 1
      const validOrders = existingAwards
        .map(a => a.order || 0)
        .filter(order => order >= 1)
      const maxOrder = validOrders.length > 0 
        ? Math.max(...validOrders)
        : 0
      newOrder = maxOrder + 1
    }
    
    // If inserting at a specific order, shift existing items with order >= newOrder up by 1
    const batch = writeBatch(db)
    let needsShift = false
    
    existingAwards.forEach((award) => {
      if (award.order >= 1 && award.order >= newOrder) {
        const otherAwardRef = doc(db, 'awards', award.id)
        batch.update(otherAwardRef, {
          order: award.order + 1,
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
      ...awardData,
      order: newOrder,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
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
    
    // Get the current document to check old order
    const currentDoc = await getDoc(docRef)
    if (!currentDoc.exists()) {
      return { success: false, error: 'Award not found' }
    }
    
    const oldData = currentDoc.data()
    const oldOrder = oldData.order || 999
    let newOrder = awardData.order !== undefined ? awardData.order : oldOrder
    
    // Ensure order is at least 1
    if (newOrder < 1) {
      newOrder = 1
    }
    
    // If order is changing, we need to adjust other items
    if (oldOrder !== newOrder) {
      const allAwards = await getAwards()
      const batch = writeBatch(db)
      
      // Update the current item with corrected order
      const dataToSave = {
        ...awardData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }

      
      // Adjust other items' orders
      if (newOrder < oldOrder) {
        // Moving to a lower order (e.g., from 3 to 1)
        // Shift items with order >= newOrder and < oldOrder up by 1
        allAwards.forEach((award) => {
          if (award.id !== awardId && award.order >= 1 && award.order >= newOrder && award.order < oldOrder) {
            const otherAwardRef = doc(db, 'awards', award.id)
            batch.update(otherAwardRef, {
              order: award.order + 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      } else {
        // Moving to a higher order (e.g., from 1 to 3)
        // Shift items with order > oldOrder and <= newOrder down by 1
        allAwards.forEach((award) => {
          if (award.id !== awardId && award.order >= 1 && award.order > oldOrder && award.order <= newOrder) {
            const otherAwardRef = doc(db, 'awards', award.id)
            batch.update(otherAwardRef, {
              order: award.order - 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      }
      
      await batch.commit()
      
      // Now update the current item
      await updateDoc(docRef, dataToSave)
    } else {
      // No order change, just update normally (but ensure order is at least 1)
      const dataToSave = {
        ...awardData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
      await updateDoc(docRef, dataToSave)
    }
    
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
    
    // Get the item being deleted to know its order
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return { success: false, error: 'Award not found' }
    }
    
    const deletedOrder = docSnap.data().order || 999
    
    // Delete the item
    await deleteDoc(docRef)
    
    // Adjust orders of remaining items: shift down items with order > deletedOrder
    const allAwards = await getAwards()
    const batch = writeBatch(db)
    
    allAwards.forEach((award) => {
      if (award.order >= 1 && award.order > deletedOrder) {
        const otherAwardRef = doc(db, 'awards', award.id)
        batch.update(otherAwardRef, {
          order: award.order - 1,
          updatedAt: Timestamp.now()
        })
      }
    })
    
    if (allAwards.some(a => a.order > deletedOrder)) {
      await batch.commit()
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting award:', error)
    return { success: false, error: error.message }
  }
}

