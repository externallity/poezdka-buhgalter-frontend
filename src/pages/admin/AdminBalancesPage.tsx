import * as React from 'react'
import { api, type Balance } from '@/lib/api'
import { formatAmount } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function AdminBalancesPage() {
  const [balances, setBalances] = React.useState<Balance[] | null>(null)

  React.useEffect(() => {
    api.allBalances().then(setBalances)
  }, [])

  return (
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
  )
}
