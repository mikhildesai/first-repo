import { useQuery } from "@tanstack/react-query";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  Table,
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  if (isLoading) return "Loading...";
  if (error) return "Some error occurred";

  return (
    <div className="container mx-auto p-2 mt-5 text-xl font-sans">
      <div />
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
        <h1 className="text-center text-blue-800 text-4xl">
          Sample Data into Tanstack Table
        </h1>
        <table className="table table-zebra w-full border-8 border-indigo-600 mt-5 ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border border-indigo-600">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="border-r border-indigo-600 text-lg"
                    >
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

                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
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
              <tr key={row.id} className="border border-indigo-600">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-r border-indigo-600">
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

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-16 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-16 h-8 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-48 h-8 border shadow rounded"
    />
  );
}
export default Table;
