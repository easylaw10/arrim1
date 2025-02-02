import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Copy, FileText, Sparkles } from "lucide-react";
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
        
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="font-semibold text-yellow-800">
            שימו לב! ניתן ליצור ערר פעם אחת בלבד. מומלץ להעתיק את הטקסט ולשמור אותו - לא תהיה אפשרות לחזור למסך זה.
          </AlertDescription>
        </Alert>

        <p className="text-gray-600">
          להלן נוסח הערר שנוצר באמצעות בינה מלאכותית. ניתן לערוך את הטקסט לפי הצורך.
        </p>
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
              {/* Magic wand container */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 transform rotate-45">
                <div className="relative">
                  {/* Wand handle */}
                  <div className="h-16 w-3 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full" />
                  {/* Wand tip */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-200" />
                  {/* Magic sparkles */}
                  <div className="absolute -top-3 left-1/2">
                    <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </div>
              {/* Magic circle */}
              <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping" />
                </div>
              </div>
              {/* Magic particles */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-primary animate-pulse font-medium">
              מייצר ערר במיוחד בשבילך...
            </div>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
            </div>
          </div>
        ) : (
          <>
            <div className="relative animate-fade-in">
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
                בינה מלאכותית עלולה לעשות טעויות. יש לקרוא את הערר בעיון ולתקן במידת הצורך.
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
