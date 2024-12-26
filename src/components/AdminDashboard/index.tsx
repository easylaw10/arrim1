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

export const AdminDashboard = () => {
  const { appeals, isLoading } = useAppealsList();
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAppeal = async (appeal) => {
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
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">שם מלא</TableHead>
                <TableHead className="text-right">טלפון</TableHead>
                <TableHead className="text-right">אימייל</TableHead>
                <TableHead className="text-right">ציון לשון</TableHead>
                <TableHead className="text-right">ציון ארגון</TableHead>
                <TableHead className="text-right">ציון תוכן</TableHead>
                <TableHead className="text-right">ציון סופי</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appeals.map((appeal) => (
                <TableRow key={appeal.id}>
                  <TableCell className="text-right">
                    {new Date(appeal.created_at).toLocaleDateString('he-IL')}
                  </TableCell>
                  <TableCell className="text-right">{appeal.full_name}</TableCell>
                  <TableCell className="text-right">{appeal.phone}</TableCell>
                  <TableCell className="text-right">{appeal.email}</TableCell>
                  <TableCell className="text-right">
                    {appeal.language_score}
                  </TableCell>
                  <TableCell className="text-right">
                    {appeal.organization_score}
                  </TableCell>
                  <TableCell className="text-right">
                    {appeal.content_score}
                  </TableCell>
                  <TableCell className="text-right">
                    {appeal.final_score}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => generateAppeal(appeal)}
                      disabled={isGenerating && selectedAppeal?.id === appeal.id}
                    >
                      {isGenerating && selectedAppeal?.id === appeal.id
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
              <span>ערר שנוצר עבור {selectedAppeal?.full_name}</span>
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