import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdminBalancesPage } from '@/pages/admin/AdminBalancesPage'
import { AdminHistoryPage } from '@/pages/admin/AdminHistoryPage'
import { AdminSplitPage } from '@/pages/admin/AdminSplitPage'
import { AdminTopupPage } from '@/pages/admin/AdminTopupPage'

export function AdminPage() {
  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="pt-2 text-lg font-semibold text-foreground">Админ</h1>
      <Tabs defaultValue="balances">
        <TabsList>
          <TabsTrigger value="balances">Баланс</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="split">Между всеми</TabsTrigger>
          <TabsTrigger value="topup">Пополнение</TabsTrigger>
        </TabsList>
        <TabsContent value="balances">
          <AdminBalancesPage />
        </TabsContent>
        <TabsContent value="history">
          <AdminHistoryPage />
        </TabsContent>
        <TabsContent value="split">
          <AdminSplitPage />
        </TabsContent>
        <TabsContent value="topup">
          <AdminTopupPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
