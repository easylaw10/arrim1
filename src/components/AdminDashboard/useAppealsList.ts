import { FormData } from "../AppealForm/types";

const STORAGE_KEY = 'appeals-list';

// קבלת הנתונים מה-localStorage או שימוש בנתונים סטטיים כברירת מחדל
const getInitialAppeals = (): FormData[] => {
  const savedAppeals = localStorage.getItem(STORAGE_KEY);
  if (savedAppeals) {
    return JSON.parse(savedAppeals);
  }
  
  // נתונים סטטיים כברירת מחדל
  return [
    {
      fullName: "ישראל ישראלי",
      idNumber: "123456789",
      currentLanguageScore: 70,
      currentOrganizationScore: 75,
      currentContentScore: 80,
      finalExamScore: 75,
      languageElements: {
        legalTerms: true,
        termConsistency: true,
        grammarSyntax: false,
      },
      languageExamples: "דוגמה לטקסט",
      organizationElements: {
        introduction: true,
        factPresentation: true,
        legalAnalysis: true,
        conclusion: true,
      },
      organizationExamples: "דוגמה לטקסט",
      contentElements: {
        allParties: true,
        legislation: true,
        caselaw: true,
        relevantFacts: true,
      },
      contentExamples: "דוגמה לטקסט",
      requestedLanguageScore: 80,
      requestedOrganizationScore: 85,
      requestedContentScore: 90,
      additionalNotes: "הערות נוספות",
    },
  ];
};

export const useAppealsList = () => {
  return {
    appeals: getInitialAppeals(),
    isLoading: false,
  };
};

// פונקציה לשמירת ערר חדש
export const saveNewAppeal = (appeal: FormData) => {
  const currentAppeals = getInitialAppeals();
  const updatedAppeals = [...currentAppeals, appeal];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAppeals));
};