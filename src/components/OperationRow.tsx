import type { Operation } from '@/lib/api'
import { CATEGORY_META, formatAmount } from '@/lib/categories'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OperationRow({ op, showName }: { op: Operation; showName?: string }) {
  const isTopup = op.type === 'topup'
  const meta = op.category ? CATEGORY_META[op.category] : null
  const Icon = meta?.icon ?? (isTopup ? ArrowDownLeft : ArrowUpRight)
  const date = new Date(op.created_at)
  const dateLabel = date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: isTopup ? 'color-mix(in oklab, var(--color-success) 20%, transparent)' : `color-mix(in oklab, ${meta?.color ?? 'var(--color-cat-other)'} 20%, transparent)` }}
      >
        <Icon
          className="size-4"
          style={{ color: isTopup ? 'var(--color-success)' : meta?.color ?? 'var(--color-cat-other)' }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {op.comment || (isTopup ? 'Пополнение' : meta?.label ?? 'Расход')}
        </div>
        <div className="text-xs text-muted-foreground">
          {dateLabel}
          {showName ? ` · ${showName}` : ''}
        </div>
      </div>
      <div className={cn('shrink-0 text-sm font-semibold', isTopup ? 'text-success' : 'text-foreground')}>
        {isTopup ? '+' : '-'}
        {formatAmount(op.amount)}
      </div>
    </div>
  )
}
