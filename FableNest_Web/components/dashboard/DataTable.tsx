import React, { useState, useMemo, useEffect } from "react";
import DashboardPageHeaderTitle from "./DashboardPageHeaderTitle";
import Pagination from "../Pagination";

// Type definitions
interface Column<T> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchFields?: string[]; // Fields to search in when using internal filtering
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  onRowClick,
  selectable = false,
  onSelectionChange,
  title,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  searchFields,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Handle debounced search - either internal filtering or external callback
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  // Handle search input change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter data based on search query (internal filtering mode)
  const filteredData = useMemo(() => {
    if (
      !searchable ||
      !debouncedSearchQuery.trim() ||
      !searchFields ||
      onSearch
    ) {
      return data; // Return original data if external search is used
    }

    const query = debouncedSearchQuery.toLowerCase();
    return data.filter((row) =>
      searchFields.some((field) => {
        const value = row[field];
        return value && value.toString().toLowerCase().includes(query);
      })
    );
  }, [data, debouncedSearchQuery, searchable, searchFields, onSearch]);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination]);

  // Handle row selection
  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);

    if (onSelectionChange) {
      const selected = Array.from(newSelected).map((i) => paginatedData[i]);
      onSelectionChange(selected);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allIndexes = new Set(paginatedData.map((_, i) => i));
      setSelectedRows(allIndexes);
      onSelectionChange?.(paginatedData);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  if (loading) {
    return (
      <TableSkeleton
        columns={columns.length}
        rows={pagination?.pageSize || 10}
        selectable={selectable}
        hasHeader={true}
        hasPagination={!!pagination}
        hasTitle={!!title}
        hasSearch={searchable}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with title and search */}
      {(title || searchable) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {title && <DashboardPageHeaderTitle title={title} />}

          {searchable && (
            <div className="w-full sm:w-auto">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="block w-full pl-10 pr-10 py-2.5 border-[0.5px] border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#73B7FF] focus:border-[#73B7FF] transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {!onSearch && searchFields && searchQuery && (
                <p className="mt-2 text-sm text-gray-500">
                  Found {filteredData.length} result
                  {filteredData.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-2xl bg-white hover:shadow-md transition-all duration-200 c-drop-shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#73B7FF]">
              {selectable && (
                <th className="px-6 py-4 text-left rounded-tl-2xl">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-white font-normal text-base ${
                    column.sortable
                      ? "cursor-pointer select-none hover:bg-blue-400 transition-colors"
                      : ""
                  } ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                      ? "text-right"
                      : ""
                  } ${!selectable && index === 0 ? "rounded-tl-2xl" : ""} ${
                    index === columns.length - 1 ? "rounded-tr-2xl" : ""
                  }`}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable && handleSort(column.key)}>
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b last:border-b-0 border-gray-200 transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  } ${rowIndex % 1 === 0 ? "bg-white" : "bg-gray-50"}`}
                  onClick={() => onRowClick?.(row, rowIndex)}>
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(rowIndex);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-gray-700 ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : ""
                      }`}>
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg
                      className="h-12 w-12 mb-4 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium mb-1">No data found</p>
                    {debouncedSearchQuery && (
                      <p className="text-sm">
                        No results for &quot;{debouncedSearchQuery}&quot;. Try a
                        different search term.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination && (
          <Pagination
            totalItems={sortedData.length} // Use sortedData.length instead of pagination.length
            initialPage={pagination.currentPage}
            initialItemsPerPage={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
}

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  selectable?: boolean;
  hasHeader?: boolean;
  hasPagination?: boolean;
  hasTitle?: boolean;
  hasSearch?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 5,
  rows = 10,
  selectable = false,
  hasHeader = true,
  hasPagination = true,
  hasTitle = false,
  hasSearch = false,
}) => {
  // Generate column indices
  const columnIndices = Array.from({ length: columns }, (_, i) => i);
  const rowIndices = Array.from({ length: rows }, (_, i) => i);

  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      {(hasTitle || hasSearch) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {hasTitle && (
            <div className="flex items-center">
              <div className="h-8 w-48 bg-gray-200 rounded-lg" />
            </div>
          )}

          {hasSearch && (
            <div className="w-full sm:w-auto">
              <div className="relative max-w-md">
                <div className="h-11 bg-gray-200 rounded-full w-full" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table skeleton */}
      <div className="w-full overflow-x-auto rounded-2xl bg-white c-drop-shadow">
        <table className="w-full border-collapse">
          {/* Table header skeleton */}
          {hasHeader && (
            <thead>
              <tr className="bg-[#73B7FF]">
                {selectable && (
                  <th className="px-6 py-4 text-left rounded-tl-2xl">
                    <div className="h-4 w-4 bg-blue-300 rounded" />
                  </th>
                )}
                {columnIndices.map((colIndex) => (
                  <th
                    key={colIndex}
                    className={`px-6 py-4 ${
                      !selectable && colIndex === 0 ? "rounded-tl-2xl" : ""
                    } ${colIndex === columns - 1 ? "rounded-tr-2xl" : ""}`}>
                    <div className="h-5 bg-blue-300 rounded w-3/4" />
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Table body skeleton */}
          <tbody>
            {rowIndices.map((rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b last:border-b-0 border-gray-200 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}>
                {selectable && (
                  <td className="px-6 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded" />
                  </td>
                )}
                {columnIndices.map((colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div
                      className={`h-4 bg-gray-200 rounded ${
                        colIndex % 3 === 0
                          ? "w-3/4"
                          : colIndex % 3 === 1
                          ? "w-1/2"
                          : "w-5/6"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination skeleton */}
        {hasPagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="mb-4 sm:mb-0">
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-gray-200 rounded-lg" />
              <div className="h-10 w-24 bg-gray-200 rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
