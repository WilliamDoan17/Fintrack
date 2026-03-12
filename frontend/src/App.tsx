import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import { useContext } from 'react'
import PageLoader from '../components/PageLoader'
import Dashboard from './pages/Dashboard'
import AuthProvider from '../providers/AuthProvider'
import AuthContext from '../contexts/AuthContext'

const ProtectedRoutes = () => {
  const { user, loading, error } = useContext(AuthContext);
  if (loading) {
    return <PageLoader />
  }
  if (user) {
    return <Outlet />
  }
  if (error || !user) {
    return <Navigate to="/auth" replace />
  }
}

const PublicRoutes = () => {
  const { user, loading, error } = useContext(AuthContext);
  if (loading) {
    return <PageLoader />
  }
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  if (error || !user) {
    return <Outlet />
  }
}

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              element={<PublicRoutes />}
            >
              <Route
                path="/auth"
                element={<Auth />}
              >
              </Route>
            </Route>
            <Route
              element={<ProtectedRoutes />}
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              >
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
