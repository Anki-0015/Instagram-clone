import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/Layout'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<PrivateRoute><FeedPage /></PrivateRoute>} />
          <Route path="/u/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
