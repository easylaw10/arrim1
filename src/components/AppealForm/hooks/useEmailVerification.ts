import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useEmailVerification = () => {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const sendVerificationCode = async (phone: string) => {
    try {
      const { data: existingAppeal } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('contact', phone)
        .eq('verified', true)
        .eq('appeal_submitted', true)
        .single();

      if (existingAppeal) {
        toast({
          title: "שגיאה",
          description: "כבר הגשת ערר בעבר",
          variant: "destructive",
        });
        return false;
      }

      const response = await supabase.functions.invoke('send-verification', {
        body: { phone },
      });

      if (response.error) throw response.error;

      toast({
        title: "נשלח בהצלחה",
        description: "קוד אימות נשלח למספר הטלפון שלך",
      });
      return true;
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה בשליחת קוד האימות",
        variant: "destructive",
      });
      return false;
    }
  };

  const verifyCode = async (phone: string, code: string) => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('contact', phone)
        .eq('verification_code', code)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          title: "שגיאה",
          description: "קוד האימות שגוי או שפג תוקפו",
          variant: "destructive",
        });
        return false;
      }

      await supabase
        .from('verification_codes')
        .update({ verified: true })
        .eq('id', data.id);

      toast({
        title: "אומת בהצלחה",
        description: "מספר הטלפון אומת בהצלחה",
      });
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה באימות הקוד",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    isVerifying,
  };
};