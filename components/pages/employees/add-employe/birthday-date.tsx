'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BirthdayDateProps extends ControllerRenderProps {
  placeholder?: string;
  className?: string;
}

function formatDateForDisplay(date: Date | undefined): string {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // Display as: yyyy mm dd
  return `${year} ${month} ${day}`;
}

function formatDateForInput(dateString: string): Date | undefined {
  if (!dateString) return undefined;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
}

function isValidDate(date: Date | undefined): boolean {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export default function BirthdayDate({
  value,
  onChange,
  onBlur,
  name,
  placeholder = 'اختر تاريخ الميلاد',
  className = ''
}: BirthdayDateProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(formatDateForInput(value));
  const [displayValue, setDisplayValue] = React.useState(formatDateForDisplay(formatDateForInput(value)));

  // Update internal state when value prop changes
  React.useEffect(() => {
    const date = formatDateForInput(value);
    setSelectedDate(date);
    setDisplayValue(formatDateForDisplay(date));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Try to parse the input as a date
    // Support formats: yyyy-mm-dd, yyyy/mm/dd, yyyy mm dd
    const ymdMatch = inputValue.match(/^\s*(\d{4})[-/ ](\d{2})[-/ ](\d{2})\s*$/);
    const parsedDate = ymdMatch
      ? new Date(Number(ymdMatch[1]), Number(ymdMatch[2]) - 1, Number(ymdMatch[3]))
      : new Date(inputValue);
    if (isValidDate(parsedDate)) {
      setSelectedDate(parsedDate);
      // Convert to YYYY-MM-DD format for form submission (local time, not UTC)
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      // If invalid, still update the form with the raw input for validation
      onChange(inputValue);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setDisplayValue(formatDateForDisplay(date));
      // Convert to YYYY-MM-DD format for form submission (local time, not UTC)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className="relative">
      <Input
        name={name}
        value={displayValue}
        placeholder={placeholder}
        className={`bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 ${className}`}
        onChange={handleInputChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        dir="rtl"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2 hover:bg-transparent"
          >
            <CalendarIcon className="size-4 text-subtext" />
            <span className="sr-only">اختر التاريخ</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
            defaultMonth={selectedDate || new Date(2000, 0, 1)}
            fromYear={1950}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
