import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Unlock } from "lucide-react";

export const SystemAccessManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: systemAccess, isLoading } = useQuery({
    queryKey: ["system_access"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "system_access")
        .single();

      if (error) throw error;
      return data?.value as { is_open: boolean; closed_message: string };
    },
  });

  const [formData, setFormData] = useState({
    is_open: systemAccess?.is_open ?? true,
    closed_message: systemAccess?.closed_message ?? "",
  });

  const updateSystemAccess = useMutation({
    mutationFn: async (newSettings: typeof formData) => {
      const { error } = await supabase
        .from("system_settings")
        .update({ value: newSettings })
        .eq("key", "system_access");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system_access"] });
      toast({
        title: "הגדרות המערכת עודכנו בהצלחה",
        description: formData.is_open ? "המערכת פתוחה כעת" : "המערכת סגורה כעת",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "שגיאה בעדכון הגדרות המערכת",
        description: "אנא נסה שנית",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return null;
  }

  const handleSave = () => {
    updateSystemAccess.mutate(formData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">הגדרות גישה למערכת</CardTitle>
        {formData.is_open ? (
          <Unlock className="h-5 w-5 text-green-500" />
        ) : (
          <Lock className="h-5 w-5 text-red-500" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {formData.is_open ? "המערכת פתוחה" : "המערכת סגורה"}
          </span>
          <Switch
            checked={formData.is_open}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({ ...prev, is_open: checked }));
              setIsEditing(true);
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">הודעת סגירת מערכת</label>
          <Textarea
            value={formData.closed_message}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, closed_message: e.target.value }));
              setIsEditing(true);
            }}
            placeholder="הזן את ההודעה שתוצג כאשר המערכת סגורה"
            className="min-h-[100px]"
          />
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={updateSystemAccess.isPending}
            >
              שמור שינויים
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};