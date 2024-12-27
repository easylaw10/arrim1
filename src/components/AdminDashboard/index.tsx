import { AppealsList } from "./AppealsList";
import { TemplateManager } from "./TemplateManager";
import { FAQManager } from "./FAQManager";

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <TemplateManager />
      <FAQManager />
      <AppealsList />
    </div>
  );
};