import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface VerificationInputProps {
  verificationCode?: string;
  isLoading: boolean;
  onVerify: () => void;
  onChange: (code: string) => void;
}

export const VerificationInput: React.FC<VerificationInputProps> = ({
  verificationCode,
  isLoading,
  onVerify,
  onChange,
}) => {
  return (
    <div className="flex gap-2">
      <Input
        id="verificationCode"
        type="text"
        value={verificationCode || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="הזן את הקוד שקיבלת"
        className="form-input text-center text-xl tracking-widest"
        maxLength={6}
        required
      />
      <Button 
        onClick={onVerify}
        disabled={isLoading}
        className="whitespace-nowrap gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        אמת קוד
      </Button>
    </div>
  );
};