// Authentication utilities using Firebase Auth
import { auth } from './firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'

// Sign in with email and password
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    console.error('Sign in error:', error)
    let errorMessage = 'Failed to sign in'
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email'
        break
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password'
        break
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address'
        break
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled'
        break
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later'
        break
      default:
        errorMessage = error.message || 'Failed to sign in'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: error.message }
  }
}

// Send password reset email
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true, message: 'Password reset email sent!' }
  } catch (error) {
    console.error('Password reset error:', error)
    let errorMessage = 'Failed to send password reset email'
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email'
        break
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address'
        break
      default:
        errorMessage = error.message || 'Failed to send password reset email'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback)
}

// Create admin user (for initial setup)
export async function createAdminUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    console.error('Create user error:', error)
    let errorMessage = 'Failed to create user'
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email is already registered'
        break
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address'
        break
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters'
        break
      default:
        errorMessage = error.message || 'Failed to create user'
    }
    
    return { success: false, error: errorMessage }
  }
}

