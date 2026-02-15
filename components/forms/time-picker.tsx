'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TimePickerProps {
  time: string;
  setTime: (time: string) => void;
}

export function TimePickerDemo({ time, setTime }: TimePickerProps) {
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  // Initialize with formatted current time if no time is provided
  const defaultTime = time || format(new Date(), 'HH:mm:ss');

  const [hour, setHour] = React.useState<string>(() => defaultTime.split(':')[0]);
  const [minute, setMinute] = React.useState<string>(() => defaultTime.split(':')[1]);
  const [second, setSecond] = React.useState<string>(() => defaultTime.split(':')[2]);

  // Update parent component when time changes
  React.useEffect(() => {
    const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
    setTime(formattedTime);
  }, [hour, minute, second, setTime]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    maxValue: number,
    nextRef: React.RefObject<HTMLInputElement> | null
  ) => {
    let inputValue = e.target.value;

    if (/^\d{0,2}$/.test(inputValue)) {
      let numericValue = inputValue ? Number.parseInt(inputValue, 10) : NaN;
      if (isNaN(numericValue) || (numericValue >= 0 && numericValue <= maxValue)) {
        setValue(inputValue);
        if (inputValue.length === 2 && nextRef) {
          nextRef.current?.focus();
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="hours" className="text-muted-foreground">
          الوقت
        </Label>
      </div>
      <div className="flex gap-2 time-picker-container">
        <div className="grid gap-1 text-center">
          <Input
            ref={hourRef}
            id="hours"
            className="w-16 text-center"
            value={hour}
            onChange={e => handleInputChange(e, setHour, 23, minuteRef)}
            placeholder="00"
            maxLength={2}
            inputMode="numeric"
          />
          <Label htmlFor="hours" className="text-xs text-muted-foreground">
            ساعة
          </Label>
        </div>
        <span className="text-xl">:</span>
        <div className="grid gap-1 text-center">
          <Input
            ref={minuteRef}
            id="minutes"
            className="w-16 text-center"
            value={minute}
            onChange={e => handleInputChange(e, setMinute, 59, secondRef)}
            placeholder="00"
            maxLength={2}
            inputMode="numeric"
          />
          <Label htmlFor="minutes" className="text-xs text-muted-foreground">
            دقيقة
          </Label>
        </div>
        <span className="text-xl">:</span>
        <div className="grid gap-1 text-center">
          <Input
            ref={secondRef}
            id="seconds"
            className="w-16 text-center"
            value={second}
            onChange={e => handleInputChange(e, setSecond, 59, null)}
            placeholder="00"
            maxLength={2}
            inputMode="numeric"
          />
          <Label htmlFor="seconds" className="text-xs text-muted-foreground">
            ثانية
          </Label>
        </div>
      </div>
    </div>
  );
}
