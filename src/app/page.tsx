import { DashboardLayout } from "@/components/dashboard-layout"
import { FreshChatTab } from "./freshchat/page"

export default function Home() {
  return (
    <DashboardLayout>
      <FreshChatTab />
    </DashboardLayout>
  )
}

