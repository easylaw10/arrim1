import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { TemplateForm } from "./TemplateForm";

interface TemplateItemProps {
  template: {
    id: string;
    name: string;
    content: string;
    task_type: number;
    updated_at: string;
  };
  onEdit: (template: any) => void;
  onDelete: (id: string) => void;
  editForm: any;
  setEditForm: (form: any) => void;
  handleSave: () => void;
}

export const TemplateItem = ({
  template,
  onEdit,
  onDelete,
  editForm,
  setEditForm,
  handleSave,
}: TemplateItemProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h3 className="font-medium">{template.name}</h3>
        <p className="text-sm text-gray-500">
          מטלה {template.task_type} | עודכן:{" "}
          {new Date(template.updated_at).toLocaleDateString("he-IL")}
        </p>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(template)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>עריכת תבנית</DialogTitle>
            </DialogHeader>
            <TemplateForm
              editForm={editForm}
              setEditForm={setEditForm}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(template.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};