import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import { useContext } from 'react'
import PageLoader from '../components/loaders/PageLoader'
import Dashboard from './pages/Dashboard'
import AuthProvider from '../providers/AuthProvider'
import AuthContext from '../contexts/AuthContext'
import BudgetDetail from './pages/BudgetDetail'
import IncomeBudgetDetail from './pages/IncomeBudgetDetail'
import ProtectedLayout from '../components/protected-layout/ProtectedLayout'
import NotificationProvider from '../providers/NotificationProvider'
import NavigationProvider from '../providers/NavigationProvider'
import Landing from './pages/Landing'

const PublicRoutes = () => {
  const { user, loading, error } = useContext(AuthContext);
  if (loading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  if (error || !user) return <Outlet />
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NavigationProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicRoutes />}>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
              </Route>
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/budget/:id" element={<BudgetDetail />} />
                <Route path="/income" element={<IncomeBudgetDetail />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NavigationProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
