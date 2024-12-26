export type FormData = {
  task: 1 | 2; // Add task number to the form data
  contentElements: {
    allParties: boolean;
    legislation: boolean;
    caselaw: boolean;
    relevantFacts: boolean;
  };
  contentExamples: string;
  languageElements: {
    legalTerms: boolean;
    termConsistency: boolean;
    grammarSyntax: boolean;
  };
  languageExamples: string;
};
