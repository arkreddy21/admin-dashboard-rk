import Dashboard from "./Dashboard";

export default async function Home() {
  const res = await fetch(
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
  );
  const users = await res.json();

  return <Dashboard users={users} />;
}
