import { CardContent, CardHeader } from '@/components/ui/card';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Activites from './activites';
import Accident from './accident';

export default function Updates() {
  return (
    <section className=" grid lg:grid-cols-[2fr_1fr] md:grid-cols-[1fr] gap-4">
      <Card className=" shadow-none border rounded-2xl space-y-4">
        <CardHeader className="flex rounded-t-[15px] flex-row items-center justify-between space-y-0 pb-2 pt-2 bg-[linear-gradient(90.05deg,rgba(136,112,231,0.26)_0.05%,rgba(204,128,227,0.26)_125.99%)]">
          <CardTitle className=" font-vazirmatn font-bold text-xl">النشاطات الحديثة</CardTitle>
        </CardHeader>
        <CardContent>
          <Activites />
        </CardContent>
      </Card>
      <Card className=" shadow-none border rounded-2xl space-y-4">
        <CardHeader className="flex rounded-t-[15px] flex-row items-center justify-between space-y-0 pb-2 pt-2 bg-[linear-gradient(90.05deg,rgba(136,112,231,0.26)_0.05%,rgba(245,126,49,0.26)_125.99%)]">
          <CardTitle className=" font-vazirmatn font-bold text-xl">الحوادث الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <Accident />
        </CardContent>
      </Card>
    </section>
  );
}
