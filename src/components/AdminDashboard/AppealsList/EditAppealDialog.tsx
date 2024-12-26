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
import { Pencil } from "lucide-react";
import { Appeal } from "../useAppealsList";

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
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(appeal)}
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
            <Button onClick={onUpdate}>שמור</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};