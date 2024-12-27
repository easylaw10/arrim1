export interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export interface FAQFormData extends Partial<FAQ> {}