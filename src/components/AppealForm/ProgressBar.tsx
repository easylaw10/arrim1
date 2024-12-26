import React from 'react';
import { FormStep } from './types';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: FormStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'ציונים נוכחיים' },
    { number: 2, label: 'ממד הלשון' },
    { number: 3, label: 'ממד הארגון' },
    { number: 4, label: 'ממד התוכן' },
    { number: 5, label: 'פרטים אישיים' },
    { number: 6, label: 'יצירת הערר' }
  ];

  return (
    <div className="progress-bar">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`step-indicator ${
              currentStep > step.number
                ? 'completed'
                : currentStep === step.number
                ? 'current'
                : ''
            }`}
          >
            <div className="step-number">
              {currentStep > step.number ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : (
                step.number
              )}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};