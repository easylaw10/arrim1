import React from 'react';
import { FormData } from '../types';
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskHeaderProps {
  title: string;
  formData: FormData;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ title, formData }) => {
  return (
    <div className="mb-8 space-y-4">
      <h2 className="form-title">
        {title}
      </h2>
      {formData.taskName && (
        <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-slate-700">
              {formData.taskName}
            </h3>
          </div>
          {formData.rubricLink && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-sm"
              asChild
            >
              <a href={formData.rubricLink} target="_blank" rel="noopener noreferrer">
                <Link className="h-4 w-4" />
                מחוון הוועדה הבוחנת
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};