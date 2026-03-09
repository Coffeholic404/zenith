'use client';
import { useMemo, useState } from 'react';
import { DataTable, type DateFilter } from '@/components/data-table';
import {
    InventoryColumns,
    InventoryColumnsNames,
    type InventoryRow
} from '@/components/pages/Inventory/Inventory-columns';
import { useGetInventoryQuery, useGetInventoryDatesQuery } from '@/services/Inventory';
import { useGetStudentsQuery } from '@/services/students';
import { useGetTrainersQuery } from '@/services/employe';

export default function InventoryPage() {
    // Date filter state
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);

    const { data, isLoading } = useGetInventoryQuery({
        pageNumber: 1,
        pageSize: 100
    });

    // Fetch filtered inventory IDs when dates are selected
    const { data: inventoryDatesData } = useGetInventoryDatesQuery({
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

    // Set of inventory IDs that match the date filter
    const filteredIds = useMemo(() => {
        if (!fromDate && !toDate) return null; // no filter active
        const ids = new Set<string>();
        (inventoryDatesData?.result ?? []).forEach((item) => {
            ids.add(item.id);
        });
        return ids;
    }, [inventoryDatesData, fromDate, toDate]);

    const inventoryData: InventoryRow[] = (data?.result?.data ?? [])
        .filter((item) => {
            if (filteredIds !== null) {
                return filteredIds.has(item.uniqueID);
            }
            return true;
        })
        .map((item) => ({
            uniqueID: item.uniqueID,
            itemName: item.itemName,
            generatedCode: item.generatedCode,
            code: item.code,
            status: item.status,
            packagerName: item.packagerId
                ? (studentNameMap.get(item.packagerId) ?? item.packagerId)
                : '—',
            packetCoachName: item.packetCoachId
                ? (trainerNameMap.get(item.packetCoachId) ?? item.packetCoachId)
                : '—',
            date: item.date,
            distribution: item.distribution
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
                    <p className="font-bold text-cardTxt">إدارة المخزون</p>
                    <p className="font-light text-subtext text-lg">تنظيم وإدارة المخزون والمنتجات</p>
                </div>
            </div>
            <DataTable
                columns={InventoryColumns}
                data={inventoryData}
                columnsNames={InventoryColumnsNames}
                type="Inventory"
                loading={isLoading}
                dateFilter={dateFilter}
            />
        </div>
    );
}
