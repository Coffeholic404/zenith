'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Pencil, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetInventoryByIdQuery } from '@/services/Inventory';
import { useGetInventoryHistoryByRecordIdQuery } from '@/services/InventoryHistory';
import { useGetStudentsQuery } from '@/services/students';
import { useGetTrainersQuery } from '@/services/employe';
import { DataTable } from '@/components/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import {
    InventoryHistoryColumns,
    InventoryHistoryColumnsNames,
    type InventoryHistoryRow
} from '@/components/pages/InventoryHistory/InventoryHistory-columns';

// ── Labels / Colors ──────────────────────────────────────────────────────────

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

// ── Styling ──────────────────────────────────────────────────────────────────

const labelClasses = 'font-vazirmatn text-subtext font-medium text-[13px]';
const valueClasses = 'font-vazirmatn text-cardTxt text-sm font-semibold';

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function DetailSkeleton() {
    return (
        <div className="space-y-6 pb-10" dir="rtl">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-10 w-20" />
            </div>
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <Skeleton className="h-5 w-32" />
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="space-y-6 pb-10" dir="rtl">
            <Card className="border border-red-200 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-10 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="size-16 rounded-full bg-red-50 flex items-center justify-center">
                        <svg className="size-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-vazirmatn font-bold text-cardTxt text-lg">حدث خطأ</p>
                        <p className="font-vazirmatn text-subtext text-sm mt-1">{message}</p>
                    </div>
                    <Button
                        onClick={onRetry}
                        className="bg-sidebaractive hover:bg-sidebaractive hover:brightness-110 text-white font-vazirmatn rounded-2xl px-6"
                    >
                        إعادة المحاولة
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Info Field Component ─────────────────────────────────────────────────────

function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <p className={labelClasses}>{label}</p>
            <div className={valueClasses}>{children}</div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function InventoryDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const {
        data: inventoryData,
        isLoading: isLoadingInventory,
        isError: isInventoryError,
        error: inventoryError,
        refetch: refetchInventory
    } = useGetInventoryByIdQuery({ id });

    const { data: studentsData } = useGetStudentsQuery({
        pageNumber: 1,
        pageSize: 1000
    });

    const { data: trainersData } = useGetTrainersQuery({
        pageNumber: 1,
        pageSize: 1000
    });

    // Build lookup maps: id → name
    const studentNameMap = useMemo(() => {
        const map = new Map<string, string>();
        (studentsData?.result?.data ?? []).forEach((s) => {
            map.set(s.uniqueID, s.name);
        });
        return map;
    }, [studentsData]);

    const trainerNameMap = useMemo(() => {
        const map = new Map<string, string>();
        (trainersData?.result?.data ?? []).forEach((t) => {
            if (t.id) map.set(t.id, t.name);
        });
        return map;
    }, [trainersData]);

    // Fetch inventory history records
    const {
        data: historyData,
        isLoading: isLoadingHistory
    } = useGetInventoryHistoryByRecordIdQuery({ inventoryRecordId: id });

    const inventoryItem = inventoryData?.result;

    // ── Loading state ────────────────────────────────────────────────────
    if (isLoadingInventory || !inventoryItem) {
        return <DetailSkeleton />;
    }

    // ── Error state ──────────────────────────────────────────────────────
    if (isInventoryError) {
        const errorMsg =
            (inventoryError as any)?.data?.errorMessages?.[0] ??
            'لم يتم العثور على المنتج أو حدث خطأ في الاتصال';
        return <ErrorState message={errorMsg} onRetry={refetchInventory} />;
    }

    // ── Resolved names ───────────────────────────────────────────────────
    const packagerName = inventoryItem.packagerId
        ? (studentNameMap.get(inventoryItem.packagerId) ?? '—')
        : '—';

    const packetCoachName = inventoryItem.packetCoachId
        ? (trainerNameMap.get(inventoryItem.packetCoachId) ?? '—')
        : '—';

    const status = (inventoryItem.status ?? '').toLowerCase();
    const distribution = String(inventoryItem.distribution ?? '').toLowerCase();
    const formattedDate = inventoryItem.date
        ? new Date(inventoryItem.date).toLocaleDateString('ar-IQ')
        : '—';

    // ── Map history records to table rows ─────────────────────────────────
    const historyRows: InventoryHistoryRow[] = (historyData?.result ?? []).map((record) => ({
        uniqueID: record.uniqueID,
        itemName: inventoryItem.itemName ?? '—',
        code: record.code,
        generatedCode: record.generatedCode,
        packagerName: record.packagerId
            ? (studentNameMap.get(record.packagerId) ?? record.packagerId)
            : '—',
        packetCoachName: record.packetCoachId
            ? (trainerNameMap.get(record.packetCoachId) ?? record.packetCoachId)
            : '—',
        oldDate: record.oldDate,
        newDate: record.newDate,
        status: record.status,
        distribution: record.distribution
    }));

    return (
        <div className="space-y-6 pb-10" dir="rtl">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="font-vazirmatn">
                    <p className="font-bold text-cardTxt text-lg">تفاصيل المنتج</p>
                    <p className="font-light text-subtext text-sm">
                        عرض بيانات المنتج:{' '}
                        <span className="font-medium text-cardTxt">
                            {inventoryItem.itemName ?? ''}
                        </span>
                        {inventoryItem.generatedCode && (
                            <span className="text-subtext mr-1">
                                ({inventoryItem.generatedCode})
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className="bg-sidebaractive hover:bg-sidebaractive hover:brightness-110 text-white font-vazirmatn rounded-2xl px-4 gap-2 text-sm"
                        onClick={() => router.push(`/Inventory/AddInventoryHistory/${id}`)}
                    >
                        <Plus className="size-4" />
                        أضافة فحص
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-lg text-subtext hover:text-sidebaractive hover:bg-blue-50"
                        onClick={() => router.push(`/Inventory/edit-inventory/${id}`)}
                        title="تعديل"
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="font-vazirmatn text-subtext gap-2"
                        onClick={() => router.back()}
                    >
                        رجوع
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </div>

            {/* ── Info Card ────────────────────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        معلومات المنتج
                    </p>
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        {/* المنتج */}
                        <InfoField label="المنتج">
                            {inventoryItem.itemName ?? '—'}
                        </InfoField>

                        {/* الرمز */}
                        <InfoField label="الرمز">
                            {inventoryItem.code ?? '—'}
                        </InfoField>

                        {/* الرمز المولد */}
                        <InfoField label="الرمز المولد">
                            {inventoryItem.generatedCode ?? '—'}
                        </InfoField>

                        {/* التاريخ */}
                        <InfoField label="التاريخ">
                            {new Date(inventoryItem.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}
                        </InfoField>

                        {/* الرزام */}
                        <InfoField label="الرزام">
                            {packagerName}
                        </InfoField>

                        {/* مشرف الرزم */}
                        <InfoField label="مشرف الرزم">
                            {packetCoachName}
                        </InfoField>

                        {/* حالة المنتج */}
                        <InfoField label="حالة المنتج">
                            <Badge
                                className={cn(
                                    'text-[11px] font-vazirmatn rounded-md border px-2.5 py-0.5',
                                    statusColors[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
                                )}
                            >
                                {statusLabels[status] ?? status}
                            </Badge>
                        </InfoField>

                        {/* التوزيع */}
                        <InfoField label="التوزيع">
                            <Badge
                                className={cn(
                                    'text-[11px] font-vazirmatn rounded-md border px-2.5 py-0.5',
                                    distributionColors[distribution] ?? 'bg-gray-100 text-gray-700 border-gray-200'
                                )}
                            >
                                {distributionLabels[distribution] ?? distribution}
                            </Badge>
                        </InfoField>
                    </div>
                </CardContent>
            </Card>

            {/* ── Inventory History Table ─────────────────────────────────────────── */}
            {isLoadingHistory ? (
                <DataTableSkeleton columnCount={10} rowCount={5} />
            ) : (
                <DataTable
                    columns={InventoryHistoryColumns}
                    data={historyRows}
                    columnsNames={InventoryHistoryColumnsNames}
                    type="InventoryHistory"
                />
            )}
        </div>
    );
}
