import { FileText, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormData } from "../types";

interface TaskHeaderProps {
  title: string;
  formData: FormData;
}

export const TaskHeader = ({ title, formData }: TaskHeaderProps) => {
  if (!formData.taskName) return null;

  return (
    <div className="mb-6 space-y-4 bg-slate-50 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold">{formData.taskName}</h2>
        </div>
        {formData.rubricLink && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={formData.rubricLink} target="_blank" rel="noopener noreferrer">
              <Link className="h-4 w-4" />
              מחוון הוועדה הבוחנת
            </a>
          </Button>
        )}
      </div>
      <div className="text-lg font-medium text-slate-800">
        {title}
      </div>
    </div>
  );
};