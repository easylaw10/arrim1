import React, { useState } from 'react';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Step2Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const validatePhone = (phone: string): boolean => {
  // Israeli phone number validation
  const phoneRegex = /^05\d{8}$/;
  return phoneRegex.test(phone);
};

export const Step2: React.FC<Step2Props> = ({ formData, updateFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

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

      // Mark the verification as verified
      await supabase
        .from('verification_codes')
        .update({ verified: true })
        .eq('id', data.id);

      updateFormData({ phoneVerified: true });
      toast({
        title: "אומת בהצלחה",
        description: "מספר הטלפון אומת בהצלחה",
      });
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
      <h2 className="text-2xl font-bold mb-6">פרטים אישיים</h2>
      
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">שם מלא</label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">טלפון נייד</label>
        <div className="flex gap-2">
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="05XXXXXXXX"
            disabled={formData.phoneVerified}
            required
          />
          {!formData.phoneVerified && (
            <Button 
              onClick={sendVerificationCode}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              שלח קוד אימות
            </Button>
          )}
        </div>
      </div>

      {showVerification && !formData.phoneVerified && (
        <div className="form-group">
          <label htmlFor="verificationCode" className="form-label">קוד אימות</label>
          <div className="flex gap-2">
            <Input
              id="verificationCode"
              type="text"
              value={formData.verificationCode || ''}
              onChange={(e) => updateFormData({ verificationCode: e.target.value })}
              placeholder="הזן את הקוד שנשלח לטלפון שלך"
              required
            />
            <Button 
              onClick={verifyCode}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              אמת קוד
            </Button>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email" className="form-label">אימייל</label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          required
        />
      </div>
    </div>
  );
};