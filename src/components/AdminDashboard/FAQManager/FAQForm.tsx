import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { FAQFormData } from "./types";

interface FAQFormProps {
  formData: FAQFormData;
  onFormChange: (data: FAQFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const FAQForm = ({ formData, onFormChange, onSave, onCancel }: FAQFormProps) => {
  return (
    <div className="space-y-2">
      <Input
        value={formData.question || ""}
        onChange={(e) => onFormChange({ ...formData, question: e.target.value })}
        placeholder="שאלה"
      />
      <Textarea
        value={formData.answer || ""}
        onChange={(e) => onFormChange({ ...formData, answer: e.target.value })}
        placeholder="תשובה"
      />
      <div className="flex gap-2">
        <Button size="sm" variant="default" onClick={onSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};