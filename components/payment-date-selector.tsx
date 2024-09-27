"use client";

import { useState, useEffect } from "react";
import { format, getDay, lastDayOfMonth, addDays, setMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

const weekdays = [
  "Ням гараг",
  "Даваа гараг",
  "Мягмар гараг",
  "Лхагва гараг",
  "Пүрэв гараг",
  "Баасан гараг",
  "Бямба гараг",
];

interface Props {
  initialDate?: Date;
  setPaymentDate?: (date: Date) => void;
}

export function PaymentDateSelector({ initialDate, setPaymentDate }: Props) {
  const [mainOption, setMainOption] = useState("MONTHLY");
  const [subOption, setSubOption] = useState("SAME_DAY_EACH_MONTH");
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate ?? new Date()
  );
  const [daysAfter, setDaysAfter] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  useEffect(() => {
    updateSelectedDate();
  }, [mainOption, subOption, daysAfter]);

  const updateSelectedDate = () => {
    const today = new Date();
    let newDate: Date;

    if (mainOption === "MONTHLY") {
      if (subOption === "LAST_DAY_OF_THE_MONTH") {
        newDate = lastDayOfMonth(today);
      } else if (subOption === "LAST_WEEKDAY") {
        const lastDay = lastDayOfMonth(today);
        newDate = new Date(lastDay);
        while (newDate.getDay() === 0 || newDate.getDay() === 6) {
          newDate.setDate(newDate.getDate() - 1);
        }
      } else {
        newDate = today;
      }
    } else if (mainOption === "DAYS_AFTER") {
      const lastDayOfPreviousMonth = lastDayOfMonth(
        setMonth(today, today.getMonth() - 1)
      );
      newDate = addDays(lastDayOfPreviousMonth, parseInt(daysAfter) || 0);
    } else {
      newDate = today;
    }

    setPaymentDate?.(newDate);
    setSelectedDate(newDate);
    setCalendarDate(newDate);
  };

  const getOrdinal = (n: number) => {
    const s = [" дахь", " дэх", " дох", " дахь", " дөх"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getWeekOfMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const weekDiff = Math.floor(
      (date.getDate() - firstDayOfMonth.getDate()) / 7
    );
    return weekDiff + 1;
  };

  const formatSelectedDate = () => {
    if (mainOption === "MONTHLY") {
      if (subOption === "SAME_DAY_EACH_MONTH") {
        return `Сар болгоны ${selectedDate.getDate()}нд`;
      } else if (subOption === "LAST_WEEKDAY") {
        const weekOfMonth = getWeekOfMonth(selectedDate);
        const dayOfWeek = weekdays[getDay(selectedDate)];
        const lastDay = lastDayOfMonth(selectedDate);

        if (selectedDate.getDate() === lastDay.getDate()) {
          return `Сар болгоны сүүлчийн ${dayOfWeek}`;
        } else {
          return `Сар болгоны ${getOrdinal(weekOfMonth)} ${dayOfWeek}`;
        }
      } else if (subOption === "LAST_DAY_OF_THE_MONTH") {
        return "Сар болгоны сүүлийн өдрөөр";
      }
    } else {
      return `Өмнөх сараас ${daysAfter} хоногийн дараа`;
    }

    return format(selectedDate, "MMMM d, yyyy");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {formatSelectedDate()}
          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex p-4 space-x-4">
          <div className="space-y-4 w-64">
            <div>
              <Label htmlFor="main-option">Төрөл</Label>
              <Select onValueChange={setMainOption} value={mainOption}>
                <SelectTrigger id="main-option">
                  <SelectValue placeholder="Select payment frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Сар болгон</SelectItem>
                  <SelectItem value="DAYS_AFTER">Хоногийн дараа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mainOption === "MONTHLY" && (
              <div>
                <Label htmlFor="sub-option">Payment Type</Label>
                <Select onValueChange={setSubOption} value={subOption}>
                  <SelectTrigger id="sub-option">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAME_DAY_EACH_MONTH">
                      Сар болгоны сонгосон өдрөөр
                    </SelectItem>
                    <SelectItem value="LAST_WEEKDAY">
                      7 хоногийн өдрөөр
                    </SelectItem>
                    <SelectItem value="LAST_DAY_OF_THE_MONTH">
                      Сар болгоны сүүлийн өдрөөр
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {mainOption === "DAYS_AFTER" && (
              <div>
                <Label htmlFor="days-after">Хоногийн дараа</Label>
                <Input
                  id="days-after"
                  type="number"
                  value={daysAfter}
                  onChange={(e) => setDaysAfter(e.target.value)}
                  min="0"
                />
              </div>
            )}

            <div className="border-t py-4">
              <Label>Эргэн төлөлтийн хуваарь: </Label>
              <p className="mt-1 text-sm font-medium">{formatSelectedDate()}</p>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Сонгосон өдөр</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setPaymentDate?.(date);
                  setSelectedDate(date);
                  setCalendarDate(date);
                  if (
                    mainOption === "MONTHLY" &&
                    subOption === "LAST_DAY_OF_THE_MONTH"
                  ) {
                    const lastDay = lastDayOfMonth(date);
                    setPaymentDate?.(lastDay);
                    setSelectedDate(lastDay);
                    setCalendarDate(lastDay);
                  }
                }
              }}
              month={calendarDate}
              onMonthChange={setCalendarDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
