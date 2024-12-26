import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type Appeal = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string;
  language_score: number;
  organization_score: number;
  content_score: number;
  final_score: number;
};

export const useAppealsList = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const loadAppeals = async () => {
    try {
      setIsLoading(true);
      
      // First, get the total count
      const { count, error: countError } = await supabase
        .from('exam_appeals')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Then fetch the paginated data
      const { data, error } = await supabase
        .from('exam_appeals')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;
      setAppeals(data || []);
    } catch (error) {
      console.error('Error loading appeals:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת הנתונים",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAppeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exam_appeals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppeals(prev => prev.filter(appeal => appeal.id !== id));
      setTotalCount(prev => prev - 1);
      toast({
        title: "נמחק בהצלחה",
        description: "הערר נמחק מהמערכת",
      });
    } catch (error) {
      console.error('Error deleting appeal:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במחיקת הערר",
        variant: "destructive",
      });
    }
  };

  const updateAppeal = async (id: string, updates: Partial<Appeal>) => {
    try {
      const { error } = await supabase
        .from('exam_appeals')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAppeals(prev => prev.map(appeal => 
        appeal.id === id ? { ...appeal, ...updates } : appeal
      ));

      toast({
        title: "עודכן בהצלחה",
        description: "פרטי הערר עודכנו בהצלחה",
      });
    } catch (error) {
      console.error('Error updating appeal:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעדכון הערר",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadAppeals();
  }, [currentPage]); // Reload when page changes

  return { 
    appeals, 
    isLoading, 
    deleteAppeal, 
    updateAppeal,
    totalCount,
    currentPage,
    setCurrentPage,
    itemsPerPage
  };
};