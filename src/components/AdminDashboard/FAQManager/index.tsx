import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FAQ, FAQFormData } from "./types";
import { FAQForm } from "./FAQForm";
import { FAQItem } from "./FAQItem";

export const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FAQFormData>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order");

    if (error) {
      toast({
        title: "שגיאה בטעינת השאלות הנפוצות",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setFaqs(data);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditForm(faq);
  };

  const handleSave = async () => {
    if (!editForm.question || !editForm.answer) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("faqs")
      .update({
        question: editForm.question,
        answer: editForm.answer,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId);

    if (error) {
      toast({
        title: "שגיאה בשמירת השינויים",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "השינויים נשמרו בהצלחה",
    });
    setEditingId(null);
    setEditForm({});
    fetchFAQs();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) {
      toast({
        title: "שגיאה במחיקת השאלה",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "השאלה נמחקה בהצלחה",
    });
    fetchFAQs();
  };

  const handleAdd = async () => {
    if (!editForm.question || !editForm.answer) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("faqs").insert({
      question: editForm.question,
      answer: editForm.answer,
      display_order: faqs.length + 1,
    });

    if (error) {
      toast({
        title: "שגיאה בהוספת השאלה",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "השאלה נוספה בהצלחה",
    });
    setEditingId(null);
    setEditForm({});
    fetchFAQs();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ניהול שאלות נפוצות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 border rounded-lg bg-white shadow-sm space-y-2"
            >
              {editingId === faq.id ? (
                <FAQForm
                  formData={editForm}
                  onFormChange={setEditForm}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditingId(null);
                    setEditForm({});
                  }}
                />
              ) : (
                <FAQItem
                  faq={faq}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          ))}

          {editingId === "new" ? (
            <div className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
              <FAQForm
                formData={editForm}
                onFormChange={setEditForm}
                onSave={handleAdd}
                onCancel={() => {
                  setEditingId(null);
                  setEditForm({});
                }}
              />
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setEditingId("new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              הוסף שאלה חדשה
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};