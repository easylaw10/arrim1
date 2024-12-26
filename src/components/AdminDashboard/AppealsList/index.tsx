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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useAppealsList, Appeal } from "../useAppealsList";

export const AppealsList = () => {
  const { appeals, isLoading, deleteAppeal, updateAppeal } = useAppealsList();
  const [editingAppeal, setEditingAppeal] = useState<Appeal | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appeal>>({});

  const handleEdit = (appeal: Appeal) => {
    setEditingAppeal(appeal);
    setEditForm({
      full_name: appeal.full_name,
      phone: appeal.phone,
      email: appeal.email,
      language_score: appeal.language_score,
      organization_score: appeal.organization_score,
      content_score: appeal.content_score,
      final_score: appeal.final_score,
    });
  };

  const handleUpdate = async () => {
    if (editingAppeal && editForm) {
      await updateAppeal(editingAppeal.id, editForm);
      setEditingAppeal(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק ערר זה?")) {
      await deleteAppeal(id);
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
                  {new Date(appeal.created_at).toLocaleDateString("he-IL")}
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
                <TableCell className="text-right">{appeal.final_score}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(appeal)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>עריכת ערר</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label>שם מלא</label>
                            <Input
                              value={editForm.full_name || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  full_name: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label>טלפון</label>
                            <Input
                              value={editForm.phone || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label>אימייל</label>
                            <Input
                              value={editForm.email || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label>ציון לשון</label>
                            <Input
                              type="number"
                              value={editForm.language_score || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  language_score: parseInt(e.target.value),
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label>ציון ארגון</label>
                            <Input
                              type="number"
                              value={editForm.organization_score || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  organization_score: parseInt(e.target.value),
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label>ציון תוכן</label>
                            <Input
                              type="number"
                              value={editForm.content_score || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  content_score: parseInt(e.target.value),
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label>ציון סופי</label>
                            <Input
                              type="number"
                              value={editForm.final_score || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  final_score: parseInt(e.target.value),
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">ביטול</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={handleUpdate}>שמור</Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(appeal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};