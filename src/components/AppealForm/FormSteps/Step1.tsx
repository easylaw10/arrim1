import React from 'react';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { TaskHeader } from './TaskHeader';

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step1: React.FC<Step1Props> = ({ formData, updateFormData }) => {
  const scoreOptions = [0, 1, 2, 3, 4];
  const contentScoreOptions = Array.from({ length: 13 }, (_, i) => i);

  return (
    <div className="form-step">
      <TaskHeader title="ציוני הבחינה" formData={formData} />
      
      {formData.taskType && (
        <div className="bg-amber-50 p-4 rounded-lg mb-8 text-amber-800 text-sm">
          ניתן להגיש ערר פעם אחת בלבד
        </div>
      )}
      
      <div className="space-y-10">
        <div className="space-y-4">
          <Label htmlFor="contentScore" className="text-lg font-medium text-gray-900">
            ציון במדד התוכן
          </Label>
          <ToggleGroup
            type="single"
            value={formData.contentScore.toString()}
            onValueChange={(value) => updateFormData({ contentScore: Number(value) })}
            className="flex flex-wrap gap-2 justify-start"
          >
            {contentScoreOptions.map((score) => (
              <ToggleGroupItem
                key={score}
                value={score.toString()}
                className={cn(
                  "h-12 w-12 text-base font-medium rounded-full shadow-sm hover:shadow hover:bg-primary/90 hover:text-primary-foreground transition-all duration-200",
                  formData.contentScore === score ? "bg-primary text-primary-foreground ring-2 ring-primary/20" : "bg-white border border-gray-200"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-4">
          <Label htmlFor="organizationScore" className="text-lg font-medium text-gray-900">
            ציון במדד הארגון
          </Label>
          <ToggleGroup
            type="single"
            value={formData.organizationScore.toString()}
            onValueChange={(value) => updateFormData({ organizationScore: Number(value) })}
            className="flex flex-wrap gap-2 justify-start"
          >
            {scoreOptions.map((score) => (
              <ToggleGroupItem
                key={score}
                value={score.toString()}
                className={cn(
                  "h-12 w-12 text-base font-medium rounded-full shadow-sm hover:shadow hover:bg-primary/90 hover:text-primary-foreground transition-all duration-200",
                  formData.organizationScore === score ? "bg-primary text-primary-foreground ring-2 ring-primary/20" : "bg-white border border-gray-200"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-4">
          <Label htmlFor="languageScore" className="text-lg font-medium text-gray-900">
            ציון במדד הלשון
          </Label>
          <ToggleGroup
            type="single"
            value={formData.languageScore.toString()}
            onValueChange={(value) => updateFormData({ languageScore: Number(value) })}
            className="flex flex-wrap gap-2 justify-start"
          >
            {scoreOptions.map((score) => (
              <ToggleGroupItem
                key={score}
                value={score.toString()}
                className={cn(
                  "h-12 w-12 text-base font-medium rounded-full shadow-sm hover:shadow hover:bg-primary/90 hover:text-primary-foreground transition-all duration-200",
                  formData.languageScore === score ? "bg-primary text-primary-foreground ring-2 ring-primary/20" : "bg-white border border-gray-200"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <Label htmlFor="finalScore" className="text-lg font-medium text-gray-900">
            ציון סופי בבחינה
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              id="finalScore"
              value={formData.finalScore}
              onChange={(e) => updateFormData({ finalScore: Math.min(100, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="100"
              required
              className="w-24 h-12 text-center text-lg font-medium bg-white hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:shadow"
              placeholder="0-100"
            />
            <span className="text-sm text-gray-500">מתוך 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};