export interface FormData {
  // Step 1 - Basic Details
  fullName: string;
  idNumber: string;
  examDate: string;
  examSeason: "summer" | "winter";

  // Step 2 - Current Scores
  currentLanguageScore: number;
  currentOrganizationScore: number;
  currentContentScore: number;

  // Step 3 - Language Dimension
  languageElements: {
    legalTerms: boolean;
    termConsistency: boolean;
    grammarSyntax: boolean;
  };
  languageExamples: string;

  // Step 4 - Organization Dimension
  organizationElements: {
    introduction: boolean;
    factPresentation: boolean;
    legalAnalysis: boolean;
    conclusion: boolean;
  };
  organizationExamples: string;

  // Step 5 - Content Dimension
  contentElements: {
    allParties: boolean;
    legislation: boolean;
    caselaw: boolean;
    relevantFacts: boolean;
  };
  missingElements: string;

  // Step 6 - Requested Scores
  requestedLanguageScore: number;
  requestedOrganizationScore: number;
  requestedContentScore: number;

  // Step 7 - Personal Notes
  additionalNotes: string;
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;