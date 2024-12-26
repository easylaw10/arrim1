import React from 'react';
import { FormData } from '../types';

interface Step3Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step3: React.FC<Step3Props> = ({ formData, updateFormData }) => {
  const updateLanguageElements = (key: keyof FormData['languageElements'], value: boolean) => {
    updateFormData({
      languageElements: {
        ...formData.languageElements,
        [key]: value,
      },
    });
  };

  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">ממד הלשון</h2>
      
      <div className="form-group">
        <label className="form-label">אלמנטים שהיו במטלה</label>
        <div className="form-checkbox-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.languageElements.legalTerms}
              onChange={(e) => updateLanguageElements('legalTerms', e.target.checked)}
              className="ml-2"
            />
            שימוש במונחים משפטיים
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.languageElements.termConsistency}
              onChange={(e) => updateLanguageElements('termConsistency', e.target.checked)}
              className="ml-2"
            />
            עקביות במונחים
          </label>
          
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.languageElements.grammarSyntax}
              onChange={(e) => updateLanguageElements('grammarSyntax', e.target.checked)}
              className="ml-2"
            />
            שמירה על כללי דקדוק ותחביר
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="languageExamples" className="form-label">דוגמאות ספציפיות</label>
        <textarea
          id="languageExamples"
          className="form-input min-h-[100px]"
          value={formData.languageExamples}
          onChange={(e) => updateFormData({ languageExamples: e.target.value })}
          placeholder="נא לציין דוגמאות ספציפיות מהמטלה"
        />
      </div>
    </div>
  );
};