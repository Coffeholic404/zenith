import type { Metadata } from 'next';
import { UsersTable } from '@/components/pages/users/users-table';

export const metadata: Metadata = {
  title: 'المستخدمين | لوحة التحكم',
  description: 'إدارة المستخدمين وإضافة مستخدمين جدد'
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">المستخدمين</h1>
        <p className="text-muted-foreground">إدارة المستخدمين وإضافة مستخدمين جدد</p>
      </div>

      <UsersTable />
    </div>
  );
}
