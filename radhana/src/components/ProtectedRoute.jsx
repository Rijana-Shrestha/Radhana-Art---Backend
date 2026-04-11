import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// ProtectedRoute for auth pages - redirects logged-in users
// Allows non-logged-in users to access login/register pages
const ProtectedAuthRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext)
  
  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }
  
  if (isLoggedIn) {
    // Check if user is admin
    const isAdmin = user?.roles && user.roles.includes('ADMIN')
    
    // Redirect admins to dashboard, regular users to home
    return <Navigate to={isAdmin ? "/admin-dashboard" : "/"} replace />
  }
  
  // Allow non-logged-in users to access login/register pages
  return children
  
}

export default ProtectedAuthRoute
