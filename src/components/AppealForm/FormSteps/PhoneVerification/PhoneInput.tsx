import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import { usePhoneValidation } from './usePhoneValidation';

interface PhoneInputProps {
  phone: string;
  isVerified: boolean;
  isLoading: boolean;
  onSendCode: () => void;
  onChange: (phone: string) => void;
  showVerification: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  phone,
  isVerified,
  isLoading,
  onSendCode,
  onChange,
  showVerification,
}) => {
  const { validatePhone } = usePhoneValidation();

  const handleSendCode = async () => {
    const isValid = await validatePhone(phone);
    if (isValid) {
      onSendCode();
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="phone" className="form-label">טלפון נייד</label>
      <div className="relative">
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onChange(e.target.value)}
          placeholder="05XXXXXXXX"
          disabled={isVerified}
          className={`form-input text-lg ${isVerified ? 'bg-gray-50 border-green-500' : ''}`}
          required
        />
        {isVerified && (
          <CheckCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
        )}
      </div>
      {!isVerified && (
        <Button 
          onClick={handleSendCode}
          disabled={isLoading}
          className="mt-4 w-full gap-2"
          variant={showVerification ? "outline" : "default"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          שלח קוד אימות
        </Button>
      )}
    </div>
  );
};