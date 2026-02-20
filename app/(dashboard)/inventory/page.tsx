'use client';
import { DataTable } from '@/components/data-table';
import {
    inventoryColumns,
    inventoryColumnsNames,
    type inventory
} from '@/components/pages/inventory/inventory-columns';


const inventoryData: inventory[] = [
    {
        uniqueID: '1',
        name: 'قطع غيار محرك',
        code: 'ENG-001',
        cost: 250000,
        bundle: 'رزمة أ',
        bundleSupervisor: 'أحمد محمد',
        date: '2026-01-15',
        status: 'new'
    },
    {
        uniqueID: '2',
        name: 'زيوت تشحيم',
        code: 'OIL-042',
        cost: 75000,
        bundle: 'رزمة ب',
        bundleSupervisor: 'علي حسين',
        date: '2026-01-20',
        status: 'used'
    },
    {
        uniqueID: '3',
        name: 'فلاتر هواء',
        code: 'FLT-018',
        cost: 35000,
        bundle: 'رزمة أ',
        bundleSupervisor: 'أحمد محمد',
        date: '2026-02-01',
        status: 'new'
    },
    {
        uniqueID: '4',
        name: 'إطارات',
        code: 'TIR-007',
        cost: 500000,
        bundle: 'رزمة ج',
        bundleSupervisor: 'محمد عبدالله',
        date: '2026-02-10',
        status: 'broken'
    },
    {
        uniqueID: '5',
        name: 'بطاريات',
        code: 'BAT-003',
        cost: 180000,
        bundle: 'رزمة ب',
        bundleSupervisor: 'علي حسين',
        date: '2026-02-15',
        status: 'new'
    }
];

export default function InventoryPage() {
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
            />
        </div>
    );
}
