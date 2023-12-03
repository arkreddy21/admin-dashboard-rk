"use client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  RowData,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import EditableRow from "./EditableRow";
import ActionCell from "./ActionCell";
import EditableCell from "./EditableCell";
import IndeterminateCheckbox from "./IndeterminateCheckbox";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    deleteRow: (rowIndex: number) => void;
    deleteRows: (rows: {}) => void;
  }
}

const columnHelper = createColumnHelper<User>();

interface TableProps {
  users: User[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  rowSelection: {};
  setRowSelection: Dispatch<SetStateAction<{}>>;
  delSelected: boolean;
  setDelSelected: Dispatch<SetStateAction<boolean>>;
}

export default function Table({
  users,
  filter,
  setFilter,
  rowSelection,
  setRowSelection,
  delSelected,
  setDelSelected,
}: TableProps) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "checkbox",
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="select all rows"
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="select row"
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: EditableCell,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: EditableCell,
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: EditableCell,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ActionCell,
      }),
    ],
    []
  );

  const [data, setData] = useState(users);

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
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFilter,
    globalFilterFn: "includesString",
    autoResetPageIndex: false,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
          )
        );
      },
      deleteRow: (rowIndex) => {
        setData((prev) => prev.filter((_, index) => index !== rowIndex));
      },
      deleteRows: (rows: {}) => {
        setData((prev) => prev.filter((_, index) => !(index in rows)));
      },
    },
  });

  // to prevent displaying empty page when all visible rows are deleted
  useEffect(() => {
    table.getState().pagination.pageIndex + 1 > table.getPageCount() &&
      table.previousPage();
  }, [table.getPageCount()]);

  //deselect the selected rows when page changed
  useEffect(() => {
    setRowSelection({});
  }, [table.getState().pagination.pageIndex]);

  useEffect(() => {
    if (delSelected) {
      table.options.meta?.deleteRows(rowSelection);
      setDelSelected(false);
      setRowSelection({});
    }
  }, [delSelected]);

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
          {table.getRowModel().rows.map((row, index) => (
            <EditableRow
              key={row.id}
              row={row}
              selected={index in rowSelection ? true : false}
            />
          ))}
        </tbody>
      </table>

      <div className="mt-4 px-2 flex flex-row justify-between">
        <div className="flex items-center">
          {Object.keys(rowSelection).length} of{" "}
          {table.getPreFilteredRowModel().rows.length} row(s) selected
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 mr-2">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <button
            className="border rounded p-1 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="first page"
          >
            {"<<"}
          </button>
          <button
            className="border rounded p-1 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="previous page"
          >
            {"<"}
          </button>

          {Array.from({ length: table.getPageCount() }, (_, index) => (
            <button
              key={index + 1}
              className="border rounded p-1 w-8"
              onClick={() => table.setPageIndex(index)}
              aria-label={`page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="border rounded p-1 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="next page"
          >
            {">"}
          </button>
          <button
            className="border rounded p-1 w-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="last page"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
