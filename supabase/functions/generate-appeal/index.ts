import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { formData } = await req.json();
    console.log('Generating appeal with data:', formData);

    // Get the instruction template for this task type
    const { data: template, error: templateError } = await supabase
      .from('gpt_instructions')
      .select('content')
      .eq('task_type', formData.taskType)
      .eq('is_active', true)
      .single();

    if (templateError) {
      throw new Error(`Error fetching template: ${templateError.message}`);
    }

    if (!template) {
      throw new Error('No active template found for this task type');
    }

    // Replace placeholders in the template with actual values
    const processedTemplate = template.content
      .replace('{{fullName}}', formData.fullName)
      .replace('{{languageScore}}', formData.languageScore)
      .replace('{{organizationScore}}', formData.organizationScore)
      .replace('{{contentScore}}', formData.contentScore)
      .replace('{{finalScore}}', formData.finalScore)
      .replace('{{languageExamples}}', formData.languageExamples || 'לא צוינו דוגמאות ספציפיות')
      .replace('{{organizationExamples}}', formData.organizationExamples || 'לא צוינו דוגמאות ספציפיות')
      .replace('{{contentExamples}}', formData.contentExamples || 'לא צוינו דוגמאות ספציפיות')
      .replace('{{additionalNotes}}', formData.additionalNotes || 'אין הערות נוספות');

    console.log('Using processed template:', processedTemplate);

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
            role: 'developer',
            content: `אתה עורך דין בכיר המתמחה בכתיבת עררים על מטלות כתיבה בבחינת לשכת עורכי הדין. 
            תפקידך לנסח ערר מקצועי, מנומק ומשכנע תוך שימוש בשפה משפטית מדויקת.
            
            הנחיות חשובות:
            1. יש להתייחס לכל אחד מהממדים (לשון, ארגון ותוכן) בנפרד ובפירוט
            2. יש לבסס כל טענה על דוגמאות ספציפיות מהמטלה
            3. יש להשתמש בשפה משפטית מקצועית ומדויקת
            4. יש לשמור על מבנה לוגי וברור
            5. יש להתייחס לציונים שניתנו ולהסביר מדוע הם אינם משקפים את רמת הכתיבה האמיתית
            6. יש לסכם בצורה משכנעת מדוע יש להעלות את הציון`
          },
          { 
            role: 'user', 
            content: processedTemplate 
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    console.log('OpenAI API Response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    const generatedAppeal = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedAppeal }), {
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