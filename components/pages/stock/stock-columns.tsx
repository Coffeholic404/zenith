'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDeleteStockMutation } from '@/services/stock';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type inventory = {
    uniqueID: string;
    name: string;
    code: string;
    cost: number;
    bundle: string;
    bundleSupervisor: string;
    date: string;
    status: 'new' | 'used' | 'broken';
    distribution: string;
    note: string;
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

// ── Delete Confirmation Dialog ───────────────────────────────────────────────

const DeleteConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isDeleting
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    isDeleting: boolean;
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="rtl font-vazirmatn" dir="rtl">
                <AlertDialogHeader className="text-right">
                    <AlertDialogTitle className="text-right font-vazirmatn text-cardTxt">
                        تأكيد الحذف
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-right font-vazirmatn text-subtext">
                        هل أنت متأكد من حذف المنتج &quot;{itemName}&quot;؟
                        <br />
                        <span className="text-sm text-red-500"> سيتم حذف القيد من المخزن المرتبطة بهذا المنتج.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel
                        onClick={onClose}
                        className="font-vazirmatn"
                        disabled={isDeleting}
                    >
                        إلغاء
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 font-vazirmatn"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="size-4 animate-spin ml-2" />
                                جاري الحذف...
                            </>
                        ) : (
                            'حذف'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// ── Columns ──────────────────────────────────────────────────────────────────

export const inventoryColumns: ColumnDef<inventory>[] = [
    {
        accessorKey: 'sequence',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>;
        },
        cell: ({ row, table }) => {
            const current = (table.options.meta as any)?.Curent || 1;
            return (current - 1) * 10 + row.index + 1;
        }
    },
    {
        accessorKey: 'name',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">المنتج</p>;
        }
    },
    {
        accessorKey: 'code',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الكود</p>;
        }
    },
    {
        accessorKey: 'cost',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التكلفة</p>;
        },
        cell: ({ row }) => {
            const cost = row.getValue('cost') as number;
            return <span>{cost.toLocaleString('en-US')}</span>;
        }
    },
    {
        accessorKey: 'bundle',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الرزام</p>;
        }
    },
    {
        accessorKey: 'bundleSupervisor',
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
        accessorKey: 'status',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">حالة المنتج</p>;
        },
        cell: ({ row }) => {
            const status = (row.getValue('status') as string).toLowerCase();
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
            const distribution = String(row.getValue('distribution') ?? '').toLowerCase();
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
        accessorKey: 'note',
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الملاحظة</p>;
        },
        cell: ({ row }) => {
            const text = row.original.note;
            if (!text) return <p className="font-vazirmatn font-normal text-sm">—</p>;
            if (text.length <= 25) return <p className="font-vazirmatn font-normal text-sm">{text}</p>;
            return (
                <Popover>
                    <PopoverTrigger className="font-vazirmatn font-normal text-sm text-right cursor-pointer block underline decoration-dotted underline-offset-2">
                        {text.slice(0, 25)}...
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-right p-4 font-vazirmatn" side="top" dir="rtl">
                        <p className="text-sm break-words">{text}</p>
                    </PopoverContent>
                </Popover>
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
            const [deleteStock, { isLoading: isDeleting }] = useDeleteStockMutation();
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);
            const { toast } = useToast();
            const router = useRouter();

            const handleDeleteClick = () => {
                setShowDeleteDialog(true);
            };

            const handleDeleteConfirm = async () => {
                try {
                    await deleteStock({ id: item.uniqueID }).unwrap();
                    toast({
                        title: 'تم بنجاح',
                        description: `تم حذف المنتج "${item.name}" بنجاح`
                    });
                    setShowDeleteDialog(false);
                } catch (error: any) {
                    const errorMessage =
                        error?.data?.errorMessages?.[0] ??
                        error?.data?.message ??
                        'حدث خطأ أثناء حذف المنتج';
                    toast({
                        title: 'خطأ',
                        description: errorMessage,
                        variant: 'destructive'
                    });
                }
            };

            const handleDeleteCancel = () => {
                setShowDeleteDialog(false);
            };

            return (
                <>
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-subtext hover:text-sidebaractive hover:bg-blue-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/stock/edit-stock/${item.uniqueID}`);
                            }}
                        >
                            <Pencil className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-subtext hover:text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick();
                            }}
                            disabled={isDeleting}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                    <DeleteConfirmationDialog
                        isOpen={showDeleteDialog}
                        onClose={handleDeleteCancel}
                        onConfirm={handleDeleteConfirm}
                        itemName={item.name}
                        isDeleting={isDeleting}
                    />
                </>
            );
        }
    }
];

export const inventoryColumnsNames = [
    { label: 'ت', dataIndex: 'sequence' },
    { label: 'المنتج', dataIndex: 'product' },
    { label: 'الكود', dataIndex: 'code' },
    { label: 'التكلفة', dataIndex: 'cost' },
    { label: 'الرزام', dataIndex: 'bundle' },
    { label: 'مشرف الرزم', dataIndex: 'bundleSupervisor' },
    { label: 'التاريخ', dataIndex: 'date' },
    { label: 'حالة المنتج', dataIndex: 'status' },
    { label: 'التوزيع', dataIndex: 'distribution' },
    { label: 'الملاحظة', dataIndex: 'note' },
    { label: 'الإجراءات', dataIndex: 'actions' }
];
