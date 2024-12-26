import React from 'react';
import { FormStep } from './types';

interface ProgressBarProps {
  currentStep: FormStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const progress = ((currentStep - 1) / 5) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-primary font-medium">שלב {currentStep} מתוך 6</span>
        <span className="text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};