"use client"

import * as React from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DatePickerType = "full" | "year" | "month"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  type?: DatePickerType
  placeholder?: string
}

export function DatePickerDemo({ date, setDate, type = "full", placeholder = "اختر تاريخًا" }: DatePickerProps) {
  const [pickerType, setPickerType] = React.useState<DatePickerType>(type)

  // Format the date based on the picker type
  const formatDate = (date: Date | undefined) => {
    if (!date) return placeholder

    switch (pickerType) {
      case "year":
        return format(date, "yyyy", { locale: ar })
      case "month":
        return format(date, "yyyy-MM", { locale: ar })
      case "full":
      default:
        return format(date, "yyyy-MM-dd", { locale: ar })
    }
  }

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    if (!date) {
      const newDate = new Date()
      newDate.setMonth(month)
      setDate(newDate)
    } else {
      const newDate = new Date(date)
      newDate.setMonth(month)
      setDate(newDate)
    }
  }

  // Handle year selection
  const handleYearSelect = (year: number) => {
    if (!date) {
      const newDate = new Date()
      newDate.setFullYear(year)
      setDate(newDate)
    } else {
      const newDate = new Date(date)
      newDate.setFullYear(year)
      setDate(newDate)
    }
  }

  // Generate years for selection (current year ± 100 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i)

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-between text-right font-normal", !date && "text-muted-foreground")}
            >
              {formatDate(date)}
              <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <Select value={pickerType} onValueChange={(value) => setPickerType(value as DatePickerType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="نوع التاريخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">تاريخ كامل</SelectItem>
                  <SelectItem value="month">شهر وسنة</SelectItem>
                  <SelectItem value="year">سنة فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {pickerType === "full" && (
              <Calendar mode="single" selected={date} onSelect={setDate} locale={ar} initialFocus />
            )}

            {pickerType === "month" && (
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className={cn("h-9", date && date.getMonth() === i && "bg-primary text-primary-foreground")}
                      onClick={() => handleMonthSelect(i)}
                    >
                      {format(new Date(2000, i, 1), "MMM", { locale: ar })}
                    </Button>
                  ))}
                </div>
                <Select
                  value={date ? date.getFullYear().toString() : currentYear.toString()}
                  onValueChange={(value) => handleYearSelect(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="السنة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {pickerType === "year" && (
              <div className="p-3">
                <Select
                  value={date ? date.getFullYear().toString() : currentYear.toString()}
                  onValueChange={(value) => handleYearSelect(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="السنة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

