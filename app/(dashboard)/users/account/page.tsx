import type { Metadata } from "next"
import { UserProfile } from "@/components/pages/users/user-profile"

export const metadata: Metadata = {
  title: "الحساب الشخصي | لوحة التحكم",
  description: "إدارة الحساب الشخصي وعرض المعلومات",
}

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الحساب الشخصي</h1>
        <p className="text-muted-foreground">إدارة حسابك الشخصي وتحديث معلوماتك</p>
      </div>

      <UserProfile />
    </div>
  )
}

