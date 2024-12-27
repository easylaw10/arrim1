import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';

export const useAppealSubmission = () => {
  const { toast } = useToast();

  const saveToDatabase = async (formData: FormData) => {
    try {
      // First validate required fields
      if (!formData.fullName?.trim()) {
        toast({
          title: "שגיאה",
          description: "יש להזין שם מלא",
          variant: "destructive",
        });
        return false;
      }

      if (!formData.email?.trim()) {
        toast({
          title: "שגיאה",
          description: "יש להזין כתובת אימייל",
          variant: "destructive",
        });
        return false;
      }

      // Insert the appeal data
      const { error: appealError } = await supabase
        .from('exam_appeals')
        .insert({
          full_name: formData.fullName,
          phone: formData.phone || '',
          email: formData.email,
          language_score: formData.languageScore,
          organization_score: formData.organizationScore,
          content_score: formData.contentScore,
          final_score: formData.finalScore,
        });

      if (appealError) {
        console.error('Error saving appeal:', appealError);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בשמירת הערר",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "נשמר בהצלחה",
        description: "פרטי הערר נשמרו במערכת",
      });
      return true;
    } catch (error) {
      console.error('Error in saveToDatabase:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת הערר",
        variant: "destructive",
      });
      return false;
    }
  };

  const hasCompletedAppeal = () => {
    return false;
  };

  const getCompletedAppeal = () => {
    return null;
  };

  return {
    saveToDatabase,
    hasCompletedAppeal,
    getCompletedAppeal,
  };
};