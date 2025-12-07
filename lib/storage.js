// Firebase Storage utility functions
import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'homepage', 'projects', 'portraits')
 * @param {string} filename - Optional custom filename. If not provided, uses original filename with timestamp
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadImage(file, folder = 'images', filename = null) {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'Image size must be less than 10MB' }
    }

    // Generate filename if not provided
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const finalFilename = filename || `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Create storage reference
    const storageRef = ref(storage, `${folder}/${finalFilename}`)
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { success: true, url: downloadURL }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: error.message || 'Failed to upload image' }
  }
}

/**
 * Delete an image from Firebase Storage
 * @param {string} url - The full URL of the image to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteImage(url) {
  try {
    // Check if it's a Firebase Storage URL
    if (!url || !url.includes('firebasestorage.googleapis.com')) {
      // If it's a public folder path, just return success (can't delete from public folder)
      return { success: true }
    }

    // Extract the path from the URL
    // Firebase Storage URLs look like: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile?alt=media
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/)
    
    if (!pathMatch) {
      return { success: false, error: 'Invalid Firebase Storage URL' }
    }

    // Decode the path
    const filePath = decodeURIComponent(pathMatch[1])
    
    // Create reference and delete
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error.message || 'Failed to delete image' }
  }
}

/**
 * Check if a URL is from Firebase Storage or public folder
 * @param {string} url - The image URL
 * @returns {boolean} - true if Firebase Storage URL, false if public folder path
 */
export function isFirebaseStorageUrl(url) {
  if (!url) return false
  return url.includes('firebasestorage.googleapis.com') || url.startsWith('https://')
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL (various formats supported)
 * @returns {string|null} - YouTube video ID or null if not found
 */
export function extractYouTubeVideoId(url) {
  if (!url) return null
  
  // Various YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality: 'default', 'medium', 'high', 'standard', 'maxres'
 * @returns {string} - YouTube thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoId, quality = 'maxresdefault') {
  if (!videoId) return ''
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

