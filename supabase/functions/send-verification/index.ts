import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Check if there's already a verified email with an appeal
    const { data: existingAppeal } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('verified', true)
      .eq('appeal_submitted', true)
      .single();

    if (existingAppeal) {
      return new Response(
        JSON.stringify({ error: "כבר הגשת ערר בעבר" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const verificationCode = generateVerificationCode();

    // Store the verification code
    await supabase
      .from('email_verifications')
      .insert({
        email,
        verification_code: verificationCode,
      });

    // Send verification email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EasyLaw <verify@easylaw.io>",
        to: [email],
        subject: "קוד אימות לערר",
        html: `
          <div dir="rtl">
            <h2>קוד האימות שלך</h2>
            <p>שלום,</p>
            <p>קוד האימות שלך הוא: <strong>${verificationCode}</strong></p>
            <p>הקוד תקף ל-15 דקות.</p>
            <p>אם לא ביקשת קוד אימות, אנא התעלם מהודעה זו.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send verification email");
    }

    return new Response(
      JSON.stringify({ message: "Verification code sent successfully" }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);