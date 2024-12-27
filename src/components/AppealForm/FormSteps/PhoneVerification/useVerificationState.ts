import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { verificationCache } from './verificationCache';
import { handleDatabaseError } from './utils/errorHandling';
import { cleanupOldCodes, verifyCode } from './utils/databaseOperations';

export const useVerificationState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

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
      await cleanupOldCodes(phone);

      const { error } = await supabase.functions.invoke('send-verification', {
        body: { phone },
      });

      if (error) throw error;

      toast({
        title: "נשלח בהצלחה",
        description: "קוד אימות נשלח למספר הטלפון שלך",
      });
      setShowVerification(true);
      return true;
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      const errorMessage = handleDatabaseError(error);
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validateCode = async (phone: string, code: string) => {
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
      const data = await verifyCode(phone, code);
      
      if (!data) {
        toast({
          title: "שגיאה",
          description: "קוד האימות שגוי או שפג תוקפו",
          variant: "destructive",
        });
        return false;
      }

      // Add verified phone to phone_verifications table
      const { error: insertError } = await supabase
        .from('phone_verifications')
        .upsert({ 
          phone,
          appeal_submitted: false
        });

      if (insertError) throw insertError;

      verificationCache.addVerifiedPhone(phone);
      toast({
        title: "אומת בהצלחה",
        description: "מספר הטלפון אומת בהצלחה",
      });
      return true;
    } catch (error: any) {
      console.error('Error verifying code:', error);
      const errorMessage = handleDatabaseError(error);
      toast({
        title: "שגיאה",
        description: errorMessage,
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
    verifyCode: validateCode,
  };
};