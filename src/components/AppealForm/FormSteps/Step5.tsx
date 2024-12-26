import React from 'react';
import { FormData } from '../types';

interface Step5Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step5: React.FC<Step5Props> = ({ formData, updateFormData }) => {
  const updateContentElements = (key: keyof FormData['contentElements'], value: boolean) => {
    updateFormData({
      contentElements: {
        ...formData.contentElements,
        [key]: value,
      },
    });
  };

  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">ממד התוכן</h2>
      
      <div className="form-group">
        <label className="form-label">אלמנטים שהיו במטלה</label>
        <div className="form-checkbox-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements.allParties}
              onChange={(e) => updateContentElements('allParties', e.target.checked)}
              className="ml-2"
            />
            אזכור כל הצדדים
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements.legislation}
              onChange={(e) => updateContentElements('legislation', e.target.checked)}
              className="ml-2"
            />
            הפניה לחקיקה
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements.caselaw}
              onChange={(e) => updateContentElements('caselaw', e.target.checked)}
              className="ml-2"
            />
            הפניה לפסיקה
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements.relevantFacts}
              onChange={(e) => updateContentElements('relevantFacts', e.target.checked)}
              className="ml-2"
            />
            ציון כל העובדות הרלוונטיות
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="missingElements" className="form-label">אלמנטים חסרים</label>
        <textarea
          id="missingElements"
          className="form-input min-h-[100px]"
          value={formData.missingElements}
          onChange={(e) => updateFormData({ missingElements: e.target.value })}
          placeholder="נא לציין אלמנטים חסרים במטלה"
        />
      </div>
    </div>
  );
};