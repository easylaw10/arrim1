import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';

export const useAppealSubmission = () => {
  const { toast } = useToast();

  const saveToDatabase = async (formData: FormData) => {
    try {
      // Check for existing appeal first using phone number
      const { data: existingAppeal, error: verificationError } = await supabase
        .from('exam_appeals')
        .select('*')
        .eq('phone', formData.phone)
        .maybeSingle();

      if (verificationError) throw verificationError;

      // If an appeal with this phone number already exists, show an error
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

      if (appealError) throw appealError;

      // Update verification code status
      await supabase
        .from('verification_codes')
        .update({ appeal_submitted: true })
        .eq('contact', formData.phone)
        .eq('verified', true);

      toast({
        title: "נשמר בהצלחה",
        description: "פרטי הערר נשמרו במערכת",
      });
      return true;
    } catch (error) {
      console.error('Error saving appeal:', error);
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