import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import data from "./data1.json";
import './app.css'; // Importing CSS for styling

const App = () => {
  const [pageSize, setPageSize] = useState(5); // Default rows per page
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // Track the expanded row

  // Define table columns
  const columns: ColumnDef<typeof data[0]>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "age", header: "Age" },
  ];

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Paginated data
  const paginatedRows = table.getRowModel().rows.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const totalPages = Math.ceil(data.length / pageSize);

  const handleRowClick = (rowId: number) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId));
  };

  return (
    <div className="container">
      <h1 className="title">TanStack Table with Expandable Rows</h1>

      {/* Page Size Selector */}
      <div className="page-size-selector">
        Rows per page:{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(0); // Reset to first page
          }}
        >
          {[5, 10, 15, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>{header.isPlaceholder ? null : header.column.columnDef.header}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {paginatedRows.map((row) => (
            <React.Fragment key={row.id}>
              <tr
                onClick={() => handleRowClick(row.original.id)}
                className={`table-row ${expandedRow === row.original.id ? 'expanded' : ''}`}
              >
                <td>
                  <span className="expand-icon">
                    {expandedRow === row.original.id ? "▲" : "▼"}
                  </span>
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{cell.getValue()}</td>
                ))}
              </tr>

              {expandedRow === row.original.id && row.original.subordinates && (
                <tr className="subordinate-row">
                  <td colSpan={columns.length + 1}>
                    <table className="subordinates-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Age</th>
                        </tr>
                      </thead>
                      <tbody>
                        {row.original.subordinates.map((subordinate) => (
                          <tr key={subordinate.id}>
                            <td>{subordinate.id}</td>
                            <td>{subordinate.firstName}</td>
                            <td>{subordinate.lastName}</td>
                            <td>{subordinate.age}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
