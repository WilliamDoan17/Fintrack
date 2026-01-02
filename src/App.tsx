import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from '../supabaseConfig.ts'
import Signup from './Signup.tsx'

function App() {

  return (
    <>
      <div
        className = "app-container"
      >
        <Signup>
        </Signup>
      </div>
    </>
  )
}

export default App
