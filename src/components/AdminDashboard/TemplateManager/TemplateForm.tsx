import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateFormProps {
  editForm: {
    name: string;
    content: string;
    task_type: number;
  };
  setEditForm: (form: any) => void;
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
            value={editForm.name || ""}
            onChange={(e) =>
              setEditForm((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <label>סוג מטלה</label>
          <Select
            value={String(editForm.task_type)}
            onValueChange={(value) =>
              setEditForm((prev: any) => ({
                ...prev,
                task_type: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="בחר סוג מטלה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">מטלה 1</SelectItem>
              <SelectItem value="2">מטלה 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label>תוכן התבנית</label>
          <Textarea
            value={editForm.content || ""}
            onChange={(e) =>
              setEditForm((prev: any) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            className="min-h-[200px]"
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