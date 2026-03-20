import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import { useContext } from 'react'
import PageLoader from '../components/loaders/PageLoader'
import Dashboard from './pages/Dashboard'
import AuthProvider from '../providers/AuthProvider'
import AuthContext from '../contexts/AuthContext'
import BudgetDetail from './pages/BudgetDetail'
import ProtectedLayout from '../components/protected-layout/ProtectedLayout'
import NotificationProvider from '../providers/NotificationProvider'
import Landing from './pages/Landing'

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
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route
              element={<PublicRoutes />}
            >
              <Route
                path = "/"
                element = {<Landing />}
              />
              <Route
                path="/auth"
                element={<Auth />}
              >
              </Route>
            </Route>
            <Route
              element={<ProtectedLayout />}
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              >
              </Route>
              <Route
                path="/budget/:id"
                element={<BudgetDetail />}
              >
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider >
  )
}

export default App
