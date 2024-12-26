import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplateForm } from "./TemplateForm";
import { TemplateItem } from "./TemplateItem";

export const TemplateManager = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
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

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (template: any) => {
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
      // Check if a template with the same task_type already exists
      const { data: existingTemplates } = await supabase
        .from("gpt_instructions")
        .select("id")
        .eq("task_type", editForm.task_type);

      if (existingTemplates && existingTemplates.length > 0 && !editingTemplate) {
        toast({
          title: "שגיאה",
          description: "כבר קיימת תבנית עבור סוג מטלה זה",
          variant: "destructive",
        });
        return;
      }

      if (editingTemplate) {
        // Check if trying to change task_type to one that already exists
        if (editingTemplate.task_type !== editForm.task_type) {
          const { data: conflictingTemplates } = await supabase
            .from("gpt_instructions")
            .select("id")
            .eq("task_type", editForm.task_type);

          if (conflictingTemplates && conflictingTemplates.length > 0) {
            toast({
              title: "שגיאה",
              description: "כבר קיימת תבנית עבור סוג מטלה זה",
              variant: "destructive",
            });
            return;
          }
        }

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ניהול תבניות</CardTitle>
        {templates.length < 2 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                תבנית חדשה
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "עריכת תבנית" : "תבנית חדשה"}
                </DialogTitle>
              </DialogHeader>
              <TemplateForm
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSave}
                disabledTaskTypes={templates.map((t) => t.task_type)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <TemplateItem
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editForm={editForm}
              setEditForm={setEditForm}
              handleSave={handleSave}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};