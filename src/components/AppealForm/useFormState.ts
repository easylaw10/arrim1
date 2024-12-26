import { useState } from 'react';
import { FormData, FormStep, initialFormData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const saveToDatabase = async () => {
    try {
      const { error } = await supabase.from('exam_appeals').insert({
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        language_score: formData.languageScore,
        organization_score: formData.organizationScore,
        content_score: formData.contentScore,
        final_score: formData.finalScore,
      });

      if (error) throw error;

      toast({
        title: "נשמר בהצלחה",
        description: "פרטי הערר נשמרו במערכת",
      });
    } catch (error) {
      console.error('Error saving appeal:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת הערר",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
      
      // Save to database when completing personal details step
      if (currentStep === 5) {
        saveToDatabase();
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  };

  return {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    previousStep,
  };
};