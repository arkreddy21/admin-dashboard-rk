"use client";

type user = {
  "id": string;
  "name": string;
  "email": string;
  "role": string;
}

export default function Dashboard({users}: {users: user[]}) {
  
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {users.map((user) => (
        <div key={user.id} className="p-2 m-2 bg-slate-100">
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </main>
  );
}
