import { AppealForm } from "@/components/AppealForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-right">טופס ערר - מטלת כתיבה</h1>
        <AppealForm />
      </div>
    </div>
  );
};

export default Index;