import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import {useSelector} from 'react-redux'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = ({children}) => {
  // will integrate it later

  const { isAuthenticated ,loading, user, authChecking } = useSelector((state)=>state.auth)
  
if (loading) {
  return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

  //  if (authChecking) {
  //   return <h1>Loading...</h1>;
  // }


  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }

  return (
    <>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
    </>
  )
}

export default ProtectedRoute

