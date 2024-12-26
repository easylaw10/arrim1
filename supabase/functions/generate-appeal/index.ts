import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();

    const prompt = `
    אנא כתוב ערר מפורט על מטלת הכתיבה בבחינת לשכת עורכי הדין בהתבסס על המידע הבא:

    ציונים נוכחיים:
    - ממד הלשון: ${formData.languageScore}/4
    - ממד הארגון: ${formData.organizationScore}/4
    - ממד התוכן: ${formData.contentScore}/12
    - ציון סופי: ${formData.finalScore}

    טענות בממד הלשון:
    ${formData.languageExamples || 'לא צוינו דוגמאות ספציפיות'}

    טענות בממד הארגון:
    ${formData.organizationExamples || 'לא צוינו דוגמאות ספציפיות'}

    טענות בממד התוכן:
    ${formData.contentExamples || 'לא צוינו דוגמאות ספציפיות'}

    הערות נוספות:
    ${formData.additionalNotes || 'אין הערות נוספות'}

    יש לכתוב את הערר בצורה מקצועית, מנומקת ומשכנעת.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'אתה עורך דין מנוסה המתמחה בכתיבת עררים על מטלות כתיבה בבחינת לשכת עורכי הדין. תפקידך לנסח ערר מקצועי, מנומק ומשכנע.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ 
      generatedAppeal: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-appeal function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});