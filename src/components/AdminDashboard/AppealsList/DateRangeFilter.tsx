import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

export const DateRangeFilter = ({ onDateRangeChange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      onDateRangeChange(date, endDate);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date);
      onDateRangeChange(startDate, date);
    }
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    onDateRangeChange(null, null);
  };

  return (
    <div className="flex gap-2 items-center mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <CalendarIcon className="ml-2 h-4 w-4" />
            {startDate ? (
              format(startDate, "dd/MM/yyyy", { locale: he })
            ) : (
              "בחר תאריך התחלה"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate || undefined}
            onSelect={handleStartDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <CalendarIcon className="ml-2 h-4 w-4" />
            {endDate ? (
              format(endDate, "dd/MM/yyyy", { locale: he })
            ) : (
              "בחר תאריך סיום"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate || undefined}
            onSelect={handleEndDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(startDate || endDate) && (
        <Button variant="ghost" onClick={clearDates}>
          נקה תאריכים
        </Button>
      )}
    </div>
  );
};