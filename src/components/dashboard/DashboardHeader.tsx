import React from 'react';
import { Menu, Bell, Search, Command, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  role: string;
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  role,
  onMenuClick,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.05] bg-[#09090b]/80 px-4 md:px-8 backdrop-blur-md">
      {/* Left Section: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-all active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Pro Search Bar (Hidden on mobile) */}
        <div className="hidden md:flex items-center relative max-w-sm w-full group">
          <Search className="absolute left-3 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-1.5 pl-10 pr-10 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
            <Command className="h-3 w-3 text-slate-600" />
            <span className="text-[10px] font-bold text-slate-600">K</span>
          </div>
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="group relative rounded-xl p-2.5 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-all"
        >
          <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-[#09090b] shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
        </button>

        <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

        {/* User Profile Trigger */}
        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/[0.05] transition-all group">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-xs font-semibold text-slate-200 leading-none">Account</span>
            <span className="text-[10px] font-medium text-primary uppercase tracking-wider mt-1">
              {role}
            </span>
          </div>
          
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary/20 to-cyan-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
               <User className="h-5 w-5 text-slate-300" />
            </div>
            {/* Online Status Dot */}
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#09090b]" />
          </div>
          
          <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors hidden md:block" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;