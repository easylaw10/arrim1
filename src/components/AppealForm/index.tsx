import React from 'react';
import { useFormState } from './useFormState';
import { ProgressBar } from './ProgressBar';
import { Step1 } from './FormSteps/Step1';
import { Step2 } from './FormSteps/Step2';
import { Step3 } from './FormSteps/Step3';
import { Step4 } from './FormSteps/Step4';
import { Step5 } from './FormSteps/Step5';
import { Step6 } from './FormSteps/Step6';
import { Step7 } from './FormSteps/Step7';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const AppealForm = () => {
  const { formData, updateFormData, currentStep, nextStep, previousStep } = useFormState();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הטופס נשלח בהצלחה",
      description: "פרטי הערר נשמרו במערכת",
    });
    // Here you would typically send the data to a server
    console.log('Form submitted:', formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2 formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3 formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4 formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5 formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <Step6 formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <Step7 formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="form-container bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit}>
        <ProgressBar currentStep={currentStep} />
        {renderStep()}
        <div className="form-navigation">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
            >
              הקודם
            </Button>
          )}
          {currentStep < 7 ? (
            <Button
              type="button"
              onClick={nextStep}
            >
              הבא
            </Button>
          ) : (
            <Button type="submit">
              שלח ערר
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};