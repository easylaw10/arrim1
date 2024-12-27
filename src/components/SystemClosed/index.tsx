import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ExternalLink } from "lucide-react";

export const SystemClosed = ({ message }: { message: string }) => {
  const navigate = useNavigate();

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
            {message}
          </p>

          <div className="flex flex-col space-y-4 mt-8">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="gap-2"
            >
              <ChevronRight className="h-4 w-4" />
              חזרה לדף הבית
            </Button>
            
            <Button
              onClick={() => window.open('https://easylaw.io', '_blank')}
              className="gap-2 hover:scale-105 transition-transform"
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