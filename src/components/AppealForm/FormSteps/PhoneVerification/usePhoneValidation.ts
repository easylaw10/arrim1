import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePhoneValidation = () => {
  const { toast } = useToast();

  const validatePhone = async (phone: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('phone_verifications')
        .select('appeal_submitted')
        .eq('phone', phone)
        .maybeSingle();

      if (data?.appeal_submitted) {
        toast({
          title: "שגיאה",
          description: "מספר טלפון זה כבר הגיש ערר",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating phone:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בבדיקת מספר הטלפון",
        variant: "destructive",
      });
      return false;
    }
  };

  return { validatePhone };
};