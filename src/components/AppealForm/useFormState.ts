import { useState } from 'react';
import { FormData, FormStep, initialFormData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAppealSubmission } from './hooks/useAppealSubmission';

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const { toast } = useToast();
  const { saveToDatabase, hasCompletedAppeal, getCompletedAppeal } = useAppealSubmission();

  const updateFormData = async (updates: Partial<FormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      if (updates.taskType !== undefined && updates.taskType !== prev.taskType) {
        fetchTemplateDetails(updates.taskType);
      }
      
      return newData;
    });
  };

  const fetchTemplateDetails = async (taskType: number) => {
    try {
      const { data, error } = await supabase
        .from('gpt_instructions')
        .select('task_name, rubric_link')
        .eq('task_type', taskType)
        .single();

      if (error) throw error;

      if (data) {
        setFormData(prev => ({
          ...prev,
          taskName: data.task_name || undefined,
          rubricLink: data.rubric_link || undefined,
        }));
      }
    } catch (error) {
      console.error('Error fetching template details:', error);
    }
  };

  const validatePersonalDetails = () => {
    if (currentStep === 5) {
      if (!formData.fullName || !formData.phone || !formData.email) {
        toast({
          title: "שגיאה",
          description: "יש למלא את כל שדות החובה",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const validateFinalScore = () => {
    if (currentStep === 1) {
      const score = formData.finalScore;
      if (!score || score < 25 || score > 80) {
        toast({
          title: "שגיאה",
          description: "ציון סופי לא תקין",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const validateTotalScore = () => {
    if (currentStep === 1) {
      const totalScore = formData.languageScore + formData.organizationScore + formData.contentScore;
      if (totalScore < 5) {
        toast({
          title: "שגיאה",
          description: "סכום הציונים של שלושת הממדים חייב להיות לפחות 5",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = async () => {
    if (!validatePersonalDetails()) {
      return;
    }

    if (!validateFinalScore()) {
      return;
    }

    if (!validateTotalScore()) {
      return;
    }

    if (currentStep < 7) {
      if (currentStep === 5) {
        const success = await saveToDatabase(formData);
        if (!success) return;
      }
      setCurrentStep((prev) => (prev + 1) as FormStep);
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
    hasCompletedAppeal,
    getCompletedAppeal,
  };
};