import React, { useState } from 'react';
import { FormData } from '../../types';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PhoneInput } from './PhoneInput';
import { VerificationInput } from './VerificationInput';

interface PhoneVerificationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onBack: () => void;
  onComplete: () => void;
}

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^05\d{8}$/;
  return phoneRegex.test(phone);
};

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  formData, 
  updateFormData, 
  onBack,
  onComplete 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const checkExistingVerification = async (phone: string) => {
    const { data: existingVerification } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('contact', phone)
      .eq('verified', true)
      .eq('appeal_submitted', true)
      .maybeSingle();

    return existingVerification;
  };

  const sendVerificationCode = async () => {
    if (!formData.phone) {
      toast({
        title: "שגיאה",
        description: "נא להזין מספר טלפון",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "שגיאה",
        description: "מספר הטלפון אינו תקין. יש להזין מספר טלפון ישראלי תקין",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // בדיקה אם כבר קיים ערר למספר הטלפון הזה
      const existingVerification = await checkExistingVerification(formData.phone);
      
      if (existingVerification) {
        toast({
          title: "שגיאה",
          description: "מספר טלפון זה כבר אומת בעבר והוגש עבורו ערר. ניתן להגיש ערר אחד בלבד.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-verification', {
        body: { phone: formData.phone },
      });

      if (error) throw error;

      toast({
        title: "נשלח בהצלחה",
        description: "קוד אימות נשלח למספר הטלפון שלך",
      });
      setShowVerification(true);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה בשליחת קוד האימות",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!formData.verificationCode) {
      toast({
        title: "שגיאה",
        description: "נא להזין את קוד האימות",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // בדיקה נוספת לפני האימות
      const existingVerification = await checkExistingVerification(formData.phone);
      
      if (existingVerification) {
        toast({
          title: "שגיאה",
          description: "מספר טלפון זה כבר אומת בעבר והוגש עבורו ערר. ניתן להגיש ערר אחד בלבד.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('contact', formData.phone)
        .eq('verification_code', formData.verificationCode)
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

      updateFormData({ phoneVerified: true });
      toast({
        title: "אומת בהצלחה",
        description: "מספר הטלפון אומת בהצלחה",
      });
      onComplete();
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "אירעה שגיאה באימות הקוד",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-step">
      <h2 className="form-title mb-6">
        <Shield className="h-6 w-6" />
        אימות מספר טלפון
      </h2>
      
      <div className="space-y-6 max-w-md mx-auto">
        <PhoneInput
          phone={formData.phone}
          isVerified={!!formData.phoneVerified}
          isLoading={isLoading}
          onSendCode={sendVerificationCode}
          onChange={(phone) => updateFormData({ phone })}
          showVerification={showVerification}
        />

        {showVerification && !formData.phoneVerified && (
          <div className="form-group animate-fade-in">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                קוד אימות נשלח למספר {formData.phone}. הקוד תקף ל-10 דקות.
              </AlertDescription>
            </Alert>
            <VerificationInput
              verificationCode={formData.verificationCode}
              isLoading={isLoading}
              onVerify={verifyCode}
              onChange={(code) => updateFormData({ verificationCode: code })}
            />
          </div>
        )}

        <div className="flex justify-start mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            חזור
          </Button>
        </div>
      </div>
    </div>
  );
};