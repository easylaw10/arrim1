import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useSystemAccess } from "@/hooks/use-system-access";

export const SystemClosed = () => {
  const navigate = useNavigate();
  const { data: systemAccess, isLoading } = useSystemAccess();

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="https://cdn.easylaw.io/assets/1732831883809" 
              alt="EasyLaw Logo" 
              className="h-16"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            המערכת אינה זמינה כרגע
          </h2>
          
          <p className="text-gray-600 text-lg">
            {systemAccess?.closed_message || "המערכת סגורה זמנית. אנא חזור מאוחר יותר או צור קשר עם התמיכה."}
          </p>

          <div className="flex justify-center space-x-4 space-x-reverse">
            <Button
              onClick={() => window.open('https://easylaw.io', '_blank')}
              variant="outline"
              className="mt-8 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              עבור לאתר EasyLaw
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};