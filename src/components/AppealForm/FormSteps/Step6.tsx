import React, { useState } from 'react';
import { FormData } from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="form-step space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">יצירת ערר</h2>
        <p className="text-gray-600 mb-6">
          המערכת תנתח את כל הנתונים שהזנת ותייצר עבורך ערר מקצועי
        </p>
      </div>
      
      {!generatedAppeal && !isLoading && (
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="pt-6 text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">מוכנים ליצור את הערר?</h3>
            <p className="text-gray-600 mb-6">לחץ על הכפתור כדי להתחיל בתהליך היצירה</p>
            <Button
              onClick={handleGenerateAppeal}
              className="gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              צור ערר
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-6 animate-pulse">
              <div className="flex items-center justify-center mb-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-center font-semibold mb-4">מעבד את הנתונים ויוצר ערר...</h3>
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {generatedAppeal && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">הערר נוצר בהצלחה</span>
            </div>
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              העתק ערר
            </Button>
          </div>
          
          <Card className="border-green-100">
            <CardContent className="pt-6">
              <Textarea
                value={generatedAppeal}
                readOnly
                className="min-h-[400px] font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};