import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="p-4 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}