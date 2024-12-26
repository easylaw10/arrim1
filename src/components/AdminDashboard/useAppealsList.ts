import { FormData } from "../AppealForm/types";

// כרגע נשתמש בנתונים סטטיים עד שנחבר את הדאטאבייס
const mockAppeals: FormData[] = [
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

export const useAppealsList = () => {
  // כרגע מחזיר נתונים סטטיים
  return {
    appeals: mockAppeals,
    isLoading: false,
  };
};