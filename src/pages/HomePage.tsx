import * as React from 'react'
import { api, type Balance, type Operation, type Stats } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OperationRow } from '@/components/OperationRow'
import { NewOperationSheet } from '@/components/NewOperationSheet'
import { DailyExpenseChart } from '@/components/charts/DailyExpenseChart'
import { formatAmount } from '@/lib/categories'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HomePage() {
  const { user } = useAuth()
  const [balance, setBalance] = React.useState<Balance | null>(null)
  const [stats, setStats] = React.useState<Stats | null>(null)
  const [recent, setRecent] = React.useState<Operation[]>([])
  const [sheetType, setSheetType] = React.useState<'topup' | 'expense' | null>(null)

  const load = React.useCallback(async () => {
    const [b, s, ops] = await Promise.all([api.myBalance(), api.myStats(), api.listOperations({ limit: 5 })])
    setBalance(b)
    setStats(s)
    setRecent(ops)
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  const statusColor =
    balance && balance.balance_sum > 0
      ? 'text-success'
      : balance && balance.balance_sum < 0
        ? 'text-destructive'
        : 'text-muted-foreground'

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="pt-2">
        <h1 className="text-lg font-semibold text-foreground">Привет, {user?.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Твой баланс</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn('text-3xl font-semibold tabular-nums', statusColor)}>
            {balance ? formatAmount(balance.balance_sum) : '—'} <span className="text-lg">сум</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {balance ? formatAmount(balance.balance_rub) : '—'} ₽
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={() => setSheetType('topup')} className="gap-1.5">
              <ArrowDownLeft className="size-4" /> Пополнение
            </Button>
            <Button variant="outline" onClick={() => setSheetType('expense')} className="gap-1.5">
              <ArrowUpRight className="size-4" /> Расход
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Расходы по дням</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyExpenseChart data={stats?.by_day ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Последние операции</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {recent.length === 0 && <p className="text-sm text-muted-foreground">Пока пусто</p>}
          {recent.map((op) => (
            <OperationRow key={op.id} op={op} />
          ))}
        </CardContent>
      </Card>

      <NewOperationSheet
        type="topup"
        open={sheetType === 'topup'}
        onOpenChange={(o) => setSheetType(o ? 'topup' : null)}
        onSuccess={load}
      />
      <NewOperationSheet
        type="expense"
        open={sheetType === 'expense'}
        onOpenChange={(o) => setSheetType(o ? 'expense' : null)}
        onSuccess={load}
      />
    </div>
  )
}
