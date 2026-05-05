import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle, Palette, Check, Menu, Lock, Info } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// --- Types ---
type ThemeOption = { name: string; bg: string; hover: string; text: string; };

const THEME_OPTIONS: ThemeOption[] = [
  { name: "Blue", bg: "bg-blue-600", hover: "hover:bg-blue-50", text: "text-blue-600" },
  { name: "Emerald", bg: "bg-emerald-600", hover: "hover:bg-emerald-50", text: "text-emerald-600" },
  { name: "Slate", bg: "bg-slate-800", hover: "hover:bg-slate-50", text: "text-slate-800" },
  { name: "Indigo", bg: "bg-indigo-600", hover: "hover:bg-indigo-50", text: "text-indigo-600" },
];

interface NavbarProps {
  toggleSidebar: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

export default function Navbar({ toggleSidebar, themeColor, setThemeColor }: NavbarProps) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className={`h-16 ${themeColor} flex items-center justify-between px-4 lg:px-8 text-white shadow-lg z-30 transition-all duration-300 shrink-0`}>
      <div className="flex items-center gap-1 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90 shrink-0"
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col select-none">
          <span className="font-black text-sm sm:text-base md:text-lg tracking-tighter uppercase italic leading-none">
            LAL Group<span className="text-white/60 font-light text-[10px] sm:text-xs ml-0.5">Portal</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        <button className="flex items-center gap-2 p-2 md:px-3 md:py-1.5 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-200/30 backdrop-blur-md text-white rounded-lg sm:rounded-xl transition-all active:scale-95 group">
          <Info size={18} className="text-blue-100 group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-bold tracking-wide hidden lg:block">Instructions</span>
        </button>

        <button className="flex items-center gap-2 p-2 md:px-3 md:py-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-200/30 backdrop-blur-md text-white rounded-lg sm:rounded-xl transition-all active:scale-95 group">
          <Lock size={18} className="text-emerald-100 group-hover:-rotate-12 transition-transform" />
          <span className="text-[11px] font-bold tracking-wide hidden lg:block">My Notes</span>
        </button>

        <div className="h-6 w-[1px] bg-white/20 mx-0.5" />

        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl border border-white/20 transition-colors"
          >
            <Palette size={18} />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-3 w-44 sm:w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.bg}
                  onClick={() => {
                    setThemeColor(option.bg);
                    setShowThemeMenu(false);
                  }}
                  className={`flex items-center justify-between w-full p-2 rounded-xl ${option.hover}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full ${option.bg} border-2 border-white shadow-sm`}></div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{option.name}</span>
                  </div>
                  {themeColor === option.bg && <Check size={14} className={option.text} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-3 pl-1 sm:pl-4 border-l border-white/20">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/40 shrink-0">
            <UserCircle size={20} />
          </div>
          
          <button onClick={handleLogout} className="p-2 hover:bg-red-500 rounded-lg sm:rounded-xl transition-all group shrink-0">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}