"use client";

import { useState } from "react";
import Table from "./components/Table";

export default function Dashboard({ users }: { users: User[] }) {
  const [filter, setFilter] = useState("");
  return (
    <main className="flex min-h-screen flex-col p-12">
      <header className="m-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="search"
          className="border rounded p-1"
        />
      </header>
      <Table users={users} filter={filter} setFilter={setFilter} />
    </main>
  );
}
