import React from 'react';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step1: React.FC<Step1Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">פרטים אישיים וציונים נוכחיים</h2>
      
      <div className="space-y-6">
        <div className="form-group">
          <Label htmlFor="fullName">שם מלא</Label>
          <Input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <Label htmlFor="idNumber">מספר ת.ז.</Label>
          <Input
            type="text"
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => updateFormData({ idNumber: e.target.value })}
            required
            maxLength={9}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};