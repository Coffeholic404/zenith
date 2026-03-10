'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export type InventoryHistoryRow = {
    uniqueID: string;
    itemName: string;
    code: string | null;
    generatedCode: string | null;
    packagerName: string;
    packetCoachName: string;
    oldDate: string;
    newDate: string;
    status: string | null;
    distribution: string | null;
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

const distributionLabels: Record<string, string> = {
    true: 'يسمح بالتوزيع',
    false: 'لا يسمح بالتوزيع'
};

const distributionColors: Record<string, string> = {
    true: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    false: 'bg-red-100 text-red-700 border-red-200'
};

// ── Columns ──────────────────────────────────────────────────────────────────

export const InventoryHistoryColumns: ColumnDef<InventoryHistoryRow>[] = [
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
        accessorKey: 'code',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الرمز</p>;
        },
        cell: ({ row }) => {
            return row.getValue('code') ?? '—';
        }
    },
    {
        accessorKey: 'generatedCode',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الرمز المولد</p>;
        },
        cell: ({ row }) => {
            return row.getValue('generatedCode') ?? '—';
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
        accessorKey: 'oldDate',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التاريخ القديم</p>;
        },
        cell: ({ row }) => {
            const date = row.getValue('oldDate') as string;
            if (!date) return '—';
            return new Date(date).toLocaleDateString('ar-IQ');
        }
    },
    {
        accessorKey: 'newDate',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التاريخ الجديد</p>;
        },
        cell: ({ row }) => {
            const date = row.getValue('newDate') as string;
            if (!date) return '—';
            return new Date(date).toLocaleDateString('ar-IQ');
        }
    },
    {
        accessorKey: 'status',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الحالة</p>;
        },
        cell: ({ row }) => {
            const status = (row.getValue('status') as string)?.toLowerCase();
            if (!status) return '—';
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
        accessorKey: 'distribution',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التوزيع</p>;
        },
        cell: ({ row }) => {
            const distribution = (row.getValue('distribution') as string)?.toLowerCase();
            if (!distribution) return '—';
            return (
                <Badge
                    className={cn(
                        'text-[11px] font-vazirmatn rounded-md border px-2 py-0.5',
                        distributionColors[distribution] ?? 'bg-gray-100 text-gray-700 border-gray-200'
                    )}
                >
                    {distributionLabels[distribution] ?? distribution}
                </Badge>
            );
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
                            router.push(`/Inventory/edit-InventoryHistory/${item.uniqueID}`);
                        }}
                    >
                        <Pencil className="size-4" />
                    </Button>
                </div>
            );
        }
    }
];

export const InventoryHistoryColumnsNames = [
    { label: 'ت', dataIndex: 'sequence' },
    { label: 'المنتج', dataIndex: 'itemName' },
    { label: 'الرمز', dataIndex: 'code' },
    { label: 'الرمز المولد', dataIndex: 'generatedCode' },
    { label: 'الرزام', dataIndex: 'packagerName' },
    { label: 'مشرف الرزم', dataIndex: 'packetCoachName' },
    { label: 'التاريخ القديم', dataIndex: 'oldDate' },
    { label: 'التاريخ الجديد', dataIndex: 'newDate' },
    { label: 'الحالة', dataIndex: 'status' },
    { label: 'التوزيع', dataIndex: 'distribution' },
    { label: 'الإجراءات', dataIndex: 'actions' }
];
