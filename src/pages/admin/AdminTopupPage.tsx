import * as React from 'react'
import { api, type Balance } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AdminTopupPage() {
  const [participants, setParticipants] = React.useState<Balance[] | null>(null)
  const [userId, setUserId] = React.useState<number | null>(null)
  const [amount, setAmount] = React.useState('')
  const [currency, setCurrency] = React.useState<'SUM' | 'RUB'>('SUM')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    api.allBalances().then((all) => {
      setParticipants(all)
      if (all.length > 0) setUserId(all[0].user_id)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number(amount.replace(/[^\d.]/g, ''))
    if (!parsed || parsed <= 0) {
      setError('Введи сумму больше нуля')
      return
    }
    if (userId === null) return
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      await api.createOperation({ type: 'topup', amount: parsed, currency, user_id: userId })
      setSuccess(true)
      setAmount('')
    } catch {
      setError('Не получилось сохранить. Попробуй ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Кому</p>
        <div className="flex flex-wrap gap-2">
          {participants?.map((p) => (
            <button
              type="button"
              key={p.user_id}
              onClick={() => setUserId(p.user_id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium',
                userId === p.user_id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground'
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-12 flex-1 rounded-md border border-border bg-background px-3 text-lg font-semibold text-foreground outline-none focus:border-primary"
        />
        <div className="flex rounded-md border border-border p-1">
          {(['SUM', 'RUB'] as const).map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCurrency(c)}
              className={cn(
                'rounded px-3 text-sm font-medium',
                currency === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {c === 'SUM' ? 'сум' : '₽'}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-success">Пополнение записано</p>}

      <Button type="submit" disabled={submitting || userId === null} size="lg">
        {submitting ? 'Сохраняю…' : 'Пополнить'}
      </Button>
    </form>
  )
}
