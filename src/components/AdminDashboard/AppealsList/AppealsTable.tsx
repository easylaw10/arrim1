import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Appeal } from "../useAppealsList";
import { EditAppealDialog } from "./EditAppealDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppealsTableProps {
  appeals: Appeal[];
  onEdit: (appeal: Appeal) => void;
  onDelete: (id: string) => void;
  editingAppeal: Appeal | null;
  editForm: Partial<Appeal>;
  setEditForm: (form: Partial<Appeal>) => void;
  handleUpdate: () => void;
}

export const AppealsTable = ({
  appeals,
  onEdit,
  onDelete,
  editingAppeal,
  editForm,
  setEditForm,
  handleUpdate,
}: AppealsTableProps) => {
  return (
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
            <TableCell className="text-right">{appeal.language_score}</TableCell>
            <TableCell className="text-right">
              {appeal.organization_score}
            </TableCell>
            <TableCell className="text-right">{appeal.content_score}</TableCell>
            <TableCell className="text-right">{appeal.final_score}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <EditAppealDialog
                  appeal={appeal}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onEdit={onEdit}
                  onUpdate={handleUpdate}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>האם אתה בטוח שברצונך למחוק?</AlertDialogTitle>
                      <AlertDialogDescription>
                        פעולה זו תמחק לצמיתות את הערר של {appeal.full_name}. לא ניתן לבטל פעולה זו.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2">
                      <AlertDialogCancel>ביטול</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(appeal.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        מחק
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};