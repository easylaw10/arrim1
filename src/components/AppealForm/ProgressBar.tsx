import React from 'react';
import { FormStep } from './types';
import { Check, Pen, FileText, Layout, BookText, User, FileCheck, ArrowLeft } from 'lucide-react';

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
      <div className="progress-steps-container">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.number}>
              <div
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
              
              {index < steps.length - 1 && (
                <ArrowLeft 
                  className={`step-arrow ${currentStep > step.number + 1 ? 'completed' : ''}`}
                  size={20}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};