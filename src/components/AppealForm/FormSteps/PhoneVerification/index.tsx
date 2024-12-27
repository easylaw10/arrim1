import React from 'react';
import { FormData } from '../../types';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PhoneInput } from './PhoneInput';
import { VerificationInput } from './VerificationInput';
import { useVerificationState } from './useVerificationState';
import { Button } from '@/components/ui/button';

interface PhoneVerificationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onBack: () => void;
  onComplete: () => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  formData, 
  updateFormData, 
  onBack,
  onComplete 
}) => {
  const {
    isLoading,
    showVerification,
    sendVerificationCode,
    verifyCode
  } = useVerificationState();

  const handleSendCode = async () => {
    const success = await sendVerificationCode(formData.phone);
    if (success) {
      updateFormData({ verificationCode: '' });
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) return;
    
    const success = await verifyCode(formData.phone, formData.verificationCode);
    if (success) {
      updateFormData({ phoneVerified: true });
      onComplete();
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
          onSendCode={handleSendCode}
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
              onVerify={handleVerifyCode}
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