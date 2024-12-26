import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppealsList, Appeal } from "../useAppealsList";
import { SearchInput } from "./SearchInput";
import { AppealsTable } from "./AppealsTable";

export const AppealsList = () => {
  const { appeals, isLoading, deleteAppeal, updateAppeal } = useAppealsList();
  const [editingAppeal, setEditingAppeal] = useState<Appeal | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appeal>>({});
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredAppeals = appeals.filter((appeal) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      appeal.full_name.toLowerCase().includes(searchLower) ||
      appeal.phone.toLowerCase().includes(searchLower) ||
      appeal.email.toLowerCase().includes(searchLower) ||
      appeal.language_score.toString().includes(searchQuery) ||
      appeal.organization_score.toString().includes(searchQuery) ||
      appeal.content_score.toString().includes(searchQuery) ||
      appeal.final_score.toString().includes(searchQuery)
    );
  });

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
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <AppealsTable
          appeals={filteredAppeals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editingAppeal={editingAppeal}
          editForm={editForm}
          setEditForm={setEditForm}
          handleUpdate={handleUpdate}
        />
      </CardContent>
    </Card>
  );
};