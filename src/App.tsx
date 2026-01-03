import React, { useState, useEffect } from 'react'
import './App.css'
import { supabase } from '../supabaseConfig.ts'
import { AuthProvider } from './useAuth.tsx'
import Signup from './Signup.tsx'
import { Routes, Route, useNavigate } from "react-router-dom";

const RouteProvider = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/signup");
  }, [])

  return (
    <>
      <Routes>
        <Route
          path = "/signup"
          element = {<Signup></Signup>}
        ></Route>
      </Routes>
    </>
  )
}

function App() {
  return (
    <>
      <AuthProvider>
        <div
          className = "app-container"
        >
          <RouteProvider>
          </RouteProvider>
        </div>
      </AuthProvider>
      
    </>
  )
}

export default App
