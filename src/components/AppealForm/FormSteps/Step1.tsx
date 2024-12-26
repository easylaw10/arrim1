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
            <Label htmlFor="currentLanguageScore">ציון בממד הלשון (0-4)</Label>
            <Input
              type="number"
              id="currentLanguageScore"
              value={formData.currentLanguageScore}
              onChange={(e) => updateFormData({ currentLanguageScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="4"
              required
              className="text-lg"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="currentOrganizationScore">ציון בממד הארגון (0-4)</Label>
            <Input
              type="number"
              id="currentOrganizationScore"
              value={formData.currentOrganizationScore}
              onChange={(e) => updateFormData({ currentOrganizationScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="4"
              required
              className="text-lg"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="currentContentScore">ציון בממד התוכן (0-12)</Label>
            <Input
              type="number"
              id="currentContentScore"
              value={formData.currentContentScore}
              onChange={(e) => updateFormData({ currentContentScore: Math.min(12, Math.max(0, Number(e.target.value))) })}
              min="0"
              max="12"
              required
              className="text-lg"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="finalExamScore">ציון סופי בבחינה</Label>
            <Input
              type="number"
              id="finalExamScore"
              value={formData.finalExamScore}
              onChange={(e) => updateFormData({ finalExamScore: Math.min(100, Math.max(0, Number(e.target.value))) })}
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