'use client';
import BillCard from "@/components/pages/bills/billsCard";
import add from '@/public/employees/plus.svg';
import { useSession } from 'next-auth/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
export type BillItem = {
  id: string;
  supplierName: string;
  billDate: string;
  orderNumber: string;
};

const bills: BillItem[] = [
  {
    id: "1",
    supplierName: "Supplier 1",
    billDate: "2022-01-01",
    orderNumber: "123456",
  },
  {
    id: "2",
    supplierName: "Supplier 2",
    billDate: "2022-01-02",
    orderNumber: "123457",
  },
  {
    id: "3",
    supplierName: "Supplier 3",
    billDate: "2022-01-03",
    orderNumber: "123458",
  },
];

export default function Page() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        {bills.map((bill) => (
          <BillCard key={bill.id} bill={bill} />
        ))}
      </div>
    </div>
  );
}