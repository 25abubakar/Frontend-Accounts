import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuApi, type ApiMenuItem } from '../../api/menuApi';
import AddMenuModal from './AddMenuModal';

// Import all the icons you might use
import {
  LayoutDashboard, Users, Settings, Briefcase, LineChart, Shield, BarChart3, Circle,
} from "lucide-react";

// Map the string names to actual components
const IconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Settings, Briefcase, LineChart, Shield, BarChart3,
};

const getIcon = (iconName?: string | null) => {
  if (!iconName) return Circle;
  const matchedKey = Object.keys(IconMap).find((k) => k.toLowerCase() === iconName.toLowerCase());
  return matchedKey ? IconMap[matchedKey] : Circle;
};

interface SidebarProps {
  themeColor: string;
  onNavClick?: () => void;
}

export default function Sidebar({ themeColor, onNavClick }: SidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Add Menu Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Moved fetchMenu into a useCallback so we can trigger it manually after adding a menu
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const data = await menuApi.getSidebarTree(); 
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load dynamic sidebar menu", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🌟 Fetch on mount AND listen for the global update event
  useEffect(() => {
    // 1. Fetch immediately on load
    fetchMenu();

    // 2. Listen for the "shout" from MenuManager or AddMenuModal
    window.addEventListener('navigation-updated', fetchMenu);

    // 3. Cleanup the listener if the component unmounts
    return () => {
      window.removeEventListener('navigation-updated', fetchMenu);
    };
  }, [fetchMenu]);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <aside className="w-full bg-white h-full border-r border-slate-100 flex flex-col overflow-hidden">
      
      {/* Logo */}
      <div className="px-4 py-3 flex items-center justify-center border-b border-slate-100 shrink-0 relative z-20 bg-white">
        <img src="/1.png" alt="Logo" className="h-14 w-auto object-contain transition-transform duration-500 hover:scale-105" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1 relative z-10">
        {loading && (
          <div className="flex justify-center items-center py-10">
             <Loader2 className="animate-spin text-slate-300" size={24} />
          </div>
        )}

        {!loading && Array.isArray(menuItems) && menuItems.map((item) => {
          const isOpen = openMenuId === item.id;
          const hasDropdown = item.children && item.children.length > 0;
          const Icon = getIcon(item.icon);

          return (
            <div key={item.id} className="flex flex-col">
              {hasDropdown ? (
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ease-out group relative overflow-hidden
                    ${isOpen ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-500/10' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-3 relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1">
                    <Icon size={17} className={`transition-transform duration-300 ease-out group-hover:scale-110 ${isOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.title}</span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? -180 : 0 }} transition={{ duration: 0.4 }} className={`relative z-10 ${isOpen ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-500'}`}>
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </motion.div>
                </button>
              ) : (
                <NavLink
                  to={item.route || "#"}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ease-out group relative overflow-hidden
                    ${isActive ? `${themeColor} text-white shadow-md ring-1 ring-black/5` : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:shadow-sm'}`
                  }
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-3 relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1">
                      <Icon size={17} className={`transition-transform duration-300 ease-out group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>{item.title}</span>
                    </div>
                  )}
                </NavLink>
              )}

              <AnimatePresence initial={false}>
                {hasDropdown && isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="ml-7 mt-1.5 mb-2 space-y-1 border-l-2 border-slate-100/80 pl-2.5 py-0.5">
                      {item.children?.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={sub.route || "#"}
                          onClick={onNavClick}
                          className={({ isActive }) =>
                            `block w-full px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ease-out group relative
                            ${isActive ? 'text-blue-600 bg-blue-50/80 font-bold shadow-sm ring-1 ring-blue-500/10' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`
                          }
                        >
                          {({ isActive }) => (
                            <div className="flex items-center gap-2 transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                              <div className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-500 scale-100 opacity-100' : 'bg-slate-300 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} />
                              {sub.title}
                            </div>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Temporary Admin Action: Add Menu Button */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-200 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus size={16} strokeWidth={3} />
          Add Menu Item
        </button>
      </div>

      {/* Mount the Modal Component */}
      <AddMenuModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => {
          // You don't strictly need this fetchMenu here anymore because the 
          // custom event listener handles it, but keeping it is completely fine!
          fetchMenu();
        }} 
      />
    </aside>
  );
}