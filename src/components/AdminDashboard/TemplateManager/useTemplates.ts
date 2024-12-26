import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Template = {
  id: string;
  name: string;
  content: string;
  task_type: number;
  updated_at: string;
};

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editForm, setEditForm] = useState<Partial<Template>>({});
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
    setEditForm({
      name: template.name,
      content: template.content,
      task_type: template.task_type,
    });
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setEditForm({
      name: "",
      content: "",
      task_type: 1,
    });
  };

  const handleSave = async () => {
    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from("gpt_instructions")
          .update({
            name: editForm.name,
            content: editForm.content,
            task_type: editForm.task_type,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingTemplate.id);

        if (error) throw error;

        toast({
          title: "נשמר בהצלחה",
          description: "התבנית עודכנה בהצלחה",
        });
      } else {
        const { error } = await supabase.from("gpt_instructions").insert({
          name: editForm.name,
          content: editForm.content,
          task_type: editForm.task_type,
        });

        if (error) throw error;

        toast({
          title: "נשמר בהצלחה",
          description: "התבנית נוצרה בהצלחה",
        });
      }

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

  const handleDelete = async (id: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק תבנית זו?")) {
      try {
        const { error } = await supabase
          .from("gpt_instructions")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "נמחק בהצלחה",
          description: "התבנית נמחקה בהצלחה",
        });

        fetchTemplates();
      } catch (error) {
        console.error("Error deleting template:", error);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה במחיקת התבנית",
          variant: "destructive",
        });
      }
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
    handleCreate,
    handleSave,
    handleDelete,
  };
};