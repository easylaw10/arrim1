import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVerificationState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const checkPreviousVerification = async (phone: string) => {
    try {
      const { data: existingVerification } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('contact', phone)
        .eq('verified', true)
        .eq('appeal_submitted', true)
        .maybeSingle();

      return existingVerification;
    } catch (error) {
      console.error('Error checking previous verification:', error);
      return null;
    }
  };

  const sendVerificationCode = async (phone: string) => {
    if (!phone) {
      toast({
        title: "שגיאה",
        description: "נא להזין מספר טלפון",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "שגיאה",
        description: "מספר הטלפון אינו תקין. יש להזין מספר טלפון ישראלי תקין",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-verification', {
        body: { phone },
      });

      if (error) {
        // Parse the error message from the response
        let errorMessage = "אירעה שגיאה בשליחת קוד האימות";
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.error) {
            errorMessage = parsedError.error;
          }
        } catch {
          // If parsing fails, use the original error message
          errorMessage = error.message;
        }

        toast({
          title: "שגיאה",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "נשלח בהצלחה",
        description: "קוד אימות נשלח למספר הטלפון שלך",
      });
      setShowVerification(true);
      return true;
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה בשליחת קוד האימות",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (phone: string, code: string) => {
    if (!code) {
      toast({
        title: "שגיאה",
        description: "נא להזין את קוד האימות",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // First, unverify any existing verified records for this phone number
      await supabase
        .from('verification_codes')
        .update({ verified: false })
        .eq('contact', phone)
        .eq('verified', true);

      // Now verify the new code
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('contact', phone)
        .eq('verification_code', code)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        throw new Error("קוד האימות שגוי או שפג תוקפו");
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
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה באימות הקוד",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showVerification,
    setShowVerification,
    sendVerificationCode,
    verifyCode,
    checkPreviousVerification
  };
};