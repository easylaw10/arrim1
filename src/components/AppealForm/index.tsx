import React from 'react';
import { useFormState } from './useFormState';
import { ProgressBar } from './ProgressBar';
import { Step1 } from './FormSteps/Step1';
import { Step2 } from './FormSteps/Step2';
import { Step3 } from './FormSteps/Step3';
import { Step4 } from './FormSteps/Step4';
import { Step5 } from './FormSteps/Step5';
import { Step6 } from './FormSteps/Step6';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const AppealForm = () => {
  const { formData, updateFormData, currentStep, nextStep, previousStep } = useFormState();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step3 formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step4 formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step5 formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step2 formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <Step6 formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="form-container animate-fade-in">
      <div>
        <ProgressBar currentStep={currentStep} />
        <div className="form-section">
          {renderStep()}
          <div className="form-navigation">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                className="gap-2 hover:scale-105 transition-transform"
              >
                <ChevronRight className="h-4 w-4" />
                הקודם
              </Button>
            )}
            {currentStep < 6 && (
              <Button
                type="button"
                onClick={nextStep}
                className="gap-2 hover:scale-105 transition-transform"
              >
                הבא
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};