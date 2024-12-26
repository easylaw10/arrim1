import React from 'react';
import { FormData } from '../types';

interface Step7Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step7: React.FC<Step7Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">הערות אישיות</h2>
      
      <div className="form-group">
        <label htmlFor="additionalNotes" className="form-label">הערות נוספות</label>
        <textarea
          id="additionalNotes"
          className="form-input min-h-[200px]"
          value={formData.additionalNotes}
          onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
          placeholder="נא להוסיף הערות נוספות שיכולות לתמוך בערר"
        />
      </div>
    </div>
  );
};