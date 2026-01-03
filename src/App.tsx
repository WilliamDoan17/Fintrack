import React, { useState, useEffect } from 'react'
import './App.css'
import { supabase } from '../supabaseConfig.ts'
import { AuthProvider } from './useAuth.tsx'
import Signup from './Signup.tsx'
import { Routes, Route, useNavigate } from "react-router-dom";
import Signin from './Signin.tsx'

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

const TestElement = () => {
  return (
    <>
      <Signup></Signup>
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
          {/* <RouteProvider>
          </RouteProvider> */}
          <TestElement>
          </TestElement>
        </div>
      </AuthProvider>
      
    </>
  )
}

export default App
