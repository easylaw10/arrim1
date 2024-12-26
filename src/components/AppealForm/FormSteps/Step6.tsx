import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Step6Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export const Step6 = ({ formData, updateFormData }: Step6Props) => {
  const [template, setTemplate] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data, error } = await supabase
          .from("gpt_instructions")
          .select("content")
          .eq("task_type", formData.taskType)
          .single();

        if (error) throw error;

        if (data) {
          // Replace template variables with actual values
          let processedTemplate = data.content
            .replace("{{languageExamples}}", formData.languageExamples || "")
            .replace("{{organizationExamples}}", formData.organizationExamples || "")
            .replace("{{contentExamples}}", formData.contentExamples || "")
            .replace("{{additionalNotes}}", formData.additionalNotes || "");

          // Handle language elements
          processedTemplate = processedTemplate.replace(
            /{{#if languageElements\.(\w+)}}(.*?){{\/if}}/g,
            (match, key, content) => {
              return formData.languageElements?.[key] ? content : "";
            }
          );

          // Handle organization elements
          processedTemplate = processedTemplate.replace(
            /{{#if organizationElements\.(\w+)}}(.*?){{\/if}}/g,
            (match, key, content) => {
              return formData.organizationElements?.[key] ? content : "";
            }
          );

          // Handle content elements
          processedTemplate = processedTemplate.replace(
            /{{#if contentElements\.(\w+)}}(.*?){{\/if}}/g,
            (match, key, content) => {
              return formData.contentElements?.[key] ? content : "";
            }
          );

          setTemplate(processedTemplate);
          updateFormData({ appealText: processedTemplate });
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בטעינת התבנית",
          variant: "destructive",
        });
      }
    };

    if (formData.taskType) {
      fetchTemplate();
    }
  }, [formData.taskType]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTemplate(newText);
    updateFormData({ appealText: newText });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">נוסח הערר</h2>
      <p className="text-gray-600">
        להלן נוסח הערר שנוצר בהתאם לפרטים שהזנת. ניתן לערוך את הטקסט לפי הצורך.
      </p>
      <Textarea
        value={template}
        onChange={handleTextChange}
        className="min-h-[400px] font-mono text-sm"
        dir="ltr"
      />
    </div>
  );
};