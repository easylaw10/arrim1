import { Slider } from "@/components/ui/slider";

interface ScoreRangeFilterProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export const ScoreRangeFilter = ({ value, onChange }: ScoreRangeFilterProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">טווח ציונים סופיים</label>
        <span className="text-sm text-gray-500">
          {value[0]} - {value[1]}
        </span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={value}
        onValueChange={(newValue) => onChange(newValue as [number, number])}
        className="w-full"
      />
    </div>
  );
};