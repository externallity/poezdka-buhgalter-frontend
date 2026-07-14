import * as React from 'react'
import { api, type Stats } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatTile } from '@/components/StatTile'
import { CategoryPieChart } from '@/components/charts/CategoryPieChart'
import { DailyExpenseChart } from '@/components/charts/DailyExpenseChart'
import { formatAmount } from '@/lib/categories'

function StatsBlock({ title, stats }: { title: string; stats: Stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          <StatTile label="Всего расходов" value={formatAmount(stats.total_expenses)} suffix="сум" />
          <StatTile label="Операций" value={String(stats.operations_count)} />
          <StatTile label="Средний расход" value={formatAmount(stats.average_expense)} suffix="сум" />
          <StatTile
            label="Самый дорогой день"
            value={
              stats.most_expensive_day
                ? new Date(stats.most_expensive_day.day).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                  })
                : '—'
            }
            suffix={stats.most_expensive_day ? `${formatAmount(stats.most_expensive_day.total)} сум` : undefined}
          />
        </div>
        <CategoryPieChart data={stats.by_category} />
        <DailyExpenseChart data={stats.by_day} />
      </CardContent>
    </Card>
  )
}

export function StatsPage() {
  const { user } = useAuth()
  const [myStats, setMyStats] = React.useState<Stats | null>(null)
  const [companyStats, setCompanyStats] = React.useState<Stats | null>(null)

  React.useEffect(() => {
    api.myStats().then(setMyStats)
    if (user?.is_admin) {
      api.companyStats().then(setCompanyStats)
    }
  }, [user])

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="pt-2 text-lg font-semibold text-foreground">Статистика</h1>
      {myStats ? <StatsBlock title="Твоя статистика" stats={myStats} /> : (
        <p className="text-sm text-muted-foreground">Загрузка…</p>
      )}
      {user?.is_admin && companyStats && <StatsBlock title="По всей поездке" stats={companyStats} />}
    </div>
  )
}
