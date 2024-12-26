import React from 'react';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface Step2Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step2: React.FC<Step2Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="form-title mb-6">
        <User className="h-6 w-6" />
        פרטים אישיים
      </h2>
      
      <div className="space-y-6 max-w-md mx-auto">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">שם מלא</label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            className="form-input"
            placeholder="הזן את שמך המלא"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">אימייל</label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="form-input"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>
    </div>
  );
};