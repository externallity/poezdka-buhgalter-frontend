import { cn } from '@/lib/utils'

export function StatTile({
  label,
  value,
  suffix,
  className,
}: {
  label: string
  value: string
  suffix?: string
  className?: string
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-3', className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums text-foreground">
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  )
}
