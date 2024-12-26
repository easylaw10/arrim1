import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAppealsList = () => {
  const [appeals, setAppeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppeals = async () => {
      try {
        const { data, error } = await supabase
          .from('exam_appeals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAppeals(data || []);
      } catch (error) {
        console.error('Error loading appeals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppeals();
  }, []);

  return { appeals, isLoading };
};