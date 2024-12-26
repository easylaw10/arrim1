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
    <div className="mb-8 space-y-4 bg-slate-50 p-6 rounded-lg border font-heebo">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-slate-600" />
          <h2 className="text-xl font-bold text-gray-900">{formData.taskName}</h2>
        </div>
        {formData.rubricLink && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-base"
            asChild
          >
            <a href={formData.rubricLink} target="_blank" rel="noopener noreferrer">
              <Link className="h-4 w-4" />
              מחוון הוועדה הבוחנת
            </a>
          </Button>
        )}
      </div>
      <div className="text-2xl font-bold text-primary">
        {title}
      </div>
    </div>
  );
};