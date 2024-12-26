import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Step6Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step6 = ({ formData, updateFormData }: Step6Props) => {
  const [template, setTemplate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAppeal = async () => {
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-appeal', {
        body: { formData },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      setTemplate(data.generatedAppeal);
      updateFormData({ appealText: data.generatedAppeal });
      
      toast({
        title: "הערר נוצר בהצלחה",
        description: "הטקסט נוצר בהצלחה באמצעות בינה מלאכותית",
      });
    } catch (error) {
      console.error("Error generating appeal:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת הערר",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateAppeal();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTemplate(newText);
    updateFormData({ appealText: newText });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">נוסח הערר</h2>
        <Button
          onClick={generateAppeal}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
          יצירת ערר חדש
        </Button>
      </div>
      
      <p className="text-gray-600">
        להלן נוסח הערר שנוצר באמצעות בינה מלאכותית. ניתן לערוך את הטקסט לפי הצורך.
      </p>
      
      {isGenerating ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Textarea
          value={template}
          onChange={handleTextChange}
          className="min-h-[400px] font-mono text-sm"
          dir="rtl"
        />
      )}
    </div>
  );
};