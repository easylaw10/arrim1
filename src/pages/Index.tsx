import { AppealForm } from "@/components/AppealForm";
import { SystemClosed } from "@/components/SystemClosed";
import { useSystemAccess } from "@/hooks/use-system-access";

const Index = () => {
  const { data: systemAccess, isLoading } = useSystemAccess();

  if (isLoading) {
    return null;
  }

  if (systemAccess && !systemAccess.is_open) {
    return <SystemClosed message={systemAccess.closed_message} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center mb-12">
          <img 
            src="https://cdn.easylaw.io/assets/1732831883809" 
            alt="EasyLaw Logo" 
            className="h-12 mb-6"
          />
          <h1 className="text-3xl font-bold text-primary">מחולל עררים - מטלות כתיבה</h1>
        </div>
        
        <AppealForm />
      </div>
    </div>
  );
};

export default Index;