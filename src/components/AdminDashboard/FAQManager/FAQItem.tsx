import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { FAQ } from "./types";

interface FAQItemProps {
  faq: FAQ;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
}

export const FAQItem = ({ faq, onEdit, onDelete }: FAQItemProps) => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{faq.question}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(faq)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(faq.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-gray-600 mt-1">{faq.answer}</p>
    </div>
  );
};