'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export type InventoryRow = {
    uniqueID: string;
    itemName: string;
    generatedCode: string;
    code: string;
    status: string;
    packagerName: string;
    packetCoachName: string;
};

const statusLabels: Record<string, string> = {
    new: 'جديد',
    used: 'مستعمل',
    broken: 'تالف'
};

const statusColors: Record<string, string> = {
    new: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    used: 'bg-amber-100 text-amber-700 border-amber-200',
    broken: 'bg-red-100 text-red-700 border-red-200'
};

// ── Columns ──────────────────────────────────────────────────────────────────

export const InventoryColumns: ColumnDef<InventoryRow>[] = [
    {
        accessorKey: 'sequence',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>;
        },
        cell: ({ row }) => {
            return row.index + 1;
        }
    },
    {
        accessorKey: 'itemName',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">المنتج</p>;
        }
    },
    {
        accessorKey: 'generatedCode',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الرمز المولد</p>;
        }
    },
    {
        accessorKey: 'code',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الرمز</p>;
        }
    },
    {
        accessorKey: 'status',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">حالة المنتج</p>;
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge
                    className={cn(
                        'text-[11px] font-vazirmatn rounded-md border px-2 py-0.5',
                        statusColors[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
                    )}
                >
                    {statusLabels[status] ?? status}
                </Badge>
            );
        }
    },
    {
        accessorKey: 'packagerName',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الرزام</p>;
        }
    },
    {
        accessorKey: 'packetCoachName',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">مشرف الرزم</p>;
        }
    },
    {
        id: 'actions',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الإجراءات</p>;
        },
        cell: ({ row }) => {
            const item = row.original;
            const router = useRouter();

            return (
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-subtext hover:text-sidebaractive hover:bg-blue-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/Inventory/edit-inventory/${item.uniqueID}`);
                        }}
                    >
                        <Pencil className="size-4" />
                    </Button>
                </div>
            );
        }
    }
];

export const InventoryColumnsNames = [
    { label: 'ت', dataIndex: 'sequence' },
    { label: 'المنتج', dataIndex: 'itemName' },
    { label: 'الرمز المولد', dataIndex: 'generatedCode' },
    { label: 'الرمز', dataIndex: 'code' },
    { label: 'حالة المنتج', dataIndex: 'status' },
    { label: 'الرزام', dataIndex: 'packagerName' },
    { label: 'مشرف الرزم', dataIndex: 'packetCoachName' },
    { label: 'الإجراءات', dataIndex: 'actions' }
];
