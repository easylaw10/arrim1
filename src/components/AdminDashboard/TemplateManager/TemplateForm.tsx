import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Template } from "./useTemplates";

interface TemplateFormProps {
  editForm: Template;
  setEditForm: React.Dispatch<React.SetStateAction<Template>>;
  onSave: () => void;
}

export const TemplateForm = ({
  editForm,
  setEditForm,
  onSave,
}: TemplateFormProps) => {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label>שם התבנית</label>
          <Input
            value={editForm.name}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <label>סוג מטלה</label>
          <Input value={`מטלה ${editForm.task_type}`} disabled />
        </div>
        <div className="space-y-2">
          <label>שם המטלה</label>
          <Input
            value={editForm.task_name || ''}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                task_name: e.target.value,
              }))
            }
            placeholder="למשל: כתב הגנה אזרחי"
          />
        </div>
        <div className="space-y-2">
          <label>קישור למחוון</label>
          <Input
            value={editForm.rubric_link || ''}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                rubric_link: e.target.value,
              }))
            }
            placeholder="הכנס קישור למחוון"
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <label>תוכן התבנית</label>
          <Textarea
            value={editForm.content}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            className="min-h-[200px] font-mono text-sm"
            dir="ltr"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline">ביטול</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={onSave}>שמור</Button>
        </DialogClose>
      </div>
    </>
  );
};