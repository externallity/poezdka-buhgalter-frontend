import type { ExpenseCategory } from '@/lib/api'
import { UtensilsCrossed, Car, Home, ShoppingBag, PartyPopper, ClipboardList, MoreHorizontal } from 'lucide-react'

export const CATEGORY_ORDER: ExpenseCategory[] = [
  'food',
  'taxi',
  'housing',
  'shopping',
  'entertainment',
  'registration',
  'other',
]

export const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string; icon: typeof UtensilsCrossed }
> = {
  // Литеральные hex, не CSS var() — SVG-атрибут fill у Recharts не всегда
  // резолвит custom properties (в отличие от inline style).
  food: { label: 'Еда', color: '#3987e5', icon: UtensilsCrossed },
  taxi: { label: 'Такси', color: '#199e70', icon: Car },
  housing: { label: 'Жильё', color: '#c98500', icon: Home },
  shopping: { label: 'Покупки', color: '#008300', icon: ShoppingBag },
  entertainment: { label: 'Развлечения', color: '#e66767', icon: PartyPopper },
  registration: { label: 'Регистрация', color: '#d55181', icon: ClipboardList },
  other: { label: 'Другое', color: '#d95926', icon: MoreHorizontal },
}

export function formatAmount(n: number): string {
  const sign = n < 0 ? '-' : ''
  const abs = Math.round(Math.abs(n))
  return sign + abs.toLocaleString('ru-RU').replace(/ /g, ' ')
}
