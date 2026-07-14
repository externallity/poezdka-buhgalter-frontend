import { getInitDataRaw } from '@/lib/telegram'

const API_BASE = import.meta.env.VITE_API_BASE_URL as string

export type OperationType = 'topup' | 'expense'
export type ExpenseCategory =
  | 'food'
  | 'taxi'
  | 'housing'
  | 'shopping'
  | 'entertainment'
  | 'registration'
  | 'other'

export interface User {
  id: number
  name: string
  display_order: number
  is_admin: boolean
  telegram_id: number | null
}

export interface Balance {
  user_id: number
  name: string
  topup_sum: number
  expense_sum: number
  balance_sum: number
  balance_rub: number
}

export interface Operation {
  id: number
  user_id: number
  type: OperationType
  amount: number
  category: ExpenseCategory | null
  comment: string | null
  source: 'bot' | 'miniapp' | 'legacy_import'
  created_at: string
}

export interface OperationCreateResult {
  operation: Operation
  balance: Balance
}

export interface SplitShare {
  user_id: number
  name: string
  amount: number
}

export interface SplitCreateResult {
  operations: Operation[]
  breakdown: SplitShare[]
}

export interface CategoryStat {
  category: ExpenseCategory
  total: number
  count: number
}

export interface DailyStat {
  day: string
  total: number
}

export interface Stats {
  total_expenses: number
  average_expense: number
  operations_count: number
  most_expensive_day: DailyStat | null
  by_category: CategoryStat[]
  by_day: DailyStat[]
}

export interface AuthResult {
  onboarded: boolean
  user: User | null
}

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': getInitDataRaw(),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new ApiError(res.status, body)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  authTelegram: () => request<AuthResult>('/api/v1/auth/telegram', { method: 'POST' }),
  me: () => request<User>('/api/v1/users/me'),
  availableRoles: () => request<User[]>('/api/v1/roles/available'),
  claimRole: (name: string) =>
    request<User>('/api/v1/roles/claim', { method: 'POST', body: JSON.stringify({ name }) }),
  myBalance: () => request<Balance>('/api/v1/balance/me'),
  allBalances: () => request<Balance[]>('/api/v1/balance'),
  createOperation: (body: {
    type: OperationType
    amount: number
    currency?: 'SUM' | 'RUB'
    category?: ExpenseCategory
    comment?: string
    user_id?: number
  }) => request<OperationCreateResult>('/api/v1/operations', { method: 'POST', body: JSON.stringify(body) }),
  createSplit: (body: {
    amount: number
    participant_user_ids: number[]
    category?: ExpenseCategory
    comment?: string
  }) => request<SplitCreateResult>('/api/v1/operations/split', { method: 'POST', body: JSON.stringify(body) }),
  listOperations: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString()
    return request<Operation[]>(`/api/v1/operations${qs ? `?${qs}` : ''}`)
  },
  myStats: () => request<Stats>('/api/v1/stats/me'),
  companyStats: () => request<Stats>('/api/v1/stats/company'),
}

export { ApiError }
