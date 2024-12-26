import { useState, useEffect } from 'react';
import { FormData, FormStep } from './types';

const STORAGE_KEY = 'appeal-form-draft';

const initialFormData: FormData = {
  fullName: '',
  idNumber: '',
  examDate: '',
  examSeason: 'winter',
  currentLanguageScore: 0,
  currentOrganizationScore: 0,
  currentContentScore: 0,
  languageElements: {
    legalTerms: false,
    termConsistency: false,
    grammarSyntax: false,
  },
  languageExamples: '',
  organizationElements: {
    introduction: false,
    factPresentation: false,
    legalAnalysis: false,
    conclusion: false,
  },
  organizationExamples: '',
  contentElements: {
    allParties: false,
    legislation: false,
    caselaw: false,
    relevantFacts: false,
  },
  missingElements: '',
  requestedLanguageScore: 0,
  requestedOrganizationScore: 0,
  requestedContentScore: 0,
  additionalNotes: '',
};

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  };

  return {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    previousStep,
  };
};