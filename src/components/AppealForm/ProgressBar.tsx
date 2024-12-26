import React from 'react';
import { FormStep } from './types';
import { Check } from 'lucide-react';

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
    <div className="progress-bar">
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
            <div className="step-number">
              {currentStep > index + 1 ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};