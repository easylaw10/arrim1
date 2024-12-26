import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appeal } = await req.json();
    console.log('Received appeal data:', appeal);

    const prompt = `תפקידך הוא לנסח ערר על מטלת כתיבה בבחינת לשכת עורכי הדין.

מידע על הנבחן:
שם: ${appeal.fullName}
ת.ז.: ${appeal.idNumber}

ציונים נוכחיים:
- ממד הלשון: ${appeal.currentLanguageScore}
- ממד הארגון: ${appeal.currentOrganizationScore}
- ממד התוכן: ${appeal.currentContentScore}
- ציון סופי: ${appeal.finalExamScore}

פירוט ממד הלשון:
${Object.entries(appeal.languageElements)
  .filter(([_, value]) => value)
  .map(([key]) => `- ${key}`)
  .join('\n')}
דוגמאות ספציפיות: ${appeal.languageExamples}

פירוט ממד הארגון:
${Object.entries(appeal.organizationElements)
  .filter(([_, value]) => value)
  .map(([key]) => `- ${key}`)
  .join('\n')}
דוגמאות ספציפיות: ${appeal.organizationExamples}

פירוט ממד התוכן:
${Object.entries(appeal.contentElements)
  .filter(([_, value]) => value)
  .map(([key]) => `- ${key}`)
  .join('\n')}
דוגמאות ספציפיות: ${appeal.contentExamples}

הערות נוספות: ${appeal.additionalNotes}

אנא נסח ערר מקצועי בעברית המתבסס על נתונים אלו.`;

    console.log('Sending prompt to OpenAI:', prompt);

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
            content: 'אתה עורך דין מנוסה המתמחה בכתיבת עררים על מטלות כתיבה בבחינת לשכת עורכי הדין. עליך לנסח ערר מקצועי, מנומק ומשכנע.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    console.log('Received response from OpenAI');

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