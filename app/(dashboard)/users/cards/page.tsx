import type { Metadata } from 'next';
import { UserCards } from '@/components/pages/users/user-cards';

export const metadata: Metadata = {
  title: 'بطاقات المستخدمين | لوحة التحكم',
  description: 'عرض المستخدمين في بطاقات جذابة'
};

export default function UserCardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">بطاقات المستخدمين</h1>
        <p className="text-muted-foreground">عرض المستخدمين في بطاقات جذابة</p>
      </div>

      <UserCards />
    </div>
  );
}
