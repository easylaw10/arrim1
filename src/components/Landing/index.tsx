import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const Landing = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [taskNames, setTaskNames] = useState<{[key: number]: string}>({});
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

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

    const fetchFAQs = async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setFaqs(data);
      }
    };

    fetchTaskNames();
    fetchFAQs();
  }, []);

  const handleStartAppeal = (taskNumber: number) => {
    if (!termsAccepted) {
      alert("יש לאשר את תנאי השימוש כדי להמשיך");
      return;
    }
    navigate(`/form?task=${taskNumber}`);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative">
      {/* Hero Section */}
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
        </div>
      </div>

      {/* Visual Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-12" />

      {/* FAQ Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-12 text-center">
            שאלות נפוצות
          </h2>
          <div className="max-w-3xl mx-auto grid gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 flex justify-between items-center text-right"
                >
                  <span className="font-semibold text-lg text-primary">
                    {faq.question}
                  </span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </button>
                <div
                  className={`px-4 transition-all duration-300 overflow-hidden ${
                    expandedFaq === faq.id
                      ? "max-h-48 pb-4 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
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
  );
};