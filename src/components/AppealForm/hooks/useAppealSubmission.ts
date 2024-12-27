import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';

export const useAppealSubmission = () => {
  const { toast } = useToast();

  const saveToDatabase = async (formData: FormData) => {
    try {
      // First check if there's an existing appeal with this phone number
      const { data: existingAppeal, error: checkError } = await supabase
        .from('exam_appeals')
        .select('id')
        .eq('phone', formData.phone)
        .limit(1)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking for existing appeal:', checkError);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בבדיקת הערר",
          variant: "destructive",
        });
        return false;
      }

      if (existingAppeal) {
        toast({
          title: "שגיאה",
          description: "כבר הגשת ערר בעבר עבור מספר טלפון זה",
          variant: "destructive",
        });
        return false;
      }

      // If no existing appeal, proceed with insertion
      const { error: appealError } = await supabase
        .from('exam_appeals')
        .insert({
          full_name: formData.fullName,
          phone: formData.phone,
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

      // Update verification code status
      const { error: verificationError } = await supabase
        .from('verification_codes')
        .update({ appeal_submitted: true })
        .eq('contact', formData.phone)
        .eq('verified', true);

      if (verificationError) {
        console.error('Error updating verification status:', verificationError);
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