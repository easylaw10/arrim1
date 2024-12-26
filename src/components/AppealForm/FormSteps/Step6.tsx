import React from 'react';
import { FormData } from '../types';

interface Step6Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step6: React.FC<Step6Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">ציון מבוקש</h2>
      
      <div className="form-group">
        <label htmlFor="requestedLanguageScore" className="form-label">ציון מבוקש בממד הלשון (0-4)</label>
        <input
          type="number"
          id="requestedLanguageScore"
          className="form-input"
          value={formData.requestedLanguageScore}
          onChange={(e) => updateFormData({ requestedLanguageScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
          min="0"
          max="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="requestedOrganizationScore" className="form-label">ציון מבוקש בממד הארגון (0-4)</label>
        <input
          type="number"
          id="requestedOrganizationScore"
          className="form-input"
          value={formData.requestedOrganizationScore}
          onChange={(e) => updateFormData({ requestedOrganizationScore: Math.min(4, Math.max(0, Number(e.target.value))) })}
          min="0"
          max="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="requestedContentScore" className="form-label">ציון מבוקש בממד התוכן (0-12)</label>
        <input
          type="number"
          id="requestedContentScore"
          className="form-input"
          value={formData.requestedContentScore}
          onChange={(e) => updateFormData({ requestedContentScore: Math.min(12, Math.max(0, Number(e.target.value))) })}
          min="0"
          max="12"
          required
        />
      </div>
    </div>
  );
};