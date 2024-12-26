import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} EasyLaw</span>
            <span>·</span>
            <Link 
              to="https://hi.easylaw.io/grade-policy/" 
              target="_blank" 
              className="hover:text-primary transition-colors"
            >
              תנאי שימוש
            </Link>
            <span>·</span>
            <Link 
              to="https://hi.easylaw.io/bar" 
              target="_blank" 
              className="hover:text-primary transition-colors"
            >
              קורס הכנה לבחינות הלשכה
            </Link>
          </div>
          <div className="flex items-center gap-2">
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