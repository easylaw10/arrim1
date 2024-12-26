import React from 'react';
import { FormData } from '../types';

interface Step4Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step4: React.FC<Step4Props> = ({ formData, updateFormData }) => {
  const updateOrganizationElements = (key: keyof FormData['organizationElements'], value: boolean) => {
    updateFormData({
      organizationElements: {
        ...formData.organizationElements,
        [key]: value,
      },
    });
  };

  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">ממד הארגון</h2>
      
      <div className="form-group">
        <label className="form-label">אלמנטים שהיו במטלה</label>
        <div className="form-checkbox-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements.introduction}
              onChange={(e) => updateOrganizationElements('introduction', e.target.checked)}
              className="ml-2"
            />
            מבוא מסודר
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements.factPresentation}
              onChange={(e) => updateOrganizationElements('factPresentation', e.target.checked)}
              className="ml-2"
            />
            הצגת עובדות
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements.legalAnalysis}
              onChange={(e) => updateOrganizationElements('legalAnalysis', e.target.checked)}
              className="ml-2"
            />
            ניתוח משפטי
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements.conclusion}
              onChange={(e) => updateOrganizationElements('conclusion', e.target.checked)}
              className="ml-2"
            />
            סיכום
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="organizationExamples" className="form-label">דוגמאות לארגון טוב</label>
        <textarea
          id="organizationExamples"
          className="form-input min-h-[100px]"
          value={formData.organizationExamples}
          onChange={(e) => updateFormData({ organizationExamples: e.target.value })}
          placeholder="נא לציין דוגמאות לארגון טוב מהמטלה"
        />
      </div>
    </div>
  );
};