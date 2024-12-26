import React from 'react';
import { FormStep } from './types';
import { Check, Pen, FileText, User, FileCheck, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProgressBarProps {
  currentStep: FormStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const isMobile = useIsMobile();
  
  const steps = [
    { number: 1, label: 'ציונים נוכחיים', icon: FileText },
    { number: 2, label: 'דגשים לערר', icon: Pen },
    { number: 3, label: 'פרטים אישיים', icon: User, subSteps: [
      { number: 3, label: 'פרטים אישיים', icon: User },
      { number: 4, label: 'אימות טלפון', icon: Phone }
    ]},
    { number: 5, label: 'יצירת הערר', icon: FileCheck }
  ];

  const getStepStatus = (stepNumber: number) => {
    if (currentStep > stepNumber) return 'completed';
    if (currentStep === stepNumber) return 'current';
    return '';
  };

  return (
    <div className="progress-bar">
      <div className="flex justify-between items-center flex-wrap gap-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          // If step has subSteps (like personal details with phone verification)
          if (step.subSteps) {
            return (
              <div 
                key={step.number} 
                className={`step-indicator ${getStepStatus(step.number)}`}
              >
                <div className="step-number">
                  {getStepStatus(step.number) === 'completed' ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                {(!isMobile || getStepStatus(step.number) === 'current') && (
                  <div className="step-label">{step.label}</div>
                )}
                
                {/* Render sub-steps visually */}
                {currentStep >= 3 && currentStep <= 4 && (
                  <div className="flex justify-center mt-2 space-x-2 space-x-reverse">
                    {step.subSteps.map((subStep) => (
                      <div 
                        key={subStep.number} 
                        className={`h-1 w-4 rounded-full ${
                          currentStep >= subStep.number ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }
          
          // Regular steps without sub-steps
          return (
            <div
              key={step.number}
              className={`step-indicator ${getStepStatus(step.number)}`}
            >
              <div className="step-number">
                {getStepStatus(step.number) === 'completed' ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              {(!isMobile || getStepStatus(step.number) === 'current') && (
                <div className="step-label">{step.label}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};