import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SystemAccess {
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
      return data?.value as SystemAccess;
    },
  });
};