import React from 'react';
import { FormData } from '../types';
import { TaskHeader } from './TaskHeader';
import { BookText } from 'lucide-react';

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
      <TaskHeader title="ממד התוכן" formData={formData} />
      
      <div className="form-group">
        <label className="form-label">אלמנטים שהיו במטלה</label>
        <div className="form-checkbox-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements?.allParties}
              onChange={(e) => updateContentElements('allParties', e.target.checked)}
              className="ml-2"
              required
            />
            אזכור כל הצדדים
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements?.legislation}
              onChange={(e) => updateContentElements('legislation', e.target.checked)}
              className="ml-2"
              required
            />
            הפניה לחקיקה
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements?.caselaw}
              onChange={(e) => updateContentElements('caselaw', e.target.checked)}
              className="ml-2"
              required
            />
            הפניה לפסיקה
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.contentElements?.relevantFacts}
              onChange={(e) => updateContentElements('relevantFacts', e.target.checked)}
              className="ml-2"
              required
            />
            ציון כל העובדות הרלוונטיות
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contentExamples" className="form-label">דוגמאות ספציפיות (אופציונלי)</label>
        <textarea
          id="contentExamples"
          className="form-input min-h-[100px]"
          value={formData.contentExamples}
          onChange={(e) => updateFormData({ contentExamples: e.target.value })}
          placeholder="יש לציין דוגמאות ספציפיות מהמטלה המראות שימוש נכון בתוכן, למשל: איזה סעיפי חוק ציטטת, אילו פסקי דין הבאת כתמיכה לטענותיך, אילו עובדות חשובות הדגשת, או כיצד קישרת בין העובדות לטענות המשפטיות"
        />
      </div>
    </div>
  );
};