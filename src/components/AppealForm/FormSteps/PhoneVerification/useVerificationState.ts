import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVerificationState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const checkExistingAppeal = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_appeals')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();

      if (error) {
        console.error('Error checking for existing appeal:', error);
        return false;
      }

      if (data) {
        toast({
          title: "שגיאה",
          description: "כבר הגשת ערר בעבר עבור מספר טלפון זה",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in checkExistingAppeal:', error);
      return false;
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
        let errorMessage = "אירעה שגיאה בשליחת קוד האימות";
        
        try {
          if (typeof error.message === 'string') {
            const errorResponse = JSON.parse(error.message);
            if (errorResponse.body) {
              const bodyError = JSON.parse(errorResponse.body);
              if (bodyError.error) {
                errorMessage = bodyError.error;
              }
            }
          }
        } catch (e) {
          console.error('Error parsing error message:', e);
          console.error('Original error:', error);
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

    // בדיקת מספר טלפון קיים רק בשלב האחרון של אימות הקוד
    const canProceed = await checkExistingAppeal(phone);
    if (!canProceed) {
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('contact', phone)
        .eq('verification_code', code)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) {
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה באימות הקוד",
          variant: "destructive",
        });
        return false;
      }

      if (!data) {
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
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showVerification,
    setShowVerification,
    sendVerificationCode,
    verifyCode,
  };
};