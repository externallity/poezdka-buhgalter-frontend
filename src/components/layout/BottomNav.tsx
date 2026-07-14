import { NavLink } from 'react-router-dom'
import { Home, Receipt, BarChart3, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const items = [
  { to: '/', label: 'Главная', icon: Home, end: true },
  { to: '/expenses', label: 'Расходы', icon: Receipt, end: false },
  { to: '/stats', label: 'Статистика', icon: BarChart3, end: false },
]

export function BottomNav() {
  const { user } = useAuth()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[560px] items-stretch border-t border-border bg-card/95 backdrop-blur">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors',
              isActive && 'text-primary'
            )
          }
        >
          <Icon className="size-5" />
          {label}
        </NavLink>
      ))}
      {user?.is_admin && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors',
              isActive && 'text-primary'
            )
          }
        >
          <ShieldCheck className="size-5" />
          Админ
        </NavLink>
      )}
    </nav>
  )
}
