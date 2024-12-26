import React from 'react';
import { useFormState } from './useFormState';
import { ProgressBar } from './ProgressBar';
import { Step1 } from './FormSteps/Step1';
import { Step2 } from './FormSteps/Step2';
import { Step3 } from './FormSteps/Step3';
import { Step4 } from './FormSteps/Step4';
import { Step5 } from './FormSteps/Step5';
import { Step6 } from './FormSteps/Step6';
import { PhoneVerification } from './FormSteps/PhoneVerification';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText } from "lucide-react";

export const AppealForm = () => {
  const { 
    formData, 
    updateFormData, 
    currentStep, 
    nextStep, 
    previousStep,
    hasCompletedAppeal,
    getCompletedAppeal
  } = useFormState();

  const renderContent = () => {
    const completedAppeal = hasCompletedAppeal() ? getCompletedAppeal() : null;

    if (completedAppeal) {
      return (
        <div className="space-y-6">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>הערר שלך הוגש בהצלחה</AlertTitle>
            <AlertDescription>
              להלן פרטי הערר שהגשת. שים לב שלא ניתן לערוך את הערר לאחר הגשתו.
            </AlertDescription>
          </Alert>
          <Step6 formData={completedAppeal} updateFormData={() => {}} />
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => window.open('https://easylaw.io', '_blank')}
              className="gap-2 hover:scale-105 transition-transform"
            >
              <ExternalLink className="h-4 w-4" />
              עבור לאתר EasyLaw
            </Button>
          </div>
        </div>
      );
    }

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
        return (
          <PhoneVerification 
            formData={formData} 
            updateFormData={updateFormData}
            onBack={previousStep}
            onComplete={nextStep}
          />
        );
      case 7:
        return <Step6 formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  const showNavigation = !hasCompletedAppeal() && currentStep < 7 && currentStep !== 6;
  const showProgressBar = !hasCompletedAppeal();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="form-container py-4 sm:py-6 lg:py-8 animate-fade-in flex-grow">
        <div className="w-full">
          {showProgressBar && <ProgressBar currentStep={currentStep} />}
          <div className="form-section">
            {renderContent()}
            {showNavigation && (
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
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  הבא
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};