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

export const useAppealsList = (itemsPerPage: number = 10) => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const loadAppeals = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('exam_appeals')
        .select('*');

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      // Get total count of filtered results
      const { count: filteredCount } = await query.count();
      setTotalCount(filteredCount || 0);

      // Then fetch the paginated data with the same filters
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

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
  }, [currentPage, pageSize, searchQuery]); // Added searchQuery as dependency

  return { 
    appeals, 
    isLoading, 
    deleteAppeal, 
    updateAppeal,
    totalCount,
    currentPage,
    setCurrentPage,
    setPageSize,
    itemsPerPage: pageSize,
    searchQuery,
    setSearchQuery
  };
};