import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

/**
 * AdminHomeGuard - Redirects admins to dashboard, allows others to home
 * Used to prevent admins from accessing the home page
 */
const AdminHomeGuard = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext)
  
  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }
  
  // If user is logged in and is an admin, redirect to dashboard
  if (isLoggedIn && user?.roles && user.roles.includes('ADMIN')) {
    return <Navigate to="/admin-dashboard" replace />
  }
  
  // Otherwise, show the home page
  return children
}

export default AdminHomeGuard
