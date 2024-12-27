import { supabase } from '@/integrations/supabase/client';

export const cleanupOldCodes = async (phone: string) => {
  try {
    await supabase
      .from('verification_codes')
      .delete()
      .eq('contact', phone)
      .eq('verified', false);

    await supabase
      .from('verification_codes')
      .delete()
      .eq('contact', phone)
      .lt('expires_at', new Date().toISOString());
  } catch (error) {
    console.error('Error cleaning up old codes:', error);
  }
};

export const checkExistingVerification = async (phone: string) => {
  try {
    const { data } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('contact', phone)
      .eq('verified', true)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('Error checking existing verification:', error);
    return false;
  }
};

export const verifyCode = async (phone: string, code: string) => {
  const { data, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('contact', phone)
    .eq('verification_code', code)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { error: updateError } = await supabase
    .from('verification_codes')
    .update({ verified: true })
    .eq('id', data.id);

  if (updateError) throw updateError;
  return data;
};