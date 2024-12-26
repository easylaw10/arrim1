import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Appeal } from "../useAppealsList";
import { useToast } from "@/components/ui/use-toast";

interface ExportButtonProps {
  appeals: Appeal[];
}

export const ExportButton = ({ appeals }: ExportButtonProps) => {
  const { toast } = useToast();

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        appeals.map((appeal) => ({
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
    }
  };

  return (
    <Button
      onClick={exportToExcel}
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      ייצוא לאקסל
    </Button>
  );
};