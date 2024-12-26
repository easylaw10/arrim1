import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { FormData } from "../types";

interface TaskHeaderProps {
  title: string;
  formData: FormData;
}

export const TaskHeader = ({ title, formData }: TaskHeaderProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {formData.rubricLink && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={formData.rubricLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              מחוון הוועדה הבוחנת
            </a>
          </Button>
        )}
      </div>
      {formData.taskName && (
        <p className="text-gray-600">
          {formData.taskName}
        </p>
      )}
    </div>
  );
};