import * as React from 'react'
import { api, type Balance } from '@/lib/api'
import { formatAmount } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function AdminBalancesPage() {
  const [balances, setBalances] = React.useState<Balance[] | null>(null)

  React.useEffect(() => {
    api.allBalances().then(setBalances)
  }, [])

  const others = React.useMemo(() => (balances ?? []).filter((b) => b.name !== 'Амир'), [balances])
  const totalSum = React.useMemo(() => others.reduce((sum, b) => sum + b.balance_sum, 0), [others])
  const totalRub = React.useMemo(() => others.reduce((sum, b) => sum + b.balance_rub, 0), [others])

  return (
    <div className="flex flex-col gap-4">
      {balances !== null && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">На карте не своих денег</span>
          <span
            className={cn(
              'text-lg font-semibold tabular-nums',
              totalSum > 0 ? 'text-success' : totalSum < 0 ? 'text-destructive' : 'text-foreground'
            )}
          >
            {formatAmount(totalSum)}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              сум · {formatAmount(totalRub)} руб
            </span>
          </span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="p-3 font-medium">Имя</th>
            <th className="p-3 font-medium text-right">Пополнения</th>
            <th className="p-3 font-medium text-right">Расход</th>
            <th className="p-3 font-medium text-right">Баланс</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {balances === null && (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={4}>
                Загрузка…
              </td>
            </tr>
          )}
          {balances?.map((b) => (
            <tr key={b.user_id}>
              <td className="p-3 font-medium text-foreground">{b.name}</td>
              <td className="p-3 text-right tabular-nums text-foreground">{formatAmount(b.topup_sum)}</td>
              <td className="p-3 text-right tabular-nums text-foreground">{formatAmount(b.expense_sum)}</td>
              <td
                className={cn(
                  'p-3 text-right tabular-nums font-semibold',
                  b.balance_sum > 0 ? 'text-success' : b.balance_sum < 0 ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {formatAmount(b.balance_sum)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
