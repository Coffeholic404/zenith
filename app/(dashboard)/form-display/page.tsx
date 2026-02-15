import type { Metadata } from 'next';
import { FormDisplayDemo } from '@/components/form-display-demo';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Form Display | Dashboard',
  description: 'Display forms in different ways - normal or steps'
};

export default function FormDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">عرض النماذج</h1>
        <p className="text-muted-foreground">يمكنك عرض النموذج بطريقتين مختلفتين - عادي أو خطوات</p>
      </div>

      <Card className="border-border/20">
        <CardContent className="p-6">
          <FormDisplayDemo />
        </CardContent>
      </Card>
    </div>
  );
}
