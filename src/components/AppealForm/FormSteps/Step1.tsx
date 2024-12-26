import React from 'react';
import { FormData } from '../types';

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step1: React.FC<Step1Props> = ({ formData, updateFormData }) => {
  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">פרטים בסיסיים</h2>
      
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">שם מלא</label>
        <input
          type="text"
          id="fullName"
          className="form-input"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="idNumber" className="form-label">מספר ת.ז.</label>
        <input
          type="text"
          id="idNumber"
          className="form-input"
          value={formData.idNumber}
          onChange={(e) => updateFormData({ idNumber: e.target.value })}
          required
          maxLength={9}
        />
      </div>

      <div className="form-group">
        <label htmlFor="examDate" className="form-label">תאריך הבחינה</label>
        <input
          type="date"
          id="examDate"
          className="form-input"
          value={formData.examDate}
          onChange={(e) => updateFormData({ examDate: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">מועד הבחינה</label>
        <div className="flex space-x-4 space-x-reverse">
          <label className="form-checkbox-label">
            <input
              type="radio"
              name="examSeason"
              value="winter"
              checked={formData.examSeason === 'winter'}
              onChange={(e) => updateFormData({ examSeason: 'winter' })}
              className="ml-2"
            />
            חורף
          </label>
          <label className="form-checkbox-label">
            <input
              type="radio"
              name="examSeason"
              value="summer"
              checked={formData.examSeason === 'summer'}
              onChange={(e) => updateFormData({ examSeason: 'summer' })}
              className="ml-2"
            />
            קיץ
          </label>
        </div>
      </div>
    </div>
  );
};