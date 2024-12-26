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
    { 
      number: 2, 
      label: 'דגשים לערר', 
      icon: Pen,
      subSteps: [
        { number: 2, label: 'ממד הלשון', icon: Pen },
        { number: 3, label: 'ממד הארגון', icon: Layout },
        { number: 4, label: 'ממד התוכן', icon: BookText }
      ]
    },
    { 
      number: 5, 
      label: 'פרטים אישיים', 
      icon: User, 
      subSteps: [
        { number: 5, label: 'פרטים אישיים', icon: User },
        { number: 6, label: 'אימות טלפון', icon: Phone }
      ]
    },
    { number: 7, label: 'יצירת הערר', icon: FileCheck }
  ];

  const getStepStatus = (stepNumber: number) => {
    if (currentStep > stepNumber) return 'completed';
    if (currentStep === stepNumber) return 'current';
    return '';
  };

  const getMainStepStatus = (step: any) => {
    if (step.subSteps) {
      const firstSubStep = step.subSteps[0].number;
      const lastSubStep = step.subSteps[step.subSteps.length - 1].number;
      
      if (currentStep > lastSubStep) return 'completed';
      if (currentStep >= firstSubStep && currentStep <= lastSubStep) return 'current';
      return '';
    }
    return getStepStatus(step.number);
  };

  return (
    <div className="progress-bar">
      <div className="flex justify-between items-center space-x-2 space-x-reverse">
        {steps.map((step) => {
          const Icon = step.icon;
          const status = getMainStepStatus(step);
          
          return (
            <div 
              key={step.number} 
              className={`step-indicator ${status}`}
            >
              <div className="step-number">
                {status === 'completed' ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <Icon className="h-3 w-3" />
                )}
              </div>
              {(!isMobile || status === 'current') && (
                <div className="step-label text-[10px]">{step.label}</div>
              )}
              
              {/* Render sub-steps indicators if they exist and are current */}
              {step.subSteps && (currentStep >= step.subSteps[0].number && currentStep <= step.subSteps[step.subSteps.length - 1].number) && (
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
        })}
      </div>
    </div>
  );
};