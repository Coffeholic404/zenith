'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Trash2, ShoppingCart } from 'lucide-react';

// ── Status helpers ───────────────────────────────────────────────────────────

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

// ── Types ────────────────────────────────────────────────────────────────────

export type BillItemEntry = {
    id: string;
    item: string;
    amount: number;
    cost: number;
    code: string;
    status: 'new' | 'used' | 'broken';
    allowDistribute: boolean;
};

type AvailableItem = {
    value: string;
    label: string;
};

interface BillItemsListProps {
    items: BillItemEntry[];
    totalCost: number;
    availableItems: AvailableItem[];
    onRemoveItem: (id: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function BillItemsList({
    items,
    totalCost,
    availableItems,
    onRemoveItem
}: BillItemsListProps) {
    return (
        <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
            <div className=" px-6 py-4 border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        المواد المضافة
                    </p>
                    <Badge className="bg-badgeClr text-sidebaractive font-vazirmatn text-xs rounded-lg hover:bg-badgeClr">
                        {items.length} مادة
                    </Badge>
                </div>
                {items.length > 0 && (
                    <div className="font-vazirmatn text-sm text-subtext flex items-center gap-1">
                        الإجمالي:{' '}
                        <span className="font-bold text-cardTxt">
                            {totalCost.toLocaleString('ar-IQ')}
                        </span>
                    </div>
                )}
            </div>
            <CardContent className="p-6">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="size-16 rounded-full bg-searchBg flex items-center justify-center mb-4">
                            <ShoppingCart className="size-7 text-subtext" />
                        </div>
                        <p className="font-vazirmatn text-subtext text-sm">
                            لم يتم إضافة أي مواد بعد
                        </p>
                        <p className="font-vazirmatn text-subtext/60 text-xs mt-1">
                            قم بتعبئة بيانات المادة أعلاه ثم اضغط &quot;إضافة المادة&quot;
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const itemLabel =
                                availableItems.find((i) => i.value === item.item)?.label ??
                                item.item;

                            return (
                                <div
                                    key={item.id}
                                    className="group flex items-center gap-4 p-4 bg-searchBg/50 rounded-xl border border-border/40 hover:border-sidebaractive/30 transition-all duration-200"
                                >
                                    {/* Index */}
                                    <div className="size-9 rounded-lg bg-badgeClr flex items-center justify-center shrink-0">
                                        <span className="font-vazirmatn font-bold text-sidebaractive text-sm">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 font-vazirmatn">
                                        {/* Name */}
                                        <div>
                                            <p className="text-[11px] text-subtext mb-0.5">
                                                المادة
                                            </p>
                                            <p className="text-sm font-semibold text-cardTxt truncate">
                                                {itemLabel}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <p className="text-[11px] text-subtext mb-0.5">
                                                الكمية
                                            </p>
                                            <p className="text-sm font-semibold text-cardTxt">
                                                {item.amount}
                                            </p>
                                        </div>

                                        {/* Cost */}
                                        <div>
                                            <p className="text-[11px] text-subtext mb-0.5">
                                                التكلفة
                                            </p>
                                            <p className="text-sm font-semibold text-cardTxt">
                                                {item.cost.toLocaleString('ar-IQ')}
                                            </p>
                                        </div>

                                        {/* Code */}
                                        <div>
                                            <p className="text-[11px] text-subtext mb-0.5">
                                                الرمز
                                            </p>
                                            <p className="text-sm font-semibold text-cardTxt">
                                                {item.code}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <p className="text-[11px] text-subtext mb-0.5">
                                                الحالة
                                            </p>
                                            <Badge
                                                className={cn(
                                                    'text-[11px] font-vazirmatn rounded-md border px-2 py-0.5',
                                                    statusColors[item.status]
                                                )}
                                            >
                                                {statusLabels[item.status]}
                                            </Badge>
                                        </div>

                                        {/* Distribute */}
                                        <div>
                                            <p className="text-[11px] text-subtext mb-0.5">
                                                التوزيع
                                            </p>
                                            <Badge
                                                className={cn(
                                                    'text-[11px] font-vazirmatn rounded-md border px-2 py-0.5',
                                                    item.allowDistribute
                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                                )}
                                            >
                                                {item.allowDistribute ? 'مسموح' : 'غير مسموح'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 text-subtext hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={() => onRemoveItem(item.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
