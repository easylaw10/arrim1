import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppealsList } from "../useAppealsList";
import { AppealsTable } from "./AppealsTable";
import { ExportButton } from "./ExportButton";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { Appeal } from "../useAppealsList";

export const AppealsList = () => {
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const {
    appeals,
    isLoading,
    deleteAppeal,
    updateAppeal,
    totalCount,
    currentPage,
    setCurrentPage,
    setPageSize,
  } = useAppealsList(parseInt(itemsPerPage));

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

  const totalPages = Math.ceil(totalCount / parseInt(itemsPerPage));

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
        <div className="flex justify-between items-center">
          <CardTitle>רשימת עררים</CardTitle>
          <ExportButton appeals={filteredAppeals} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TableFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
            onDateRangeChange={handleDateRangeChange}
          />
          <AppealsTable
            appeals={filteredAppeals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingAppeal={editingAppeal}
            editForm={editForm}
            setEditForm={setEditForm}
            handleUpdate={handleUpdate}
          />
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={parseInt(itemsPerPage)}
            totalCount={totalCount}
            filteredCount={filteredAppeals.length}
          />
        </div>
      </CardContent>
    </Card>
  );
};