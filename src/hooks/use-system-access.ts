import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SystemAccess {
  is_open: boolean;
  closed_message: string;
}

export const useSystemAccess = () => {
  return useQuery({
    queryKey: ["system_access"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "system_access")
        .single();

      if (error) throw error;
      
      // Type assertion after validating the shape
      const value = data?.value as unknown;
      if (
        typeof value === "object" && 
        value !== null && 
        "is_open" in value && 
        "closed_message" in value && 
        typeof value.is_open === "boolean" && 
        typeof value.closed_message === "string"
      ) {
        return value as SystemAccess;
      }
      
      // Return default values if data is not in expected format
      return {
        is_open: true,
        closed_message: "המערכת אינה זמינה כרגע"
      };
    },
  });
};