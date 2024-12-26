import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppealsList, Appeal } from "../useAppealsList";
import { SearchInput } from "./SearchInput";
import { AppealsTable } from "./AppealsTable";
import { DateRangeFilter } from "./DateRangeFilter";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const AppealsList = () => {
  const { 
    appeals, 
    isLoading, 
    deleteAppeal, 
    updateAppeal,
    totalCount,
    currentPage,
    setCurrentPage,
    itemsPerPage 
  } = useAppealsList();
  
  const [editingAppeal, setEditingAppeal] = useState<Appeal | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appeal>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleEdit = (appeal: Appeal) => {
    setEditingAppeal(appeal);
    setEditForm({
      full_name: appeal.full_name,
      phone: appeal.phone,
      email: appeal.email,
      language_score: appeal.language_score,
      organization_score: appeal.organization_score,
      content_score: appeal.content_score,
      final_score: appeal.final_score,
    });
  };

  const handleUpdate = async () => {
    if (editingAppeal && editForm) {
      await updateAppeal(editingAppeal.id, editForm);
      setEditingAppeal(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק ערר זה?")) {
      await deleteAppeal(id);
    }
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const filteredAppeals = appeals.filter((appeal) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      appeal.full_name.toLowerCase().includes(searchLower) ||
      appeal.phone.toLowerCase().includes(searchLower) ||
      appeal.email.toLowerCase().includes(searchLower) ||
      appeal.language_score.toString().includes(searchQuery) ||
      appeal.organization_score.toString().includes(searchQuery) ||
      appeal.content_score.toString().includes(searchQuery) ||
      appeal.final_score.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    if (startDate && endDate) {
      const appealDate = new Date(appeal.created_at);
      return isWithinInterval(appealDate, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      });
    }

    return true;
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>רשימת עררים</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
          <AppealsTable
            appeals={filteredAppeals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingAppeal={editingAppeal}
            editForm={editForm}
            setEditForm={setEditForm}
            handleUpdate={handleUpdate}
          />
          
          {totalCount > itemsPerPage && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <PaginationItem key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationItem>...</PaginationItem>
                        )}
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-sm text-gray-500 text-center mt-2">
                מציג {(currentPage - 1) * itemsPerPage + 1} עד {Math.min(currentPage * itemsPerPage, totalCount)} מתוך {totalCount} עררים
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};