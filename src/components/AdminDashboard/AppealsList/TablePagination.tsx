import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalCount: number;
  filteredCount: number;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  totalCount,
  filteredCount,
}: TablePaginationProps) => {
  if (totalCount <= itemsPerPage) return null;

  return (
    <div className="mt-4">
      <Pagination dir="rtl">
        <PaginationContent className="flex-row-reverse">
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="cursor-pointer"
              aria-disabled={currentPage === 1}
            >
              הבא
            </PaginationNext>
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
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
                  className="cursor-pointer"
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className="cursor-pointer"
              aria-disabled={currentPage === totalPages}
            >
              הקודם
            </PaginationPrevious>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="text-sm text-gray-500 text-center mt-4">
        מציג {filteredCount} רשומות מתוך {totalCount} רשומות במערכת
      </div>
    </div>
  );
};