// Utility functions for projects data
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

// Project categories
export const PROJECT_CATEGORIES = {
  ALL: 'all',
  PHOTO_STORIES: 'photo-stories',
  FILMS_DOCUMENTARIES: 'films-documentaries',
  PRINT_DIGITAL_FEATURES: 'print-digital-features',
  GLOBAL_ASSIGNMENTS: 'global-assignments'
}

// Project types
export const PROJECT_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video'
}

// Fetch all projects (optionally filtered by category)
export async function getProjects(category = null) {
  try {
    const projectsRef = collection(db, 'projects')
    let q
    
    // Build query - avoid orderBy with where to prevent index issues
    // We'll sort client-side instead
    if (category && category !== PROJECT_CATEGORIES.ALL) {
      // Filter by category only (no orderBy to avoid index requirement)
      q = query(projectsRef, where('category', '==', category))
    } else if (category === PROJECT_CATEGORIES.ALL) {
      // Filter for "all" category only
      q = query(projectsRef, where('category', '==', PROJECT_CATEGORIES.ALL))
    } else {
      // No category filter, get all projects
      q = query(projectsRef)
    }
    
    const querySnapshot = await getDocs(q)
    const projects = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      projects.push({
        id: doc.id,
        ...data,
        // Ensure order field exists (default to 0 if missing)
        order: data.order !== undefined ? data.order : 999,
        // Convert Firestore Timestamp to ISO string if needed
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      })
    })
    
    // Sort by order field first, then by createdAt (client-side sort)
    projects.sort((a, b) => {
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
    
    console.log(`Fetched ${projects.length} projects for category: ${category || 'all'}`)
    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    // If there's an index error, show helpful message
    if (error.code === 'failed-precondition') {
      console.error('⚠️ Firestore index required. Check the error message for the index creation link.')
    }
    
    return []
  }
}

// Fetch a single project by ID
export async function getProjectById(projectId) {
  try {
    const docRef = doc(db, 'projects', projectId)
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
    console.error('Error fetching project:', error)
    return null
  }
}

// Create a new project
export async function createProject(projectData) {
  try {
    const projectsRef = collection(db, 'projects')
    const dataToSave = {
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    // If order is not provided, set it to a high number (will be added at end)
    if (!dataToSave.order) {
      const existingProjects = await getProjects(projectData.category)
      dataToSave.order = existingProjects.length
    }
    
    const docRef = await addDoc(projectsRef, dataToSave)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating project:', error)
    return { success: false, error: error.message }
  }
}

// Update an existing project
export async function updateProject(projectId, projectData) {
  try {
    const docRef = doc(db, 'projects', projectId)
    const dataToSave = {
      ...projectData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(docRef, dataToSave)
    return { success: true }
  } catch (error) {
    console.error('Error updating project:', error)
    return { success: false, error: error.message }
  }
}

// Delete a project
export async function deleteProject(projectId) {
  try {
    const docRef = doc(db, 'projects', projectId)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { success: false, error: error.message }
  }
}

