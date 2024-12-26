import { useState } from 'react';
import { FormData, FormStep, initialFormData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const { toast } = useToast();

  const updateFormData = async (updates: Partial<FormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // If taskType is being updated, fetch the template details
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
    if (!validatePersonalDetails()) {
      return;
    }

    if (!validateFinalScore()) {
      return;
    }

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