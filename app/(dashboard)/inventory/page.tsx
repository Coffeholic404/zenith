'use client';
import { useMemo } from 'react';
import { DataTable } from '@/components/data-table';
import {
    inventoryColumns,
    inventoryColumnsNames,
    type inventory
} from '@/components/pages/inventory/inventory-columns';
import { useGetStocksQuery } from '@/services/stock';
import { useGetStudentsQuery } from '@/services/students';
import { useGetTrainersQuery } from '@/services/employe';

export default function InventoryPage() {
    const { data, isLoading } = useGetStocksQuery({
        pageNumber: 1,
        pageSize: 100
    });

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

    const inventoryData: inventory[] = (data?.result?.data ?? []).map((stock) => ({
        uniqueID: stock.id,
        name: stock.itemName ?? stock.itemId,
        code: stock.code,
        cost: stock.cost,
        bundle: studentNameMap.get(stock.packagerId) ?? stock.packagerId,
        bundleSupervisor: trainerNameMap.get(stock.packetCoachId) ?? stock.packetCoachId,
        date: stock.createdAt?.substring(0, 10) ?? '',
        status: 'new' as const
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                <div className="font-vazirmatn">
                    <p className="font-bold text-cardTxt">إدارة الجرد</p>
                    <p className="font-light text-subtext text-lg">تنظيم وإدارة المنتجات والمخزون</p>
                </div>
            </div>
            <DataTable
                columns={inventoryColumns}
                data={inventoryData}
                columnsNames={inventoryColumnsNames}
                type="inventory"
                loading={isLoading}
            />
        </div>
    );
}
