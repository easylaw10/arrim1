import React from 'react';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step1: React.FC<Step1Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="form-title">
        <FileText className="h-6 w-6" />
        ציוני הבחינה הקודמת
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <Label htmlFor="languageScore">ציון בממד הלשון (0-4)</Label>
            <Input
              type="number"
              id="languageScore"
              value={formData.languageScore}
              onChange={(e) => updateFormData({ languageScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="4"
              required
              className="text-lg"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="organizationScore">ציון בממד הארגון (0-4)</Label>
            <Input
              type="number"
              id="organizationScore"
              value={formData.organizationScore}
              onChange={(e) => updateFormData({ organizationScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="4"
              required
              className="text-lg"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="contentScore">ציון בממד התוכן (0-12)</Label>
            <Input
              type="number"
              id="contentScore"
              value={formData.contentScore}
              onChange={(e) => updateFormData({ contentScore: Math.min(12, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="12"
              required
              className="text-lg"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="finalScore">ציון סופי בבחינה</Label>
            <Input
              type="number"
              id="finalScore"
              value={formData.finalScore}
              onChange={(e) => updateFormData({ finalScore: Math.min(100, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="100"
              required
              className="text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};