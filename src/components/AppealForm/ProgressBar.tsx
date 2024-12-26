import React from 'react';
import { FormStep } from './types';
import { Check, Pen, FileText, Layout, BookText, User, FileCheck } from 'lucide-react';

interface ProgressBarProps {
  currentStep: FormStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'ציונים נוכחיים', icon: FileText },
    { number: 2, label: 'ממד הלשון', icon: Pen },
    { number: 3, label: 'ממד הארגון', icon: Layout },
    { number: 4, label: 'ממד התוכן', icon: BookText },
    { number: 5, label: 'פרטים אישיים', icon: User },
    { number: 6, label: 'יצירת הערר', icon: FileCheck }
  ];

  return (
    <div className="progress-bar">
      <div className="flex justify-between items-center">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
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
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
};