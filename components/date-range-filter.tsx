'use client';

import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DateRangeFilterProps {
    from: Date | undefined;
    to: Date | undefined;
    onFromChange: (date: Date | undefined) => void;
    onToChange: (date: Date | undefined) => void;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    className?: string;
}

export function DateRangeFilter({
    from,
    to,
    onFromChange,
    onToChange,
    fromPlaceholder = 'من تاريخ',
    toPlaceholder = 'إلى تاريخ',
    className
}: DateRangeFilterProps) {
    return (
        <div className={`flex items-center gap-2 font-vazirmatn ${className ?? ''}`}>
            {/* FROM date picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`h-10 min-w-[160px] justify-start gap-2 rounded-xl bg-searchBg border-none text-right font-vazirmatn text-sm ${from ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                    >
                        <CalendarIcon className="size-4 shrink-0 opacity-60" />
                        {from ? format(from, 'yyyy/MM/dd') : fromPlaceholder}
                        {from && (
                            <X
                                className="mr-auto size-3.5 opacity-60 hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFromChange(undefined);
                                }}
                            />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={from}
                        onSelect={(date) => onFromChange(date)}
                        disabled={(date) => (to ? date > to : false)}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {/* TO date picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`h-10 min-w-[160px] justify-start gap-2 rounded-xl bg-searchBg border-none text-right font-vazirmatn text-sm ${to ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                    >
                        <CalendarIcon className="size-4 shrink-0 opacity-60" />
                        {to ? format(to, 'yyyy/MM/dd') : toPlaceholder}
                        {to && (
                            <X
                                className="mr-auto size-3.5 opacity-60 hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToChange(undefined);
                                }}
                            />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={to}
                        onSelect={(date) => onToChange(date)}
                        disabled={(date) => (from ? date < from : false)}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
