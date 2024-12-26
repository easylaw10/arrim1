import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TemplateManager = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { toast } = useToast();

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from("gpt_instructions")
      .select("*")
      .order("created_at", { ascending: false });

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
    });
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setEditForm({
      name: "",
      content: "",
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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>שם התבנית</label>
                <Input
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label>תוכן התבנית</label>
                <Textarea
                  value={editForm.content || ""}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">ביטול</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleSave}>שמור</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500">
                  עודכן: {new Date(template.updated_at).toLocaleDateString("he-IL")}
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>עריכת תבנית</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label>שם התבנית</label>
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm((prev: any) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label>תוכן התבנית</label>
                        <Textarea
                          value={editForm.content || ""}
                          onChange={(e) =>
                            setEditForm((prev: any) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">ביטול</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleSave}>שמור</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};