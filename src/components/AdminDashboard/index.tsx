import { AppealsList } from "./AppealsList";
import { TemplateManager } from "./TemplateManager";
import { FAQManager } from "./FAQManager";
import { SystemAccessManager } from "./SystemAccessManager";

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <SystemAccessManager />
      <TemplateManager />
      <FAQManager />
      <AppealsList />
    </div>
  );
};