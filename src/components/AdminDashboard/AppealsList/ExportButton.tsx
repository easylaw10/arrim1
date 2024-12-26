import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Appeal } from "../useAppealsList";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface ExportButtonProps {
  appeals: Appeal[];
}

export const ExportButton = ({ appeals }: ExportButtonProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      
      // Fetch all appeals from the database
      const { data: allAppeals, error } = await supabase
        .from('exam_appeals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const worksheet = XLSX.utils.json_to_sheet(
        (allAppeals || []).map((appeal) => ({
          תאריך: new Date(appeal.created_at).toLocaleDateString("he-IL"),
          "שם מלא": appeal.full_name,
          טלפון: appeal.phone,
          אימייל: appeal.email,
          "ציון לשון": appeal.language_score,
          "ציון ארגון": appeal.organization_score,
          "ציון תוכן": appeal.content_score,
          "ציון סופי": appeal.final_score,
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "עררים");

      XLSX.writeFile(workbook, "appeals-data.xlsx");

      toast({
        title: "הצלחה",
        description: "הנתונים יוצאו בהצלחה לקובץ אקסל",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בייצוא הנתונים",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToExcel}
      variant="outline"
      className="flex items-center gap-2"
      disabled={isExporting}
    >
      <FileDown className="h-4 w-4" />
      {isExporting ? "מייצא..." : "ייצוא לאקסל"}
    </Button>
  );
};