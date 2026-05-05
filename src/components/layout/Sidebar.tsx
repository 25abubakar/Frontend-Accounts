import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { navItems } from '../../config/menuConfig';

interface SidebarProps {
  themeColor: string;
}

export default function Sidebar({ themeColor }: SidebarProps) {
  const [openMenuTitle, setOpenMenuTitle] = useState<string | null>("Accounts & Groups"); 

  const toggleMenu = (title: string) => {
    setOpenMenuTitle(openMenuTitle === title ? null : title);
  };

  return (
    <aside className="w-full bg-slate-50 h-screen border-r border-gray-200 flex flex-col overflow-y-auto sticky top-0 shrink-0 custom-scrollbar">
      
      {/* Legacy Logo Section */}
      <div className="p-4 flex justify-center border-b bg-white shadow-sm shrink-0">
        <img 
          src="/download.png" 
          alt="Logo" 
          className="h-20 w-auto object-contain hover:scale-105 transition-transform duration-300" 
        />
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 mt-4 px-2 space-y-1 pb-4">
        {navItems.map((item) => {
          const isOpen = openMenuTitle === item.name;
          const hasDropdown = item.children && item.children.length > 0;
          const Icon = item.icon;

          return (
            <div key={item.name}>
              {hasDropdown ? (
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group 
                    ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isOpen ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'} />
                    <span>{item.name}</span>
                  </div>
                  <div className={isOpen ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </button>
              ) : (
                <NavLink
                  to={item.path!}
                  className={({ isActive }) => `
                    w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? `${themeColor} text-white shadow-md` 
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              )}

              {/* DROPDOWN SUB-ITEMS */}
              {hasDropdown && isOpen && (
                <div className="ml-9 mt-1 space-y-1 border-l-2 border-blue-400 animate-in slide-in-from-top-1 duration-200">
                  {item.children?.map((sub) => (
                    <NavLink 
                      key={sub.name} 
                      to={sub.path}
                      className={({ isActive }) => `
                        block w-full text-left px-3 py-2 text-xs font-medium transition-all rounded-r-md
                        ${isActive 
                          ? "text-blue-600 bg-blue-100/50 font-bold border-l-2 border-blue-600 -ml-[2px]" 
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}
                      `}
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}