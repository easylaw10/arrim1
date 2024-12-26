import { AppealForm } from "@/components/AppealForm";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

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
        
        <div className="flex justify-start mb-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin")}
              title="כניסה למנהל"
            >
              <Lock className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה לדף הבית
            </Button>
          </div>
        </div>
        
        <AppealForm />
      </div>
    </div>
  );
};

export default Index;