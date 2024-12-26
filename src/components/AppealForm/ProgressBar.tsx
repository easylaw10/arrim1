import React from 'react';
import { FormStep } from './types';

interface ProgressBarProps {
  currentStep: FormStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    'ציונים נוכחיים',
    'ממד הלשון',
    'ממד הארגון',
    'ממד התוכן',
    'פרטים אישיים',
    'יצירת הערר'
  ];

  return (
    <div className="progress-bar mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator ${
              currentStep > index + 1
                ? 'completed'
                : currentStep === index + 1
                ? 'current'
                : ''
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};