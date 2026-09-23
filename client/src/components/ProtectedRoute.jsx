import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p className="grid min-h-screen place-items-center text-slate-600">Loading FindBack…</p>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
