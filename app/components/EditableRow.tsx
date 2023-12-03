import { Row, flexRender } from "@tanstack/react-table";
import { useState } from "react";

export default function EditableRow({ row }: { row: Row<User> }) {
  const [editMode, setEditMode] = useState(false);
  const [update, setUpdate] = useState(false);

  return (
    <tr className="border-b h-12">
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="p-4">
          {flexRender(cell.column.columnDef.cell, {
            ...cell.getContext(),
            editMode,
            setEditMode,
            update,
            setUpdate,
          })}
        </td>
      ))}
    </tr>
  );
}
