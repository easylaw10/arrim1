import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

export const Landing = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [taskNames, setTaskNames] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const fetchTaskNames = async () => {
      const { data, error } = await supabase
        .from("gpt_instructions")
        .select("task_type, task_name")
        .order("task_type");

      if (!error && data) {
        const names = data.reduce((acc, curr) => ({
          ...acc,
          [curr.task_type]: curr.task_name || `מטלה ${curr.task_type}`
        }), {});
        setTaskNames(names);
      }
    };

    fetchTaskNames();
  }, []);

  const handleStartAppeal = (taskNumber: number) => {
    if (!termsAccepted) {
      alert("יש לאשר את תנאי השימוש כדי להמשיך");
      return;
    }
    navigate(`/form?task=${taskNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <img 
              src="https://cdn.easylaw.io/assets/1732831883809" 
              alt="EasyLaw Logo" 
              className="h-16 md:h-20"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent font-heebo">
            מחולל עררים למטלת הכתיבה
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-heebo">
            מערכת חכמה ליצירה והגשת עררים על ציוני מטלת כתיבה, 
            המשלבת בינה מלאכותית לניתוח וכתיבת העררים
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 font-heebo">
                אני מאשר/ת את{" "}
                <a 
                  href="https://hi.easylaw.io/grade-policy/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  תנאי השימוש
                </a>
              </label>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
              {[1, 2].map((taskNum) => (
                <Button
                  key={taskNum}
                  size="lg"
                  onClick={() => handleStartAppeal(taskNum)}
                  className="text-xl px-12 py-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 transform hover:-translate-y-1 font-heebo min-w-[200px]"
                >
                  {taskNames[taskNum] || `מטלה ${taskNum}`}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-24 bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-12">איך זה עובד?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl ring-4 ring-primary/5">1</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">מלא את פרטי הערר</h3>
                  <p className="text-gray-600">הזן את פרטיך האישיים וציוני המטלה בטופס מובנה</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4 relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl ring-4 ring-primary/5">2</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">המערכת מנתחת</h3>
                  <p className="text-gray-600">הבינה המלאכותית מנתחת את המידע ומייצרת טיעונים מדויקים</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl ring-4 ring-primary/5">3</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">קבל את הערר</h3>
                  <p className="text-gray-600">קבל ערר מקצועי, מנומק ומפורט המוכן להגשה</p>
                </div>
              </div>
            </div>
          </div>

          {!isMobile && (
            <button
              onClick={() => navigate("/admin")}
              className="fixed bottom-4 right-4 p-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white group opacity-50 hover:opacity-100"
              title="כניסת מנהל"
            >
              <Lock className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
