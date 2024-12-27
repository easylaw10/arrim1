import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FAQ>>({});
  const { toast } = useToast();

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

  useState(() => {
    fetchFAQs();
  }, []);

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
                <div className="space-y-2">
                  <Input
                    value={editForm.question}
                    onChange={(e) =>
                      setEditForm({ ...editForm, question: e.target.value })
                    }
                    placeholder="שאלה"
                  />
                  <Textarea
                    value={editForm.answer}
                    onChange={(e) =>
                      setEditForm({ ...editForm, answer: e.target.value })
                    }
                    placeholder="תשובה"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleSave}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setEditForm({});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(faq)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}

          {editingId === "new" ? (
            <div className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
              <Input
                value={editForm.question || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, question: e.target.value })
                }
                placeholder="שאלה"
              />
              <Textarea
                value={editForm.answer || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, answer: e.target.value })
                }
                placeholder="תשובה"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleAdd}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditForm({});
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
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