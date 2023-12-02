"use client";
import {
  Column,
  Table as ReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnDef,
  OnChangeFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useMemo } from "react";

const columnHelper = createColumnHelper<User>();

interface TableProps {
  data: User[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export default function Table({ data, filter, setFilter }: TableProps) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "checkbox",
        header: () => <input type="checkbox" />,
        cell: () => <input type="checkbox" />,
      }),
      columnHelper.accessor("name", {
        header: "Name",
      }),
      columnHelper.accessor("email", {
        header: "Age",
      }),
      columnHelper.accessor("role", {
        header: "Role",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex flex-row gap-2">
            <button className="border rounded p-1">
              <Pencil2Icon />
            </button>
            <button className="border rounded p-1 text-red-500">
              <TrashIcon />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
    globalFilterFn: "includesString",
  });

  return (
    <div>
      <table className="w-full border border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left border-b h-12 p-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b h-12">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="h-2" />
      <div className="flex items-center gap-2">
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

        {Array.from({ length: table.getPageCount() }, (_, index) => (
          <button
            key={index + 1}
            className="border rounded p-1 w-6"
            onClick={() => table.setPageIndex(index)}
          >
            {index + 1}
          </button>
        ))}

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
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
}
