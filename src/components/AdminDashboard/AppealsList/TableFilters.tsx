import { SearchInput } from "./SearchInput";
import { DateRangeFilter } from "./DateRangeFilter";
import { ScoreRangeFilter } from "./ScoreRangeFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  itemsPerPage: string;
  setItemsPerPage: (value: string) => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  scoreRange: [number, number];
  onScoreRangeChange: (range: [number, number]) => void;
}

export const TableFilters = ({
  searchQuery,
  setSearchQuery,
  itemsPerPage,
  setItemsPerPage,
  setPageSize,
  setCurrentPage,
  onDateRangeChange,
  scoreRange,
  onScoreRangeChange,
}: TableFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <div className="flex items-center gap-2">
          <span className="text-sm">תוצאות בעמוד:</span>
          <Select
            value={itemsPerPage}
            onValueChange={(value) => {
              setItemsPerPage(value);
              setPageSize(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="בחר כמות" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100, 200].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <DateRangeFilter onDateRangeChange={onDateRangeChange} />
        </div>
        <div className="flex-1">
          <ScoreRangeFilter value={scoreRange} onChange={onScoreRangeChange} />
        </div>
      </div>
    </div>
  );
};