import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AdminDashboard } from "@/components/AdminDashboard";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "easy-0821") {
      setIsAuthenticated(true);
      toast({
        title: "התחברת בהצלחה",
        description: "ברוך הבא לממשק הניהול",
      });
    } else {
      toast({
        title: "שגיאה",
        description: "סיסמה שגויה",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Lock className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">התחברות למנהל</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="הזן סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-right"
            />
          </div>
          <Button type="submit" className="w-full">
            התחבר
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
          >
            חזור לטופס
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Admin;