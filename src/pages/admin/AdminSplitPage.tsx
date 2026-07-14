import * as React from 'react'
import { api, type Balance, type ExpenseCategory, type SplitCreateResult } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { CATEGORY_ORDER, CATEGORY_META, formatAmount } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function AdminSplitPage() {
  const [participants, setParticipants] = React.useState<Balance[] | null>(null)
  const [selected, setSelected] = React.useState<Set<number>>(new Set())
  const [amount, setAmount] = React.useState('')
  const [category, setCategory] = React.useState<ExpenseCategory>('food')
  const [comment, setComment] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<SplitCreateResult | null>(null)

  React.useEffect(() => {
    api.allBalances().then((all) => {
      setParticipants(all)
      setSelected(new Set(all.map((b) => b.user_id)))
    })
  }, [])

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number(amount.replace(/[^\d.]/g, ''))
    if (!parsed || parsed <= 0) {
      setError('Введи сумму больше нуля')
      return
    }
    if (selected.size === 0) {
      setError('Выбери хотя бы одного участника')
      return
    }
    setSubmitting(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.createSplit({
        amount: parsed,
        participant_user_ids: [...selected],
        category,
        comment: comment || undefined,
      })
      setResult(res)
      setAmount('')
      setComment('')
    } catch {
      setError('Не получилось сохранить. Попробуй ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Участники</p>
        <div className="flex flex-wrap gap-2">
          {participants?.map((p) => {
            const active = selected.has(p.user_id)
            return (
              <button
                type="button"
                key={p.user_id}
                onClick={() => toggle(p.user_id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
                )}
              >
                {p.name}
              </button>
            )
          })}
        </div>
      </div>

      <input
        inputMode="decimal"
        placeholder="Сумма, сум"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-12 rounded-md border border-border bg-background px-3 text-lg font-semibold text-foreground outline-none focus:border-primary"
      />

      <div className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat]
          const active = category === cat
          return (
            <button
              type="button"
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium',
                active ? 'border-transparent text-white' : 'border-border text-muted-foreground'
              )}
              style={active ? { background: meta.color } : undefined}
            >
              <meta.icon className="size-3.5" />
              {meta.label}
            </button>
          )
        })}
      </div>

      <input
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting} size="lg">
        {submitting ? 'Сохраняю…' : `Разделить между ${selected.size}`}
      </Button>

      {result && (
        <div className="rounded-lg border border-border bg-card p-3 text-sm">
          <p className="mb-2 font-medium text-foreground">Разбивка:</p>
          {result.breakdown.map((s) => (
            <div key={s.user_id} className="flex justify-between text-muted-foreground">
              <span>{s.name}</span>
              <span className="tabular-nums text-foreground">{formatAmount(s.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </form>
  )
}
