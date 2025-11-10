import Dashboard from "./dashboard/page";
import Sidebar from "./Sidebar/Sidebar";

export default function Home() {
  return (
    <main className="flex flex-row h-full">
      <Sidebar />
      <Dashboard />
    </main>
  );
}
