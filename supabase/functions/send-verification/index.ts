import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SMS4FREE_API_KEY = Deno.env.get("SMS4FREE_API_KEY");
const SMS4FREE_USER = Deno.env.get("SMS4FREE_USER");
const SMS4FREE_PASSWORD = Deno.env.get("SMS4FREE_PASSWORD");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMS = async (phone: string, message: string) => {
  console.log("Sending SMS to:", phone, "Message:", message);
  console.log("Using SMS4FREE credentials - User:", SMS4FREE_USER);
  
  if (!SMS4FREE_API_KEY || !SMS4FREE_USER || !SMS4FREE_PASSWORD) {
    throw new Error("Missing SMS4FREE credentials");
  }

  const response = await fetch("https://api.sms4free.co.il/ApiSMS/v2/SendSMS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: SMS4FREE_API_KEY,
      user: SMS4FREE_USER,
      pass: SMS4FREE_PASSWORD,
      sender: SMS4FREE_USER, // Using the registered phone as sender
      recipient: phone,
      msg: message,
    }),
  });

  const data = await response.json();
  console.log("SMS API Response:", data);

  if (data.status <= 0) {
    throw new Error(`SMS sending failed: ${data.message}`);
  }

  return data;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();
    console.log("Processing verification request for phone:", phone);

    // Check if there's already a verified phone with an appeal
    const { data: existingAppeal, error: appealError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('contact', phone)
      .eq('verified', true)
      .eq('appeal_submitted', true)
      .single();

    if (existingAppeal) {
      console.log("Found existing appeal for phone:", phone);
      return new Response(
        JSON.stringify({ error: "כבר הגשת ערר בעבר" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const verificationCode = generateVerificationCode();
    console.log("Generated verification code:", verificationCode);

    // Store the verification code with expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiration

    // Delete any existing verification codes for this phone
    await supabase
      .from('verification_codes')
      .delete()
      .eq('contact', phone)
      .eq('verified', false);

    // Insert new verification code
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        contact: phone,
        verification_code: verificationCode,
        expires_at: expiresAt.toISOString(),
        verified: false,
        appeal_submitted: false,
        verification_type: 'sms'
      });

    if (insertError) {
      console.error("Error inserting verification code:", insertError);
      throw new Error("Failed to store verification code");
    }

    // Send SMS with verification code
    await sendSMS(phone, `קוד האימות שלך הוא: ${verificationCode}`);

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
        error: error instanceof Error ? error.message : "An unknown error occurred"
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);