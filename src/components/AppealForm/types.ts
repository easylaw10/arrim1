export type FormData = {
  task: 1 | 2;
  // Step 1 - Current Scores
  currentLanguageScore: number;
  currentOrganizationScore: number;
  currentContentScore: number;
  finalExamScore: number;

  // Step 2 - Language Dimension
  languageElements: {
    legalTerms: boolean;
    termConsistency: boolean;
    grammarSyntax: boolean;
  };
  languageExamples: string;

  // Step 3 - Organization Dimension
  organizationElements: {
    introduction: boolean;
    factPresentation: boolean;
    legalAnalysis: boolean;
    conclusion: boolean;
  };
  organizationExamples: string;

  // Step 4 - Content Dimension
  contentElements: {
    allParties: boolean;
    legislation: boolean;
    caselaw: boolean;
    relevantFacts: boolean;
  };
  contentExamples: string;

  // Step 5 - Personal Details
  fullName: string;
  phone: string;
  email: string;

  // Step 6 - Additional Notes
  additionalNotes: string;
};

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;