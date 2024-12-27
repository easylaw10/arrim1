import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SystemAccess {
  is_open: boolean;
  closed_message: string;
}

export const useSystemAccess = () => {
  return useQuery<SystemAccess>({
    queryKey: ["system_access"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "system_access")
        .single();

      if (error) {
        // Return default values if there's an error
        return {
          is_open: true,
          closed_message: "המערכת סגורה זמנית. אנא חזור מאוחר יותר או צור קשר עם התמיכה."
        };
      }
      
      // Safely parse the value
      const value = data?.value;
      if (
        value && 
        typeof value === "object" && 
        "is_open" in value && 
        "closed_message" in value
      ) {
        return value as SystemAccess;
      }
      
      // Fallback to default values
      return {
        is_open: true,
        closed_message: "המערכת סגורה זמנית. אנא חזור מאוחר יותר או צור קשר עם התמיכה."
      };
    },
  });
};