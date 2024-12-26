import React from 'react';
import { FormStep } from './types';
import { Check, Pen, FileText, Layout, BookText, User, FileCheck, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProgressBarProps {
  currentStep: FormStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const isMobile = useIsMobile();
  
  const steps = [
    { number: 1, label: 'ציונים נוכחיים', icon: FileText },
    { number: 2, label: 'ממד הלשון', icon: Pen },
    { number: 3, label: 'ממד הארגון', icon: Layout },
    { number: 4, label: 'ממד התוכן', icon: BookText },
    { number: 5, label: 'פרטים אישיים', icon: User },
    { number: 6, label: 'אימות טלפון', icon: Phone },
    { number: 7, label: 'יצירת הערר', icon: FileCheck }
  ];

  return (
    <div className="progress-bar">
      <div className="flex justify-between items-center flex-wrap gap-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div
              key={step.number}
              className={`step-indicator ${
                isCompleted
                  ? 'completed'
                  : isCurrent
                  ? 'current'
                  : ''
              }`}
            >
              <div className="step-number">
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              {(!isMobile || isCurrent) && (
                <div className="step-label">{step.label}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};