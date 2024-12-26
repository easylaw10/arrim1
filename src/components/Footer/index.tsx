import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>© {currentYear} EasyLaw</span>
            <span className="hidden md:inline">|</span>
            <a 
              href="https://hi.easylaw.io/grade-policy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              תנאי שימוש
            </a>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500">
            נבנה באהבה
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            על ידי EasyLaw
          </div>
        </div>
      </div>
    </footer>
  );
};