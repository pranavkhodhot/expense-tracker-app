import Dashboard from "./Dashboard/Dashboard";
import Sidebar from "./Sidebar/Sidebar";

export default function Home() {
  return (
    <main className="flex flex-row h-full">
      <Sidebar/>
      <Dashboard/>
    </main>
  );
}
