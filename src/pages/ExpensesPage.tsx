import * as React from 'react'
import { api, type Operation, type ExpenseCategory } from '@/lib/api'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OperationRow } from '@/components/OperationRow'
import { CATEGORY_ORDER, CATEGORY_META } from '@/lib/categories'

const ALL = 'all' as const

export function ExpensesPage() {
  const [filter, setFilter] = React.useState<ExpenseCategory | typeof ALL>(ALL)
  const [ops, setOps] = React.useState<Operation[] | null>(null)

  React.useEffect(() => {
    setOps(null)
    api
      .listOperations({
        type: 'expense',
        category: filter === ALL ? undefined : filter,
        limit: 100,
      })
      .then(setOps)
  }, [filter])

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="pt-2 text-lg font-semibold text-foreground">Расходы</h1>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value={ALL}>Все</TabsTrigger>
          {CATEGORY_ORDER.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {CATEGORY_META[cat].label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="divide-y divide-border rounded-lg border border-border bg-card px-4">
        {ops === null && <p className="py-4 text-sm text-muted-foreground">Загрузка…</p>}
        {ops?.length === 0 && <p className="py-4 text-sm text-muted-foreground">Ничего не найдено</p>}
        {ops?.map((op) => (
          <OperationRow key={op.id} op={op} />
        ))}
      </div>
    </div>
  )
}
