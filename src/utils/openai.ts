import { FormData } from "@/components/AppealForm/types";

export const generateAppealText = async (formData: FormData) => {
  const prompt = `
    נא לכתוב ערר על בחינת לשכת עורכי הדין עבור התלמיד/ה ${formData.fullName}.
    
    ציונים נוכחיים:
    - ממד הלשון: ${formData.currentLanguageScore}
    - ממד הארגון: ${formData.currentOrganizationScore}
    - ממד התוכן: ${formData.currentContentScore}
    
    טענות בממד הלשון:
    ${formData.languageExamples}
    
    טענות בממד הארגון:
    ${formData.organizationExamples}
    
    טענות בממד התוכן:
    ${formData.contentExamples}
    
    הערות נוספות:
    ${formData.additionalNotes}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional legal writer specializing in writing appeals for the Israeli Bar Association exam writing task. Respond in Hebrew.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error generating appeal');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating appeal:', error);
    throw error;
  }
};
