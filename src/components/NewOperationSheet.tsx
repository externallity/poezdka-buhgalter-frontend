import * as React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { api, type ExpenseCategory, type OperationCreateResult } from '@/lib/api'
import { CATEGORY_ORDER, CATEGORY_META } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

interface Props {
  type: 'topup' | 'expense'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (result: OperationCreateResult) => void
}

export function NewOperationSheet({ type, open, onOpenChange, onSuccess }: Props) {
  const [amount, setAmount] = React.useState('')
  const [currency, setCurrency] = React.useState<'SUM' | 'RUB'>('SUM')
  const [category, setCategory] = React.useState<ExpenseCategory>('food')
  const [comment, setComment] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setAmount('')
      setComment('')
      setCategory('food')
      setCurrency('SUM')
      setError(null)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = Number(amount.replace(/[^\d.]/g, ''))
    if (!parsed || parsed <= 0) {
      setError('Введи сумму больше нуля')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = await api.createOperation({
        type,
        amount: parsed,
        currency,
        category: type === 'expense' ? category : undefined,
        comment: type === 'expense' ? comment || undefined : undefined,
      })
      haptic('medium')
      onSuccess(result)
      onOpenChange(false)
    } catch {
      setError('Не получилось сохранить. Попробуй ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{type === 'topup' ? 'Пополнение' : 'Расход'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              autoFocus
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

          {type === 'expense' && (
            <>
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
                        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
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
            </>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? 'Сохраняю…' : 'Сохранить'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
