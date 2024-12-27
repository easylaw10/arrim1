import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center">
            <span className="font-medium">EasyLaw</span>
            <div className="hidden sm:block">·</div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Link 
                to="https://hi.easylaw.io/grade-policy/" 
                target="_blank" 
                className="hover:text-primary transition-colors text-center"
              >
                תנאי שימוש
              </Link>
              <div className="hidden sm:block">·</div>
              <Link 
                to="https://hi.easylaw.io/bar" 
                target="_blank" 
                className="hover:text-primary transition-colors text-center"
              >
                קורס הכנה לבחינות הלשכה
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-t sm:border-0 pt-4 sm:pt-0">
            <span>מופעל על ידי</span>
            <Link 
              to="https://easylaw.io" 
              target="_blank" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              EasyLaw
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};