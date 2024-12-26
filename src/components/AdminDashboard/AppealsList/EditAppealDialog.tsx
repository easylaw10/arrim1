import { Appeal } from "../useAppealsList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

interface EditAppealDialogProps {
  appeal: Appeal;
  editForm: Partial<Appeal>;
  setEditForm: (form: Partial<Appeal>) => void;
  onEdit: (appeal: Appeal) => void;
  onUpdate: () => void;
}

export const EditAppealDialog = ({
  appeal,
  editForm,
  setEditForm,
  onEdit,
  onUpdate,
}: EditAppealDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => onEdit(appeal)}>
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
                setEditForm({ ...editForm, full_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label>טלפון</label>
            <Input
              value={editForm.phone || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label>אימייל</label>
            <Input
              value={editForm.email || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label>ציון לשון</label>
            <Input
              type="number"
              value={editForm.language_score || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  language_score: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label>ציון ארגון</label>
            <Input
              type="number"
              value={editForm.organization_score || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  organization_score: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label>ציון תוכן</label>
            <Input
              type="number"
              value={editForm.content_score || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  content_score: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label>ציון סופי</label>
            <Input
              type="number"
              value={editForm.final_score || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  final_score: parseInt(e.target.value),
                })
              }
            />
          </div>
          <Button onClick={onUpdate} className="w-full">
            שמור שינויים
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};