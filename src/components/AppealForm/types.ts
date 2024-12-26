export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface FormData {
  taskType: number;
  taskName?: string;
  rubricLink?: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  verificationCode?: string;
  phone: string;
  languageScore: number;
  organizationScore: number;
  contentScore: number;
  finalScore?: number;
  languageElements?: {
    legalTerms?: boolean;
    termConsistency?: boolean;
    grammarSyntax?: boolean;
  };
  organizationElements?: {
    introduction?: boolean;
    factPresentation?: boolean;
    legalAnalysis?: boolean;
    conclusion?: boolean;
  };
  contentElements?: {
    allParties?: boolean;
    legislation?: boolean;
    caselaw?: boolean;
    relevantFacts?: boolean;
  };
  languageExamples?: string;
  organizationExamples?: string;
  contentExamples?: string;
  additionalNotes?: string;
  appealText?: string;
}

export const initialFormData: FormData = {
  taskType: 1,
  fullName: "",
  email: "",
  emailVerified: false,
  phone: "",
  languageScore: 0,
  organizationScore: 0,
  contentScore: 0,
  languageElements: {
    legalTerms: false,
    termConsistency: false,
    grammarSyntax: false,
  },
  organizationElements: {
    introduction: false,
    factPresentation: false,
    legalAnalysis: false,
    conclusion: false,
  },
  contentElements: {
    allParties: false,
    legislation: false,
    caselaw: false,
    relevantFacts: false,
  },
  languageExamples: "",
  organizationExamples: "",
  contentExamples: "",
  additionalNotes: "",
  appealText: "",
};