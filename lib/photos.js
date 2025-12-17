// Utility functions for photos data (singles, portraits, stories)
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
  Timestamp,
  writeBatch
} from 'firebase/firestore'

// Photo types
export const PHOTO_TYPES = {
  SINGLE: 'single',
  PORTRAIT: 'portrait',
  STORY: 'story'
}

// Fetch all photos (optionally filtered by type)
export async function getPhotos(type = null) {
  try {
    const photosRef = collection(db, 'photos')
    let q
    
    if (type) {
      q = query(photosRef, where('type', '==', type))
    } else {
      q = query(photosRef)
    }
    
    const querySnapshot = await getDocs(q)
    const photos = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      photos.push({
        id: doc.id,
        ...data,
        order: data.order !== undefined ? data.order : 999,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      })
    })
    
    // Sort by order field
    photos.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999
      const orderB = b.order !== undefined ? b.order : 999
      return orderA - orderB
    })
    
    return photos
  } catch (error) {
    console.error('Error fetching photos:', error)
    return []
  }
}

// Create a new photo
export async function createPhoto(photoData) {
  try {
    const photosRef = collection(db, 'photos')
    const existingPhotos = await getPhotos(photoData.type)
    
    // Determine the order for the new item
    let newOrder
    if (photoData.order !== undefined && photoData.order >= 0) {
      newOrder = photoData.order
    } else {
      const validOrders = existingPhotos
        .map(p => p.order !== undefined ? p.order : 999)
        .filter(order => order >= 0)
      const maxOrder = validOrders.length > 0 
        ? Math.max(...validOrders)
        : -1
      newOrder = maxOrder + 1
    }
    
    // If inserting at a specific order, shift existing items with order >= newOrder up by 1
    const batch = writeBatch(db)
    let needsShift = false
    
    existingPhotos.forEach((photo) => {
      const photoOrder = photo.order !== undefined ? photo.order : 999
      if (photoOrder >= 0 && photoOrder >= newOrder) {
        const otherPhotoRef = doc(db, 'photos', photo.id)
        batch.update(otherPhotoRef, {
          order: photoOrder + 1,
          updatedAt: Timestamp.now()
        })
        needsShift = true
      }
    })
    
    if (needsShift) {
      await batch.commit()
    }
    
    const dataToSave = {
      ...photoData,
      order: newOrder,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(photosRef, dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating photo:', error)
    return { success: false, error: error.message }
  }
}

// Update an existing photo
export async function updatePhoto(photoId, photoData) {
  try {
    const docRef = doc(db, 'photos', photoId)
    
    // Get the current document to check old order
    const currentDoc = await getDoc(docRef)
    if (!currentDoc.exists()) {
      return { success: false, error: 'Photo not found' }
    }
    
    const oldData = currentDoc.data()
    const oldOrder = oldData.order !== undefined ? oldData.order : 999
    let newOrder = photoData.order !== undefined ? photoData.order : oldOrder
    
    // Ensure order is at least 0
    if (newOrder < 0) {
      newOrder = 0
    }
    
    // If order is changing, we need to adjust other items
    if (oldOrder !== newOrder) {
      const allPhotos = await getPhotos(photoData.type)
      const batch = writeBatch(db)
      
      const dataToSave = {
        ...photoData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
      
      // Adjust other items' orders
      if (newOrder < oldOrder) {
        // Moving to a lower order
        allPhotos.forEach((photo) => {
          const photoOrder = photo.order !== undefined ? photo.order : 999
          if (photo.id !== photoId && photoOrder >= 0 && photoOrder >= newOrder && photoOrder < oldOrder) {
            const otherPhotoRef = doc(db, 'photos', photo.id)
            batch.update(otherPhotoRef, {
              order: photoOrder + 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      } else {
        // Moving to a higher order
        allPhotos.forEach((photo) => {
          const photoOrder = photo.order !== undefined ? photo.order : 999
          if (photo.id !== photoId && photoOrder >= 0 && photoOrder > oldOrder && photoOrder <= newOrder) {
            const otherPhotoRef = doc(db, 'photos', photo.id)
            batch.update(otherPhotoRef, {
              order: photoOrder - 1,
              updatedAt: Timestamp.now()
            })
          }
        })
      }
      
      await batch.commit()
      await updateDoc(docRef, dataToSave)
    } else {
      // No order change, just update normally
      const dataToSave = {
        ...photoData,
        order: newOrder,
        updatedAt: Timestamp.now()
      }
      await updateDoc(docRef, dataToSave)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating photo:', error)
    return { success: false, error: error.message }
  }
}

// Delete a photo
export async function deletePhoto(photoId) {
  try {
    const docRef = doc(db, 'photos', photoId)
    
    // Get the item being deleted to know its order and type
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return { success: false, error: 'Photo not found' }
    }
    
    const deletedData = docSnap.data()
    const deletedOrder = deletedData.order !== undefined ? deletedData.order : 999
    const photoType = deletedData.type
    
    // Delete the item
    await deleteDoc(docRef)
    
    // Adjust orders of remaining items: shift down items with order > deletedOrder
    const allPhotos = await getPhotos(photoType)
    const batch = writeBatch(db)
    
    allPhotos.forEach((photo) => {
      const photoOrder = photo.order !== undefined ? photo.order : 999
      if (photoOrder >= 0 && photoOrder > deletedOrder) {
        const otherPhotoRef = doc(db, 'photos', photo.id)
        batch.update(otherPhotoRef, {
          order: photoOrder - 1,
          updatedAt: Timestamp.now()
        })
      }
    })
    
    if (allPhotos.some(p => p.order > deletedOrder)) {
      await batch.commit()
    }
    
    // Return image URLs for deletion from storage
    const imageUrls = []
    if (deletedData.src) imageUrls.push(deletedData.src)
    if (deletedData.image) imageUrls.push(deletedData.image)
    if (deletedData.images && Array.isArray(deletedData.images)) {
      imageUrls.push(...deletedData.images)
    }
    
    return { success: true, imageUrls }
  } catch (error) {
    console.error('Error deleting photo:', error)
    return { success: false, error: error.message }
  }
}
