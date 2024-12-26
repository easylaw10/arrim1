import React from 'react';
import { FormData } from '../types';

interface Step2Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step2: React.FC<Step2Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">ציונים נוכחיים</h2>
      
      <div className="form-group">
        <label htmlFor="currentLanguageScore" className="form-label">ציון בממד הלשון (0-4)</label>
        <input
          type="number"
          id="currentLanguageScore"
          className="form-input"
          value={formData.currentLanguageScore}
          onChange={(e) => updateFormData({ currentLanguageScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
          min="0"
          max="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="currentOrganizationScore" className="form-label">ציון בממד הארגון (0-4)</label>
        <input
          type="number"
          id="currentOrganizationScore"
          className="form-input"
          value={formData.currentOrganizationScore}
          onChange={(e) => updateFormData({ currentOrganizationScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
          min="0"
          max="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="currentContentScore" className="form-label">ציון בממד התוכן (0-12)</label>
        <input
          type="number"
          id="currentContentScore"
          className="form-input"
          value={formData.currentContentScore}
          onChange={(e) => updateFormData({ currentContentScore: Math.min(12, Math.max(0, Number(e.target.value))) })}
          min="0"
          max="12"
          required
        />
      </div>
    </div>
  );
};