import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from '../supabaseConfig.ts'
import { AuthProvider } from './useAuth.tsx'
import Signup from './Signup.tsx'

function App() {

  return (
    <>
      <AuthProvider>
        <div
          className = "app-container"
        >
          <Signup>
          </Signup>
        </div>
      </AuthProvider>
      
    </>
  )
}

export default App
