'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil } from 'lucide-react';
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
    date: string;
    distribution: string;
};

const statusLabels: Record<string, string> = {
    new: 'جديد',
    New: 'جديد',
    used: 'مستعمل',
    broken: 'تالف'
};

const statusColors: Record<string, string> = {
    new: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    New: 'bg-emerald-100 text-emerald-700 border-emerald-200',
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
        },
        cell: ({ row }) => {
            const itemName = row.getValue('itemName') as string;
            const router = useRouter();
            return (
                <span
                    className="text-sidebaractive hover:underline cursor-pointer font-vazirmatn"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push('/adds');
                    }}
                >
                    {itemName}
                </span>
            );
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
        accessorKey: 'date',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التاريخ</p>;
        },
        cell: ({ row }) => {
            const date = row.getValue('date') as string;
            if (!date) return '—';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
    },
    {
        accessorKey: 'distribution',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التوزيع</p>;
        },
        cell: ({ row }) => {
            const distribution = (row.getValue('distribution') as string)?.toLowerCase();
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
                            router.push(`/Inventory/${item.uniqueID}`);
                        }}
                    >
                        <Eye className="size-4" />
                    </Button>
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
    { label: 'التاريخ', dataIndex: 'date' },
    { label: 'التوزيع', dataIndex: 'distribution' },
    { label: 'الإجراءات', dataIndex: 'actions' }
];
