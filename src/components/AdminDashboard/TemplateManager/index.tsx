import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateForm } from "./TemplateForm";
import { TemplateItem } from "./TemplateItem";
import { useTemplates } from "./useTemplates";

export const TemplateManager = () => {
  const { templates, editForm, setEditForm, handleEdit, handleSave } =
    useTemplates();

  return (
    <Card>
      <CardHeader>
        <CardTitle>ניהול תבניות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <TemplateItem
              key={template.id}
              template={template}
              onEdit={handleEdit}
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