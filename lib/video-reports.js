// Utility functions for video reports data
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

// Fetch all video reports
export async function getVideoReports() {
  try {
    const videoReportsRef = collection(db, 'videoReports')
    const q = query(videoReportsRef, orderBy('order', 'asc'))
    
    const querySnapshot = await getDocs(q)
    const videoReports = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      videoReports.push({
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
    videoReports.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999
      const orderB = b.order !== undefined ? b.order : 999
      return orderA - orderB
    })
    
    console.log(`Fetched ${videoReports.length} video reports`)
    return videoReports
  } catch (error) {
    console.error('Error fetching video reports:', error)
    return []
  }
}

// Fetch a single video report by ID
export async function getVideoReportById(reportId) {
  try {
    const docRef = doc(db, 'videoReports', reportId)
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
    console.error('Error fetching video report:', error)
    return null
  }
}

// Create a new video report
export async function createVideoReport(reportData) {
  try {
    const videoReportsRef = collection(db, 'videoReports')
    const existingReports = await getVideoReports()
    
    // Determine the order for the new item
    let newOrder
    if (reportData.order && reportData.order >= 1) {
      newOrder = reportData.order
    } else {
      // Auto-assign: max order + 1
      const validOrders = existingReports
        .map(r => r.order || 0)
        .filter(order => order >= 1)
      const maxOrder = validOrders.length > 0 
        ? Math.max(...validOrders)
        : 0
      newOrder = maxOrder + 1
    }
    
    // If inserting at a specific order, shift existing items with order >= newOrder up by 1
    const batch = writeBatch(db)
    let needsShift = false
    
    existingReports.forEach((report) => {
      if (report.order >= 1 && report.order >= newOrder) {
        const otherDocRef = doc(db, 'videoReports', report.id)
        batch.update(otherDocRef, {
          order: report.order + 1,
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
      ...reportData,
      order: newOrder,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(videoReportsRef, dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating video report:', error)
    return { success: false, error: error.message }
  }
}

// Update an existing video report
export async function updateVideoReport(reportId, reportData) {
  try {
    const docRef = doc(db, 'videoReports', reportId)
    
    // Get the current document to check old order
    const currentDoc = await getDoc(docRef)
    if (!currentDoc.exists()) {
      return { success: false, error: 'Video report not found' }
    }
    
    const oldData = currentDoc.data()
    const oldOrder = oldData.order || 999
    let newOrder = reportData.order !== undefined ? reportData.order : oldOrder
    
    // Ensure order is at least 1
    if (newOrder < 1) {
      newOrder = 1
    }
    
    // If order is changing, we need to adjust other items
    if (oldOrder !== newOrder) {
      const allReports = await getVideoReports()
      const batch = writeBatch(db)
      
      // Update the current item with corrected order
      const dataToSave = {
        ...reportData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
      batch.update(docRef, dataToSave)
      
      // Adjust other items' orders
      if (newOrder < oldOrder) {
        // Moving to a lower order (e.g., from 3 to 1)
        // Shift items with order >= newOrder and < oldOrder up by 1
        allReports.forEach((report) => {
          if (report.id !== reportId && report.order >= 1 && report.order >= newOrder && report.order < oldOrder) {
            const otherDocRef = doc(db, 'videoReports', report.id)
            batch.update(otherDocRef, {
              order: report.order + 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      } else {
        // Moving to a higher order (e.g., from 1 to 3)
        // Shift items with order > oldOrder and <= newOrder down by 1
        allReports.forEach((report) => {
          if (report.id !== reportId && report.order >= 1 && report.order > oldOrder && report.order <= newOrder) {
            const otherDocRef = doc(db, 'videoReports', report.id)
            batch.update(otherDocRef, {
              order: report.order - 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      }
      
      await batch.commit()
    } else {
      // No order change, just update normally (but ensure order is at least 1)
      const dataToSave = {
        ...reportData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
      await updateDoc(docRef, dataToSave)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating video report:', error)
    return { success: false, error: error.message }
  }
}

// Delete a video report
export async function deleteVideoReport(reportId) {
  try {
    const docRef = doc(db, 'videoReports', reportId)
    
    // Get the item being deleted to know its order
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return { success: false, error: 'Video report not found' }
    }
    
    const deletedOrder = docSnap.data().order || 999
    
    // Delete the item
    await deleteDoc(docRef)
    
    // Adjust orders of remaining items: shift down items with order > deletedOrder
    const allReports = await getVideoReports()
    const batch = writeBatch(db)
    
    allReports.forEach((report) => {
      if (report.order >= 1 && report.order > deletedOrder) {
        const otherDocRef = doc(db, 'videoReports', report.id)
        batch.update(otherDocRef, {
          order: report.order - 1,
          updatedAt: Timestamp.now()
        })
      }
    })
    
    if (allReports.some(r => r.order > deletedOrder)) {
      await batch.commit()
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting video report:', error)
    return { success: false, error: error.message }
  }
}

