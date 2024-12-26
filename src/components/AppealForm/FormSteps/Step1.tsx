import React from 'react';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step1: React.FC<Step1Props> = ({ formData, updateFormData }) => {
  const scoreOptions = [0, 1, 2, 3, 4];
  const contentScoreOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="form-step">
      <h2 className="form-title flex items-center gap-2 text-2xl font-bold mb-8">
        <FileText className="h-6 w-6" />
        ציוני הבחינה הקודמת
      </h2>
      
      <div className="space-y-10">
        <div className="space-y-6">
          <Label htmlFor="languageScore" className="text-lg font-semibold">
            ציון בממד הלשון (0-4)
          </Label>
          <ToggleGroup
            type="single"
            value={formData.languageScore.toString()}
            onValueChange={(value) => updateFormData({ languageScore: Number(value) })}
            className="flex flex-wrap gap-3 justify-center"
          >
            {scoreOptions.map((score) => (
              <ToggleGroupItem
                key={score}
                value={score.toString()}
                className={cn(
                  "h-14 w-14 text-xl font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-primary/90 hover:text-primary-foreground transition-all duration-300 hover:scale-110 border-2 border-gray-100",
                  formData.languageScore === score && "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 border-none"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-6">
          <Label htmlFor="organizationScore" className="text-lg font-semibold">
            ציון בממד הארגון (0-4)
          </Label>
          <ToggleGroup
            type="single"
            value={formData.organizationScore.toString()}
            onValueChange={(value) => updateFormData({ organizationScore: Number(value) })}
            className="flex flex-wrap gap-3 justify-center"
          >
            {scoreOptions.map((score) => (
              <ToggleGroupItem
                key={score}
                value={score.toString()}
                className={cn(
                  "h-14 w-14 text-xl font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-primary/90 hover:text-primary-foreground transition-all duration-300 hover:scale-110 border-2 border-gray-100",
                  formData.organizationScore === score && "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 border-none"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-6">
          <Label htmlFor="contentScore" className="text-lg font-semibold">
            ציון בממד התוכן (0-12)
          </Label>
          <ToggleGroup
            type="single"
            value={formData.contentScore.toString()}
            onValueChange={(value) => updateFormData({ contentScore: Number(value) })}
            className="flex flex-wrap gap-3 justify-center"
          >
            {contentScoreOptions.map((score) => (
              <ToggleGroupItem
                key={score}
                value={score.toString()}
                className={cn(
                  "h-14 w-14 text-xl font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-primary/90 hover:text-primary-foreground transition-all duration-300 hover:scale-110 border-2 border-gray-100",
                  formData.contentScore === score && "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 border-none"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-6">
          <Label htmlFor="finalScore" className="text-lg font-semibold">
            ציון סופי בבחינה
          </Label>
          <Input
            type="number"
            id="finalScore"
            value={formData.finalScore}
            onChange={(e) => updateFormData({ finalScore: Math.min(100, Math.max(0, Number(e.target.value))) })}
            min="0"
            max="100"
            required
            className="text-3xl h-20 text-center font-bold bg-secondary/50 hover:bg-secondary transition-colors duration-300 focus:ring-4 focus:ring-primary/20 rounded-xl shadow-sm hover:shadow-md"
            placeholder="הכנס ציון סופי"
          />
        </div>
      </div>
    </div>
  );
};