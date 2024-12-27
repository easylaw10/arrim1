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
      
      const value = data?.value;
      
      // Type guard function to check if the value matches SystemAccess interface
      const isSystemAccess = (val: unknown): val is SystemAccess => {
        return (
          typeof val === "object" &&
          val !== null &&
          "is_open" in val &&
          "closed_message" in val &&
          typeof (val as SystemAccess).is_open === "boolean" &&
          typeof (val as SystemAccess).closed_message === "string"
        );
      };

      if (value && isSystemAccess(value)) {
        return value;
      }
      
      // Fallback to default values
      return {
        is_open: true,
        closed_message: "המערכת סגורה זמנית. אנא חזור מאוחר יותר או צור קשר עם התמיכה."
      };
    },
  });
};