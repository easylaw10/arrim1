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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { email } = await req.json();
    console.log("Processing verification request for email:", email);

    // Check if there's already a verified email with an appeal
    const { data: existingAppeal, error: appealError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('verified', true)
      .eq('appeal_submitted', true)
      .single();

    if (appealError) {
      console.log("Error checking existing appeal:", appealError);
    }

    if (existingAppeal) {
      console.log("Found existing appeal for email:", email);
      return new Response(
        JSON.stringify({ error: "כבר הגשת ערר בעבר" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const verificationCode = generateVerificationCode();
    console.log("Generated verification code for email:", email);

    // Store the verification code with expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiration

    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert({
        email,
        verification_code: verificationCode,
        expires_at: expiresAt.toISOString(),
        verified: false,
        appeal_submitted: false,
      });

    if (insertError) {
      console.error("Error inserting verification code:", insertError);
      throw new Error("Failed to store verification code");
    }

    // Send verification email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
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
          <div dir="rtl" style="font-family: Arial, sans-serif;">
            <h2 style="color: #2563eb;">קוד האימות שלך</h2>
            <p>שלום,</p>
            <p>קוד האימות שלך הוא: <strong style="font-size: 1.2em; color: #2563eb;">${verificationCode}</strong></p>
            <p>הקוד תקף ל-15 דקות.</p>
            <p>אם לא ביקשת קוד אימות, אנא התעלם מהודעה זו.</p>
            <hr style="margin: 20px 0;" />
            <p style="color: #6b7280; font-size: 0.9em;">הודעה זו נשלחה באופן אוטומטי, נא לא להשיב.</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ message: "Verification code sent successfully" }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in send-verification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unknown error occurred",
        details: error
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);