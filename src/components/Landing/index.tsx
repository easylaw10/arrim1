import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            מערכת עררים למטלת כתיבה
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            מערכת חכמה ליצירה והגשת עררים על ציוני מטלת כתיבה, 
            המשלבת בינה מלאכותית לניתוח וכתיבת העררים
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse rtl">
            <Button
              size="lg"
              onClick={() => navigate("/form")}
              className="text-lg px-8"
            >
              הגש ערר חדש
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/admin")}
              className="text-lg px-8"
            >
              כניסה למנהל
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">מילוי קל ופשוט</h3>
              <p className="text-gray-600">
                טופס מובנה ונוח למילוי כל פרטי הערר בצורה מסודרת
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">ניתוח חכם</h3>
              <p className="text-gray-600">
                שימוש בבינה מלאכותית לניתוח הנתונים וכתיבת ערר מנומק
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">מעקב ובקרה</h3>
              <p className="text-gray-600">
                ממשק ניהול מתקדם למעקב אחר סטטוס העררים והטיפול בהם
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};