import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// ProtectedRoute for auth pages - redirects logged-in users to home
const ProtectedAuthRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext)
  
  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default ProtectedAuthRoute
