"use client";

import { useState } from "react";
import Table from "./components/Table";
import { TrashIcon } from "@radix-ui/react-icons";

export default function Dashboard({ users }: { users: User[] }) {
  // global search string
  const [filter, setFilter] = useState("");
  // object with indices of selected rows as keys and "true" as values
  const [rowSelection, setRowSelection] = useState({});
  const [delSelected, setDelSelected] = useState(false);

  return (
    <main className="flex min-h-screen flex-col p-12">
      <header className="m-4 flex flex-row justify-between">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="search"
          className="border rounded p-1"
        />
        <button
          disabled={Object.keys(rowSelection).length === 0}
          className="bg-red-500 disabled:bg-red-300 text-white rounded p-2"
          onClick={() => setDelSelected(true)}
        >
          <TrashIcon />
        </button>
      </header>
      <Table
        users={users}
        filter={filter}
        setFilter={setFilter}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        delSelected={delSelected}
        setDelSelected={setDelSelected}
      />
    </main>
  );
}
