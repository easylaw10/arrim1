import React, { useState } from 'react';
import { FormData } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Step6Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const Step6: React.FC<Step6Props> = ({ formData }) => {
  const [generatedAppeal, setGeneratedAppeal] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAppeal = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-appeal', {
        body: { appeal: formData }
      });

      if (error) throw error;
      
      setGeneratedAppeal(data.generatedAppeal);
      toast({
        title: "הערר נוצר בהצלחה",
        description: "תוכל להעתיק אותו ללוח",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת הערר. אנא נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedAppeal);
      toast({
        title: "הועתק בהצלחה",
        description: "הערר הועתק ללוח",
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת העתקת הערר",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="form-step">
      <h2 className="text-2xl font-bold mb-6">נוסח הערר</h2>
      
      {!generatedAppeal && (
        <div className="text-center mb-6">
          <Button
            onClick={handleGenerateAppeal}
            disabled={isLoading}
          >
            {isLoading ? "מכין את הערר..." : "צור ערר"}
          </Button>
        </div>
      )}

      {generatedAppeal && (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              העתק ערר
            </Button>
          </div>
          
          <Textarea
            value={generatedAppeal}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
};