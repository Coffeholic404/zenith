"use client";

import { Card } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface StatCardItem {
    /** The label/title for the stat */
    label: string;
    /** The value to display */
    value: string | number | ReactNode;
    /** Icon source - can be a static import or string path */
    icon?: StaticImageData | string;
    /** Custom icon component as an alternative to image */
    iconComponent?: ReactNode;
    /** Background color class for the card (e.g., "bg-cardOne") */
    cardBgClass?: string;
    /** Background color class for the icon container */
    iconBgClass?: string;
}

export interface StatCardProps extends StatCardItem {
    className?: string;
}

export interface HeaderCardsProps {
    /** Array of stat card items to display */
    items: StatCardItem[];
    /** Custom className for the grid container */
    className?: string;
    /** Number of columns on xl screens (default: 4) */
    xlCols?: 2 | 3 | 4;
}

/**
 * Individual stat card component
 */
export function StatCard({
    label,
    value,
    icon,
    iconComponent,
    cardBgClass = "bg-cardOne",
    iconBgClass = "bg-studentClr",
    className = "",
}: StatCardProps) {
    return (
        <Card className={`w-full shadow-none ${cardBgClass} p-4 ${className}`}>
            <div className="flex items-center justify-start gap-[14px]">
                <div className={`size-12 flex items-center justify-center ${iconBgClass} rounded-xl`}>
                    {iconComponent ? (
                        iconComponent
                    ) : icon ? (
                        <Image src={icon} alt={label} width={24} height={24} />
                    ) : null}
                </div>
                <div className="font-vazirmatn space-y-2">
                    <p className="font-normal text-base text-cardTxt">{label}</p>
                    <p className="font-bold text-xl">{value}</p>
                </div>
            </div>
        </Card>
    );
}

/**
 * Header cards grid container - displays multiple stat cards in a responsive grid
 */
export function HeaderCards({ items, className = "", xlCols = 4 }: HeaderCardsProps) {
    const xlColsClass = {
        2: "xl:grid-cols-2",
        3: "xl:grid-cols-3",
        4: "xl:grid-cols-4",
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${xlColsClass[xlCols]} gap-4 xl:gap-6 w-full ${className}`}>
            {items.map((item, index) => (
                <StatCard key={index} {...item} />
            ))}
        </div>
    );
}

export default HeaderCards;
