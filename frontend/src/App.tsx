import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={<Auth />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
