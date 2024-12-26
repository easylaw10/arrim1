import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(template);
      toast({
        title: "הועתק בהצלחה",
        description: "הטקסט הועתק ללוח. ניתן להדביק אותו באתר לשכת עורכי הדין",
      });
    } catch (err) {
      toast({
        title: "שגיאה בהעתקה",
        description: "לא הצלחנו להעתיק את הטקסט",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">נוסח הערר</h2>
        <p className="text-gray-600">
          להלן נוסח הערר שנוצר באמצעות בינה מלאכותית. ניתן לערוך את הטקסט לפי הצורך.
        </p>
        
        {isGenerating ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="relative">
              <Textarea
                value={template}
                onChange={handleTextChange}
                className="min-h-[400px] font-mono text-sm"
                dir="rtl"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="absolute top-2 left-2 gap-2"
              >
                <Copy className="h-4 w-4" />
                העתק טקסט
              </Button>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>
                שימו לב: בינה מלאכותית עלולה לעשות טעויות. יש לקרוא את הערר בעיון ולתקן במידת הצורך.
              </span>
            </div>
          </>
        )}
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-right">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              הוראות להגשת הערר
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-right space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">הגשת הערר באתר לשכת עורכי הדין:</h3>
              <ol className="list-decimal list-inside space-y-2 mr-4">
                <li>היכנס לאזור האישי באתר לשכת עורכי הדין</li>
                <li>בחר בתפריט הימני את הלשונית "תיק מתמחה"</li>
                <li>בתפריט העליון לחץ על "בחינות התמחות/הסמכה"</li>
                <li>לחץ על "הגשת ערר"</li>
                <li>העתק את תוכן הערר לשדה שנפתח</li>
                <li>סמן בצ'קבוקס "שאלה פתוחה" ואת מספר השאלה</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="disclaimer">
          <AccordionTrigger className="text-right">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              הערה חשובה
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-right">
            <p className="text-gray-700">
              חשוב לנו להדגיש, שבעת הגשת הערר מטלת הכתיבה נפתחת לבדיקה נוספת. תוצאות הערר תלויות במידה רבה בזהות הבודק הנוסף, ולכן באופן עקרוני, בכל מטלה תיתכן גם הפחתת ניקוד.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};