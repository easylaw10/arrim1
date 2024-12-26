import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppealsList } from "./useAppealsList";

export const AdminDashboard = () => {
  const { appeals, isLoading } = useAppealsList();
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");

  const filteredAppeals = appeals.filter((appeal) => {
    const matchesSearch =
      appeal.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appeal.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesScore = scoreFilter
      ? appeal.final_score === parseInt(scoreFilter)
      : true;

    return matchesSearch && matchesScore;
  });

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

  const uniqueScores = [...new Set(appeals.map((appeal) => appeal.final_score))].sort((a, b) => a - b);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>רשימת עררים</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="חיפוש לפי שם או אימייל..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="w-48">
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="סינון לפי ציון סופי" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">הכל</SelectItem>
                  {uniqueScores.map((score) => (
                    <SelectItem key={score} value={score.toString()}>
                      {score}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppeals.map((appeal) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};