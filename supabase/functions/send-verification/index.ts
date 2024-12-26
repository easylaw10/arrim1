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
  console.log("Starting SMS send process...");
  
  if (!SMS4FREE_API_KEY || !SMS4FREE_USER || !SMS4FREE_PASSWORD) {
    throw new Error("Missing SMS4FREE credentials");
  }

  const payload = {
    key: SMS4FREE_API_KEY,
    user: SMS4FREE_USER,
    pass: SMS4FREE_PASSWORD,
    sender: "0527153268",
    recipient: phone,
    msg: message,
  };

  console.log("Sending request to SMS4FREE API...");

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

    // Check for existing appeal first
    const { data: existingAppeal } = await supabase
      .from('exam_appeals')
      .select('*')
      .eq('phone', phone)
      .single();

    if (existingAppeal) {
      console.log("Found existing appeal for phone:", phone);
      return new Response(
        JSON.stringify({ error: "כבר הגשת ערר בעבר" }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          }
        }
      );
    }

    const verificationCode = generateVerificationCode();
    console.log("Generated verification code for phone:", phone);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Delete previous unverified codes
    await supabase
      .from('verification_codes')
      .delete()
      .eq('contact', phone)
      .eq('verified', false);

    // Create new verification code
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
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        }
      }
    );
  } catch (error) {
    console.error("Error in send-verification function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        }
      }
    );
  }
};

serve(handler);