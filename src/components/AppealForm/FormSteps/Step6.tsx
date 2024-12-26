import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, FileText, AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Step6Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step6 = ({ formData, updateFormData }: Step6Props) => {
  const [template, setTemplate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
        description: "תוכן הערר הועתק ללוח",
      });
    } catch (error) {
      toast({
        title: "שגיאה בהעתקה",
        description: "לא הצלחנו להעתיק את התוכן",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">נוסח הערר</h2>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          העתקת תוכן הערר
        </Button>
      </div>
      
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-right">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              הוראות להגשת הערר
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-right space-y-4">
            <h3 className="font-semibold mb-2">הגשת הערר באתר לשכת עורכי הדין</h3>
            <ol className="space-y-2 list-decimal pr-4">
              <li>היכנס לאזור האישי באתר לשכת עורכי הדין</li>
              <li>בחר בתפריט הימני את הלשונית "תיק מתמחה"</li>
              <li>בתפריט העליון לחץ על "בחינות התמחות/הסמכה"</li>
              <li>לחץ על "הגשת ערר"</li>
              <li>העתק את תוכן הערר לשדה המתאים</li>
              <li>סמן בצ'קבוקס "שאלה פתוחה" ואת מספר השאלה</li>
            </ol>
            <p className="text-sm text-red-600 mt-4">
              שים לב: ניתן להגיש את הערר עד ה-24.3.24 בשעה 23:59
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <h4 className="font-semibold">הסרת אחריות</h4>
              </div>
              <p className="text-sm text-amber-700">
                חשוב להדגיש כי בעת הגשת הערר, מטלת הכתיבה נפתחת לבדיקה נוספת. תוצאות הערר תלויות במידה רבה בזהות הבודק הנוסף, ולכן באופן עקרוני, בכל מטלה תיתכן גם הפחתת ניקוד.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};