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
  Timestamp
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
    const dataToSave = {
      ...reportData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    // If order is not provided, set it to a high number (will be added at end)
    if (!dataToSave.order) {
      const existingReports = await getVideoReports()
      dataToSave.order = existingReports.length
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
    const dataToSave = {
      ...reportData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(docRef, dataToSave)
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
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting video report:', error)
    return { success: false, error: error.message }
  }
}

