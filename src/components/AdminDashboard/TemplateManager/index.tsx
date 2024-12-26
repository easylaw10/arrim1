import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TemplateForm } from "./TemplateForm";
import { TemplateItem } from "./TemplateItem";
import { useTemplates } from "./useTemplates";

export const TemplateManager = () => {
  const {
    templates,
    editForm,
    setEditForm,
    handleEdit,
    handleCreate,
    handleSave,
    handleDelete,
  } = useTemplates();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ניהול תבניות</CardTitle>
        {templates.length < 2 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                תבנית חדשה
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>תבנית חדשה</DialogTitle>
              </DialogHeader>
              <TemplateForm
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSave}
                disabledTaskTypes={templates.map((t) => t.task_type)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <TemplateItem
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editForm={editForm}
              setEditForm={setEditForm}
              handleSave={handleSave}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};