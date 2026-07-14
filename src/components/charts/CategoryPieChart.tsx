import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { CategoryStat } from '@/lib/api'
import { CATEGORY_META } from '@/lib/categories'
import { formatAmount } from '@/lib/categories'

export function CategoryPieChart({ data }: { data: CategoryStat[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Пока нет расходов</p>
  }

  const total = data.reduce((s, d) => s + d.total, 0)
  const sorted = [...data].sort((a, b) => b.total - a.total)

  return (
    <div className="flex items-center gap-4">
      <div className="h-[140px] w-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sorted}
              dataKey="total"
              nameKey="category"
              innerRadius={40}
              outerRadius={65}
              stroke="var(--color-card)"
              strokeWidth={2}
            >
              {sorted.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_META[entry.category].color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value, _name, entry) => [
                `${formatAmount(Number(value))} сум`,
                CATEGORY_META[(entry.payload as CategoryStat).category].label,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {sorted.map((d) => {
          const meta = CATEGORY_META[d.category]
          const pct = total > 0 ? Math.round((d.total / total) * 100) : 0
          return (
            <div key={d.category} className="flex items-center gap-2 text-xs">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: meta.color }} />
              <span className="flex-1 truncate text-muted-foreground">{meta.label}</span>
              <span className="font-medium text-foreground">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
