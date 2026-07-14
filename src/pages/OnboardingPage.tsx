import * as React from 'react'
import { api, type User } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { haptic } from '@/lib/telegram'

export function OnboardingPage() {
  const { claimRole } = useAuth()
  const [available, setAvailable] = React.useState<User[] | null>(null)
  const [submitting, setSubmitting] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    api.availableRoles().then(setAvailable).catch(() => setAvailable([]))
  }, [])

  async function handlePick(name: string) {
    setSubmitting(name)
    setError(null)
    try {
      haptic('medium')
      await claimRole(name)
    } catch {
      setError('Не получилось выбрать имя. Попробуй ещё раз.')
      setSubmitting(null)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Кто ты?</CardTitle>
          <p className="text-sm text-muted-foreground">Выбери своё имя — это навсегда закрепится за тобой</p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {available === null && (
            <p className="col-span-2 text-sm text-muted-foreground">Загрузка…</p>
          )}
          {available?.map((u) => (
            <Button
              key={u.id}
              variant="outline"
              disabled={submitting !== null}
              onClick={() => handlePick(u.name)}
            >
              {submitting === u.name ? '…' : u.name}
            </Button>
          ))}
          {available?.length === 0 && (
            <p className="col-span-2 text-sm text-muted-foreground">
              Свободных имён нет — все уже зарегистрированы.
            </p>
          )}
        </CardContent>
      </Card>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
