import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { FormData } from '../types';
import Cookies from 'js-cookie';

const COMPLETED_APPEAL_COOKIE = 'completed_appeal';

export const useAppealSubmission = () => {
  const { toast } = useToast();

  const saveToDatabase = async (formData: FormData) => {
    try {
      const { data: existingVerification } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('email', formData.email)
        .eq('appeal_submitted', true)
        .single();

      if (existingVerification) {
        toast({
          title: "שגיאה",
          description: "כבר הגשת ערר בעבר",
          variant: "destructive",
        });
        return false;
      }

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

      await supabase
        .from('email_verifications')
        .update({ appeal_submitted: true })
        .eq('email', formData.email)
        .eq('verified', true);

      Cookies.set(COMPLETED_APPEAL_COOKIE, JSON.stringify(formData), { expires: 30 });

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
    return !!Cookies.get(COMPLETED_APPEAL_COOKIE);
  };

  const getCompletedAppeal = () => {
    const savedAppeal = Cookies.get(COMPLETED_APPEAL_COOKIE);
    return savedAppeal ? JSON.parse(savedAppeal) : null;
  };

  return {
    saveToDatabase,
    hasCompletedAppeal,
    getCompletedAppeal,
  };
};