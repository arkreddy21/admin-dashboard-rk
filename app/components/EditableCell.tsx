import { CellContext } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";

interface EditableCellProps extends CellContext<User, unknown> {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
}

export default function EditableCell(props: EditableCellProps) {
  const { cell, table, row, column, editMode, update, setUpdate } = props;
  const [value, setValue] = useState(String(cell.getValue()));
  const checkFirstRender = useRef(true);

  useEffect(() => {
    if (checkFirstRender.current) {
      checkFirstRender.current = false;
      return;
    }
    if (!editMode && update) {
      setUpdate(false);
      table.options.meta?.updateData(row.index, column.id, value);
    }
    if (!editMode && !update) {
      value != cell.getValue() && setValue(String(cell.getValue()));
    }
  }, [
    editMode,
    update,
    cell,
    table.options.meta,
    row.index,
    column.id,
    setUpdate,
  ]);

  return editMode === false ? (
    <>{value}</>
  ) : (
    <input value={value} onChange={(e) => setValue(e.target.value)} className="border" />
  );
}
