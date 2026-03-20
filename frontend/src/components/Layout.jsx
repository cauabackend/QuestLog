import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="ml-16 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;