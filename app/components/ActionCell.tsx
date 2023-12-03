import {
  Pencil2Icon,
  TrashIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { CellContext } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

interface ActionCellProps extends CellContext<User, unknown> {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
}

export default function ActionCell(props: ActionCellProps) {
  const { table, row, editMode, setEditMode, setUpdate } = props;

  return (
    <div className="flex flex-row gap-2">
      {editMode === false ? (
        <>
          <button
            className="border rounded p-1"
            aria-label="edit row"
            onClick={() => {
              setEditMode(true);
              setUpdate(false);
            }}
          >
            <Pencil2Icon />
          </button>
          <button
            className="border rounded p-1 text-red-500"
            aria-label="delete row"
            onClick={() => table.options.meta?.deleteRow(row.index)}
          >
            <TrashIcon />
          </button>
        </>
      ) : (
        <>
          <button
            className="border rounded p-1"
            aria-label="save"
            onClick={() => {
              setEditMode(false);
              setUpdate(true);
            }}
          >
            <CheckIcon />
          </button>
          <button
            className="border rounded p-1"
            aria-label="cancel"
            onClick={() => {
              setEditMode(false);
              setUpdate(false);
            }}
          >
            <Cross2Icon />
          </button>
        </>
      )}
    </div>
  );
}
