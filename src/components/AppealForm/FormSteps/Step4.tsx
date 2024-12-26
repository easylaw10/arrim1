import React from 'react';
import { FormData } from '../types';
import { TaskHeader } from './TaskHeader';
import { Layout } from 'lucide-react';

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
      <TaskHeader title="ממד הארגון" formData={formData} />
      
      <div className="form-group">
        <label className="form-label">אלמנטים שהיו במטלה</label>
        <div className="form-checkbox-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements?.introduction}
              onChange={(e) => updateOrganizationElements('introduction', e.target.checked)}
              className="ml-2"
              required
            />
            מבוא
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements?.factPresentation}
              onChange={(e) => updateOrganizationElements('factPresentation', e.target.checked)}
              className="ml-2"
              required
            />
            הצגת העובדות
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements?.legalAnalysis}
              onChange={(e) => updateOrganizationElements('legalAnalysis', e.target.checked)}
              className="ml-2"
              required
            />
            ניתוח משפטי
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.organizationElements?.conclusion}
              onChange={(e) => updateOrganizationElements('conclusion', e.target.checked)}
              className="ml-2"
              required
            />
            סיכום
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="organizationExamples" className="form-label">דוגמאות ספציפיות (אופציונלי)</label>
        <textarea
          id="organizationExamples"
          className="form-input min-h-[100px]"
          value={formData.organizationExamples}
          onChange={(e) => updateFormData({ organizationExamples: e.target.value })}
          placeholder="יש לציין דוגמאות ספציפיות מהמטלה המראות ארגון נכון, למשל: כיצד הצגת את המבוא, איך ארגנת את העובדות, כיצד ערכת את הניתוח המשפטי, או איך סיכמת את הטיעונים"
        />
      </div>
    </div>
  );
};