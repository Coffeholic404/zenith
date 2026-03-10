'use client';
import { useMemo, useState } from 'react';
import { DataTable, type DateFilter } from '@/components/data-table';
import {
    inventoryColumns,
    inventoryColumnsNames,
    type inventory
} from '@/components/pages/stock/stock-columns';
import { useGetStocksQuery, useGetStockDatesQuery } from '@/services/stock';
import { useGetStudentsQuery } from '@/services/students';
import { useGetTrainersQuery } from '@/services/employe';

export default function InventoryPage() {
    // Date filter state
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);

    const { data, isLoading } = useGetStocksQuery({
        pageNumber: 1,
        pageSize: 100
    });

    // Fetch filtered stock IDs when dates are selected
    const { data: stockDatesData } = useGetStockDatesQuery({
        ...(fromDate && { from: fromDate.toISOString() }),
        ...(toDate && { to: toDate.toISOString() }),
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

    // Set of stock IDs that match the date filter
    const filteredStockIds = useMemo(() => {
        if (!fromDate && !toDate) return null; // no filter active
        const ids = new Set<string>();
        (stockDatesData?.result ?? []).forEach((item) => {
            ids.add(item.id);
        });
        return ids;
    }, [stockDatesData, fromDate, toDate]);

    const inventoryData: inventory[] = (data?.result?.data ?? [])
        .filter((stock) => {
            // If date filter is active, only show stocks whose ID is in the filtered set
            if (filteredStockIds !== null) {
                return filteredStockIds.has(stock.id);
            }
            return true;
        })
        .map((stock) => ({
            uniqueID: stock.id,
            name: stock.itemName ?? stock.itemId,
            code: stock.code,
            cost: stock.cost,
            bundle: studentNameMap.get(stock.packagerId) ?? stock.packagerId,
            bundleSupervisor: trainerNameMap.get(stock.packetCoachId) ?? stock.packetCoachId,
            date: stock.createdAt?.substring(0, 10) ?? '',
            status: (stock.status ?? 'new').toLowerCase() as 'new' | 'used' | 'broken',
            distribution: String(stock.distribution ?? '')
        }));

    const dateFilter: DateFilter = {
        from: fromDate,
        to: toDate,
        onFromChange: setFromDate,
        onToChange: setToDate
    };

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
                dateFilter={dateFilter}
            />
        </div>
    );
}
