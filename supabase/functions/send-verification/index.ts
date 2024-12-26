import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const SMS4FREE_API_KEY = Deno.env.get('SMS4FREE_API_KEY');
const SMS4FREE_USER = Deno.env.get('SMS4FREE_USER');
const SMS4FREE_PASSWORD = Deno.env.get('SMS4FREE_PASSWORD');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMS = async (phone: string, message: string) => {
  console.log("Starting SMS send process...");
  console.log("Phone:", phone);
  console.log("SMS4FREE credentials - User:", SMS4FREE_USER);
  console.log("API Key length:", SMS4FREE_API_KEY?.length);
  
  if (!SMS4FREE_API_KEY || !SMS4FREE_USER || !SMS4FREE_PASSWORD) {
    console.error("Missing SMS4FREE credentials:", {
      hasApiKey: !!SMS4FREE_API_KEY,
      hasUser: !!SMS4FREE_USER,
      hasPassword: !!SMS4FREE_PASSWORD
    });
    throw new Error("Missing SMS4FREE credentials");
  }

  const payload = {
    key: SMS4FREE_API_KEY,
    user: SMS4FREE_USER,
    pass: SMS4FREE_PASSWORD,
    sender: "972586799087", // עדכון המספר הקבוע ממנו יישלחו ההודעות
    recipient: phone,
    msg: message,
  };

  console.log("Sending request to SMS4FREE API...");
  console.log("Request payload:", { ...payload, pass: '[REDACTED]' });

  const response = await fetch("https://api.sms4free.co.il/ApiSMS/v2/SendSMS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("SMS API Response:", data);

  if (!response.ok || data.status <= 0) {
    console.error("SMS API Error:", {
      status: response.status,
      statusText: response.statusText,
      data
    });
    throw new Error(`SMS sending failed: ${data.message || 'Unknown error'}`);
  }

  return data;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Handler started - Method:", req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();
    console.log("Processing verification request for phone:", phone);

    const verificationCode = generateVerificationCode();
    console.log("Generated verification code:", verificationCode);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // מחיקת קודי אימות ישנים שלא אומתו
    await supabase
      .from('verification_codes')
      .delete()
      .eq('contact', phone)
      .eq('verified', false);

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

    await sendSMS(phone, `קוד האימות שלך הוא: ${verificationCode}`);

    return new Response(
      JSON.stringify({ message: "Verification code sent successfully" }),
      { 
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