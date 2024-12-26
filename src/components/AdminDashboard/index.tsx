import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useAppealsList } from "./useAppealsList";
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "../AppealForm/types";

export const AdminDashboard = () => {
  const { appeals, isLoading } = useAppealsList();
  const [selectedAppeal, setSelectedAppeal] = useState<FormData | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAppeal = async (appeal: FormData) => {
    setIsGenerating(true);
    setSelectedAppeal(appeal);
    try {
      const { data, error } = await supabase.functions.invoke('generate-appeal', {
        body: { appeal }
      });

      if (error) throw error;
      
      setGeneratedText(data.generatedAppeal);
      toast({
        title: "הערר נוצר בהצלחה",
        description: "תוכל להעתיק אותו ללוח",
      });
    } catch (error) {
      console.error('Error generating appeal:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת הערר",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({
        title: "הועתק בהצלחה",
        description: "הערר הועתק ללוח",
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בהעתקת הערר",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>רשימת עררים</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם מלא</TableHead>
                <TableHead className="text-right">מספר זהות</TableHead>
                <TableHead className="text-right">ציון שפה נוכחי</TableHead>
                <TableHead className="text-right">ציון ארגון נוכחי</TableHead>
                <TableHead className="text-right">ציון תוכן נוכחי</TableHead>
                <TableHead className="text-right">ציון מבחן סופי</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appeals.map((appeal, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{appeal.fullName}</TableCell>
                  <TableCell className="text-right">{appeal.idNumber}</TableCell>
                  <TableCell className="text-right">
                    {appeal.currentLanguageScore}
                  </TableCell>
                  <TableCell className="text-right">
                    {appeal.currentOrganizationScore}
                  </TableCell>
                  <TableCell className="text-right">
                    {appeal.currentContentScore}
                  </TableCell>
                  <TableCell className="text-right">
                    {appeal.finalExamScore}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => generateAppeal(appeal)}
                      disabled={isGenerating && selectedAppeal?.idNumber === appeal.idNumber}
                    >
                      {isGenerating && selectedAppeal?.idNumber === appeal.idNumber
                        ? "מייצר ערר..."
                        : "צור ערר"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>ערר שנוצר עבור {selectedAppeal?.fullName}</span>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                העתק ערר
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-right">
              {generatedText}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};