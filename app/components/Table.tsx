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
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: EditableCell,
      }),
      columnHelper.accessor("email", {
        header: "Age",
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
          {table.getRowModel().rows.map((row) => (
            <EditableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>

      <div className="mt-4 px-2 flex flex-row justify-between">
        <div>
          {Object.keys(rowSelection).length} of{" "}
          {table.getPreFilteredRowModel().rows.length} row(s) selected
        </div>
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
    </div>
  );
}
