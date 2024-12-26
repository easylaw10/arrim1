import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppealsList } from "./useAppealsList";

export const AdminDashboard = () => {
  const { appeals, isLoading } = useAppealsList();

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
    <div className="container mx-auto py-8">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};