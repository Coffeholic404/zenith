'use client';
import BillCard from "@/components/pages/bills/billsCard";
import add from '@/public/employees/plus.svg';
import searchIcon from '@/public/table/Magnifer.svg';
import { useSession } from 'next-auth/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useGetBillsQuery } from '@/services/bills';
import { Loader2 } from 'lucide-react';
import React from 'react';

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

  // ── Search state with debounce ──────────────────────────────────────────
  const [searchTerm, setSearchTerm] = React.useState<string>(searchParams.get('q') ?? '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>(searchTerm);
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) params.set('q', debouncedSearchTerm);
    else params.delete('q');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // ── Fetch bills with search query ───────────────────────────────────────
  const { data, isLoading, isFetching, isError } = useGetBillsQuery({
    pageNumber: 1,
    pageSize: 100,
    searchQuery: debouncedSearchTerm
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

        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          {/* ── Search Input ─────────────────────────────────────────── */}
          <div
            className="relative flex-1 min-w-[200px] sm:min-w-[280px] lg:min-w-0 lg:flex-initial"
            aria-label="بحث عن الفواتير"
            aria-busy={isFetching}
          >
            <Image
              src={searchIcon}
              alt="magnifier icon"
              className="absolute inset-y-2 start-2 flex items-center pointer-events-none"
            />
            <Input
              id="search"
              role="searchbox"
              aria-label="حقل البحث"
              placeholder="بحث ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setSearchTerm('');
                  setDebouncedSearchTerm('');
                } else if (e.key === 'Enter') {
                  if (debounceRef.current) window.clearTimeout(debounceRef.current);
                  setDebouncedSearchTerm(searchTerm);
                }
              }}
              className="bg-white rounded-xl w-full p-4 ps-10 lg:min-w-[21rem] font-vazirmatn placeholder:text-placeholderClr placeholder:text-base placeholder:font-normal focus-visible:ring-1 focus-visible:ring-searchBg focus-visible:ring-offset-2"
            />
            {isFetching && (
              <div
                aria-hidden
                className="absolute inset-y-0 end-10 my-auto size-4 rounded-full border-2 border-searchBg border-t-transparent animate-spin"
              />
            )}
            {!!searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setDebouncedSearchTerm('');
                }}
                aria-label="مسح البحث"
                className="absolute inset-y-0 end-2 my-auto size-6 flex items-center justify-center rounded-full bg-searchBg hover:bg-[#DAF1FF] text-[#666]"
              >
                ×<span className="sr-only">مسح</span>
              </button>
            )}
          </div>

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
          <p className="font-vazirmatn text-subtext text-sm">
            {debouncedSearchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد فواتير حالياً'}
          </p>
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
