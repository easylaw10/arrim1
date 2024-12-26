import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Template = {
  id: string;
  name: string;
  content: string;
  task_type: number;
  updated_at: string;
  task_name?: string;
  rubric_link?: string;
};

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editForm, setEditForm] = useState<Template>({
    id: "",
    name: "",
    content: "",
    task_type: 1,
    updated_at: new Date().toISOString(),
    task_name: "",
    rubric_link: "",
  });
  const { toast } = useToast();

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from("gpt_instructions")
      .select("*")
      .order("task_type", { ascending: true });

    if (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת התבניות",
        variant: "destructive",
      });
      return;
    }

    setTemplates(data || []);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditForm(template);
  };

  const handleSave = async () => {
    try {
      if (!editingTemplate) return;

      const { error } = await supabase
        .from("gpt_instructions")
        .update({
          name: editForm.name,
          content: editForm.content,
          task_name: editForm.task_name,
          rubric_link: editForm.rubric_link,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTemplate.id);

      if (error) throw error;

      toast({
        title: "נשמר בהצלחה",
        description: "התבנית עודכנה בהצלחה",
      });

      fetchTemplates();
      setEditingTemplate(null);
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת התבנית",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    editingTemplate,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
  };
};