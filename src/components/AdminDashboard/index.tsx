import { AppealsList } from "./AppealsList";
import { TemplateManager } from "./TemplateManager";

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <TemplateManager />
      <AppealsList />
    </div>
  );
};