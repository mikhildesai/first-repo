import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import axios from "axios";
import React from "react";

type Todo = {
  userId: number;
  title: string;
  id: number;
  completed: boolean;
};

export type PaginationTableState = {
  pagination: PaginationState;
};

export type PaginationState = {
  pageIndex: 0;
  pageSize: 10;
};

const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: "userId",
    cell: (info) => info.getValue(),
    header: () => "User Id",
  },
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    header: () => "Id",
  },
  {
    accessorKey: "title",
    cell: (info) => info.getValue(),
    header: () => "Title",
  },
  {
    accessorKey: "completed",
    cell: (info) => `${info.getValue()}`,
    header: () => "Completed",
  },
];

function Table() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getTodos = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/"
    );
    console.log(response.data);

    if (response) {
      return response.data;
    }
  };

  const { isLoading, data, error } = useQuery(["getTodos"], getTodos);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  if (isLoading) return "Loading...";
  if (error) return "Some error occurred";

  return (
    <div className="container mx-auto p-2 mt-5 text-xl font-sans border-2">
      <div className="container h-8 " />
      <div className="flex items-center justify-end gap-2 ml-5 mb-5">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>

        <select
          className="p-3"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>
        <table className="table table-border w-full table-zebra mt-5 ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
