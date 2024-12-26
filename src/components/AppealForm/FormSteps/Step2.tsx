import React from 'react';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step2Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step2: React.FC<Step2Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">פרטים אישיים</h2>
      
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
      </div>
    </div>
  );
};