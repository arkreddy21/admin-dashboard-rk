"use client";

import Table from "./components/Table";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Dashboard({ users }: { users: User[] }) {
  return (
    <main className="flex min-h-screen flex-col p-12">
      <header className="m-4">
        <input type="text" placeholder="search" className="border"/>
      </header>
      <Table data={users} />
    </main>
  );
}
