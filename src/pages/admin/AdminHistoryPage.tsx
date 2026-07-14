import * as React from 'react'
import { api, type Operation } from '@/lib/api'
import { OperationRow } from '@/components/OperationRow'
import { api as apiClient } from '@/lib/api'

export function AdminHistoryPage() {
  const [ops, setOps] = React.useState<Operation[] | null>(null)
  const [users, setUsers] = React.useState<Record<number, string>>({})
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    apiClient.allBalances().then((balances) => {
      setUsers(Object.fromEntries(balances.map((b) => [b.user_id, b.name])))
    })
  }, [])

  React.useEffect(() => {
    const handle = setTimeout(() => {
      api.listOperations({ q: q || undefined, limit: 100 }).then(setOps)
    }, 250)
    return () => clearTimeout(handle)
  }, [q])

  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Поиск по комментарию…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
      />
      <div className="divide-y divide-border rounded-lg border border-border bg-card px-4">
        {ops === null && <p className="py-4 text-sm text-muted-foreground">Загрузка…</p>}
        {ops?.length === 0 && <p className="py-4 text-sm text-muted-foreground">Ничего не найдено</p>}
        {ops?.map((op) => (
          <OperationRow key={op.id} op={op} showName={users[op.user_id]} />
        ))}
      </div>
    </div>
  )
}
