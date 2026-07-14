import * as React from 'react'
import { api, type User } from '@/lib/api'

interface AuthState {
  loading: boolean
  user: User | null
  error: string | null
  claimRole: (name: string) => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = React.createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState<User | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const refetch = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.authTelegram()
      setUser(result.user)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refetch()
  }, [refetch])

  const claimRole = React.useCallback(async (name: string) => {
    const claimed = await api.claimRole(name)
    setUser(claimed)
  }, [])

  return (
    <AuthContext.Provider value={{ loading, user, error, claimRole, refetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
