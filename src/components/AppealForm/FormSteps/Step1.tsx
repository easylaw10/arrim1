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
      <h2 className="form-title">
        <FileText className="h-6 w-6" />
        ציוני הבחינה
      </h2>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="languageScore" className="text-base font-medium">
            ציון בממד הלשון
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
                  "h-9 w-9 text-sm font-medium rounded-md shadow-sm hover:shadow hover:bg-primary/90 hover:text-primary-foreground transition-all duration-200 hover:scale-105 border border-gray-200",
                  formData.languageScore === score && "bg-primary text-primary-foreground ring-2 ring-primary/20 scale-105 border-none"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-4">
          <Label htmlFor="organizationScore" className="text-base font-medium">
            ציון בממד הארגון
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
                  "h-9 w-9 text-sm font-medium rounded-md shadow-sm hover:shadow hover:bg-primary/90 hover:text-primary-foreground transition-all duration-200 hover:scale-105 border border-gray-200",
                  formData.organizationScore === score && "bg-primary text-primary-foreground ring-2 ring-primary/20 scale-105 border-none"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-4">
          <Label htmlFor="contentScore" className="text-base font-medium">
            ציון בממד התוכן
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
                  "h-9 w-9 text-sm font-medium rounded-md shadow-sm hover:shadow hover:bg-primary/90 hover:text-primary-foreground transition-all duration-200 hover:scale-105 border border-gray-200",
                  formData.contentScore === score && "bg-primary text-primary-foreground ring-2 ring-primary/20 scale-105 border-none"
                )}
              >
                {score}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-4">
          <Label htmlFor="finalScore" className="text-base font-medium after:content-['*'] after:text-red-500 after:mr-1">
            ציון סופי בבחינה
          </Label>
          <Input
            type="number"
            id="finalScore"
            value={formData.finalScore || ''}
            onChange={(e) => updateFormData({ finalScore: Number(e.target.value) })}
            required
            className="w-24 h-10 text-center font-medium bg-secondary/50 hover:bg-secondary transition-colors duration-200 focus:ring-2 focus:ring-primary/20 rounded-md shadow-sm hover:shadow"
            placeholder="הזן ציון"
          />
        </div>
      </div>
    </div>
  );
};
