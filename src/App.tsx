import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import { supabase } from '../supabase/supabaseConfig.ts'
import { AuthContext, AuthProvider } from '../supabase/auth/useAuth.tsx'
import Signup from './Auth/Signup.tsx'
import { Routes, Route, useNavigate } from "react-router-dom";
import Signin from './Auth/Signin.tsx'
import Dashboard from './protected/Dashboard.tsx'
import { DataProvider } from '../supabase/database/useDatabase.tsx'

const AppRoutes = () => {
  const navigate = useNavigate();

  const { user, loading } = useContext(AuthContext)

  useEffect(() => {
    if (loading) return;
    if (!user) {
      console.log('No User found');
      navigate('/signin')
    }
  }, [user, loading])

  return (
    <>
      <Routes>
        <Route
          path = "/signup"
          element = {<Signup></Signup>}
        ></Route>
        <Route
          path = "/signin"
          element = {<Signin></Signin>}
        >
        </Route>
        <Route
          path = "/dashboard"
          element = {<Dashboard></Dashboard>}
        ></Route>
      </Routes>
    </>
  )
}

const TestElement = () => {
  return (
    <>
      <Signin></Signin>
    </>
  )
}

function App() {
  return (
    <>
      <AuthProvider>
        <DataProvider>
          <div
            className = "app-container"
          >
            <AppRoutes>
            </AppRoutes>
          </div>
        </DataProvider>
      </AuthProvider>
      
    </>
  )
}

export default App
