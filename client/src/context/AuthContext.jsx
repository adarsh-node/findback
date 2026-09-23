import { useEffect, useState } from 'react'
import { apiRequest } from '../api.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    apiRequest('/auth/me')
      .then(({ user: currentUser }) => {
        if (isMounted) setUser(currentUser)
      })
      .catch(() => {
        if (isMounted) setUser(null)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function register(values) {
    const { user: registeredUser } = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    setUser(registeredUser)
  }

  async function login(values) {
    const { user: authenticatedUser } = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    setUser(authenticatedUser)
  }

  async function logout() {
    await apiRequest('/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
