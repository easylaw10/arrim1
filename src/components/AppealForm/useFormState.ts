import { useState, useEffect } from 'react';
import { FormData, FormStep, initialFormData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

const FORM_DATA_COOKIE = 'appeal_form_data';
const CURRENT_STEP_COOKIE = 'appeal_form_step';
const COMPLETED_APPEAL_COOKIE = 'completed_appeal';

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = Cookies.get(FORM_DATA_COOKIE);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  const [currentStep, setCurrentStep] = useState<FormStep>(() => {
    const savedStep = Cookies.get(CURRENT_STEP_COOKIE);
    return savedStep ? Number(savedStep) as FormStep : 1;
  });

  const { toast } = useToast();

  useEffect(() => {
    Cookies.set(FORM_DATA_COOKIE, JSON.stringify(formData), { expires: 7 });
  }, [formData]);

  useEffect(() => {
    Cookies.set(CURRENT_STEP_COOKIE, String(currentStep), { expires: 7 });
  }, [currentStep]);

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

      // Save the completed appeal in cookies
      Cookies.set(COMPLETED_APPEAL_COOKIE, JSON.stringify(formData), { expires: 30 });

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
    if (!validatePersonalDetails()) {
      return;
    }

    if (!validateFinalScore()) {
      return;
    }

    if (!validateTotalScore()) {
      return;
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
      
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

  const hasCompletedAppeal = () => {
    return !!Cookies.get(COMPLETED_APPEAL_COOKIE);
  };

  const getCompletedAppeal = () => {
    const savedAppeal = Cookies.get(COMPLETED_APPEAL_COOKIE);
    return savedAppeal ? JSON.parse(savedAppeal) : null;
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