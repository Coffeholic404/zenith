import type { Metadata } from 'next';
import { FormDemo } from '@/components/form-demo';

export const metadata: Metadata = {
  title: 'النماذج | لوحة التحكم',
  description: 'صفحة النماذج مع مختلف أنواع الإدخال'
};

export default function FormPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">النماذج</h1>
        <p className="text-muted-foreground">نموذج يحتوي على مختلف أنواع الإدخال</p>
      </div>

      <FormDemo />
    </div>
  );
}
