import { FormData } from "@/components/AppealForm/types";

export const generateAppeal = async (formData: FormData, apiKey: string) => {
  const prompt = `תפקידך הוא לנסח ערר על מטלת כתיבה בבחינת לשכת עורכי הדין.

מידע על הנבחן:
שם: ${formData.fullName}
ת.ז.: ${formData.idNumber}

ציונים נוכחיים:
- ממד הלשון: ${formData.currentLanguageScore}
- ממד הארגון: ${formData.currentOrganizationScore}
- ממד התוכן: ${formData.currentContentScore}
- ציון סופי: ${formData.finalExamScore}

ציונים מבוקשים:
- ממד הלשון: ${formData.requestedLanguageScore}
- ממד הארגון: ${formData.requestedOrganizationScore}
- ממד התוכן: ${formData.requestedContentScore}

פירוט ממד הלשון:
אלמנטים שנכללו במטלה:
${formData.languageElements.legalTerms ? '- שימוש במונחים משפטיים' : ''}
${formData.languageElements.termConsistency ? '- עקביות במונחים' : ''}
${formData.languageElements.grammarSyntax ? '- תחביר ודקדוק תקינים' : ''}
דוגמאות ספציפיות: ${formData.languageExamples}

פירוט ממד הארגון:
אלמנטים שנכללו במטלה:
${formData.organizationElements.introduction ? '- מבוא' : ''}
${formData.organizationElements.factPresentation ? '- הצגת עובדות' : ''}
${formData.organizationElements.legalAnalysis ? '- ניתוח משפטי' : ''}
${formData.organizationElements.conclusion ? '- סיכום' : ''}
דוגמאות ספציפיות: ${formData.organizationExamples}

פירוט ממד התוכן:
אלמנטים שנכללו במטלה:
${formData.contentElements.allParties ? '- אזכור כל הצדדים' : ''}
${formData.contentElements.legislation ? '- הפניה לחקיקה' : ''}
${formData.contentElements.caselaw ? '- הפניה לפסיקה' : ''}
${formData.contentElements.relevantFacts ? '- ציון כל העובדות הרלוונטיות' : ''}
דוגמאות ספציפיות: ${formData.contentExamples}

הערות נוספות: ${formData.additionalNotes}

אנא נסח ערר מקצועי המתבסס על נתונים אלו לפי ההנחיות הבאות:

1. מבנה הערר:
- כותרת המסמך
- הקדמה קצרה המציינת את מטרת הערר
- חלוקה לשלושה חלקים לפי ממדי הבדיקה (לשון, ארגון, תוכן)
- סיכום וסעד מבוקש

2. סגנון וטון:
- שפה משפטית מקצועית
- טון מכבד ומאופק
- שימוש במונחים משפטיים מקובלים
- מספור סעיפים לפי המקובל

3. הנחיות ספציפיות:
- יש להתבסס רק על העובדות שסופקו
- יש להדגיש את הפער בין הציון שהתקבל לציון המבוקש
- יש לשלב את הדוגמאות הספציפיות שסופקו בטקסט
- יש להתייחס לכל נקודה שסומנה בתיבות הסימון

4. נוסחאות קבועות לשילוב:
- "לעניות דעתי" / "סבורני"
- "כפי שיפורט להלן"
- "על פי המחוון"
- "לאור האמור לעיל"

5. בכל ממד יש להתייחס ל:
- הקריטריונים הרלוונטיים מהמחוון
- הדוגמאות הספציפיות שסופקו
- הנימוקים לתוספת הניקוד המבוקשת

6. בסיכום:
- סיכום תמציתי של הטענות המרכזיות
- ציון ברור של הניקוד המבוקש
- נימה אישית מאופקת (אם סופקה)`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error generating appeal');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating appeal:', error);
    throw error;
  }
};