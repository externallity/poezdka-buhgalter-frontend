import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { BottomNav } from '@/components/layout/BottomNav'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { HomePage } from '@/pages/HomePage'
import { ExpensesPage } from '@/pages/ExpensesPage'
import { StatsPage } from '@/pages/StatsPage'
import { AdminPage } from '@/pages/admin/AdminPage'

function AppShell() {
  const { loading, user, error } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Загрузка…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6 text-center text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (!user) {
    return <OnboardingPage />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/stats" element={<StatsPage />} />
        {user.is_admin && <Route path="/admin/*" element={<AdminPage />} />}
      </Routes>
      <BottomNav />
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </HashRouter>
  )
}

export default App
