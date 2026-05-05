import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [themeColor, setThemeColor] = useState("bg-blue-600");

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden relative">
      
      {/* SIDEBAR WRAPPER */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          bg-white shadow-[0_0_40px_rgba(0,0,0,0.08)]
          transition-all duration-500 ease-in-out
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-0 lg:translate-x-0"}
        `}
      >
        <Sidebar themeColor={themeColor} />
      </aside>

      {/* MOBILE OVERLAY */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isSidebarOpen ? "opacity-100 visible lg:hidden" : "opacity-0 invisible"
        }`}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* SEPARATED NAVBAR */}
        <Navbar 
          toggleSidebar={toggleSidebar} 
          themeColor={themeColor} 
          setThemeColor={setThemeColor} 
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4 md:p-6">
          <div className="h-full w-full bg-white shadow-sm overflow-hidden">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
}