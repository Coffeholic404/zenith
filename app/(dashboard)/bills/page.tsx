'use client';
import BillCard from "@/components/pages/bills/billsCard";
import add from '@/public/employees/plus.svg';
import { useSession } from 'next-auth/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useGetBillsQuery } from '@/services/bills';
import { Loader2 } from 'lucide-react';

export type BillItem = {
  id: string;
  supplier: string;
  date: string;
  orderNo: string;
  status: boolean;
};

export default function Page() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isLoading, isError } = useGetBillsQuery({
    pageNumber: 1,
    pageSize: 100
  });

  const bills: BillItem[] = (data?.result?.data ?? []).map((bill) => ({
    id: bill.id,
    supplier: bill.supplier,
    date: bill.date,
    orderNo: bill.orderNo,
    status: bill.status
  }));

  return (
    <div className=" space-y-6">
      <div className="flex  flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className=" font-vazirmatn">
          <p className=" font-bold text-cardTxt ">إدارة الفواتير</p>
          <p className=" font-light text-subtext text-lg">تنظيم وإدارة الفواتير</p>
        </div>
        {/* to do the search input here */}
        <div>
          {!isAdmin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-sidebaractive px-3 rounded-2xl shrink-0"
                  onClick={() => router.push('/bills/add-bill')}
                >
                  <Image src={add} alt="add icon" className=" size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className=" bg-sidebaractive text-white">
                <p className=" font-normal text-sm text-white font-vazirmatn">إضافة فاتورة</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-sidebaractive" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-20">
          <p className="font-vazirmatn text-red-500 text-sm">حدث خطأ أثناء تحميل الفواتير</p>
        </div>
      ) : bills.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="font-vazirmatn text-subtext text-sm">لا توجد فواتير حالياً</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          {bills.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
}
