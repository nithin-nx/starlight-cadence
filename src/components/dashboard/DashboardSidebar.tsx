import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Award, 
  Image, 
  Bell, 
  CreditCard, 
  Settings,
  Home,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  role: string;
  onClose?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ role, onClose }) => {
  const getNavigationItems = (role: string) => {
    const baseItems = [
      { path: '/dashboard/public', label: 'Overview', icon: LayoutDashboard },
      { path: '/dashboard/public/profile', label: 'My Profile', icon: Users },
      { path: '/dashboard/public/events', label: 'Events', icon: Calendar },
      { path: '/dashboard/public/certificates', label: 'Certificates', icon: Award },
      { path: '/dashboard/public/gallery', label: 'Gallery', icon: Image },
      { path: '/dashboard/public/notifications', label: 'Alerts', icon: Bell },
    ];

    const execomItems = [
      { path: '/dashboard/execom', label: 'Console', icon: LayoutDashboard },
      { path: '/dashboard/execom/members', label: 'Directory', icon: Users },
      { path: '/dashboard/execom/events', label: 'Management', icon: Calendar },
      { path: '/dashboard/execom/participants', label: 'Registrations', icon: FileText },
      { path: '/dashboard/execom/certificates', label: 'Issuance', icon: Award },
      { path: '/dashboard/execom/finance', label: 'Treasury', icon: CreditCard },
      { path: '/dashboard/execom/gallery', label: 'Media', icon: Image },
      { path: '/dashboard/execom/settings', label: 'System Settings', icon: Settings },
    ];

    if (['execom', 'admin', 'faculty'].includes(role)) return execomItems;
    if (role === 'treasurer') {
      return execomItems.filter(item => ['Console', 'Treasury', 'System Settings'].includes(item.label));
    }
    return baseItems;
  };

  const navItems = getNavigationItems(role);

  return (
    <div className="flex h-full w-full flex-col bg-[#0c0c0e] border-r border-white/[0.05]">
      
      {/* Brand Header - Fixed at top of sidebar */}
      <div className="flex-none flex h-20 items-center px-6 border-b border-white/[0.02] bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_0_20px_rgba(var(--primary),0.15)]">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              ISTE Portal
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/80 leading-none mt-0.5">
              {role.charAt(0).toUpperCase() + role.slice(1)} Space
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation - Scrollable within sidebar only */}
      <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/30 mb-4">
            Main Menu
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out',
                    'active:scale-[0.97] outline-none focus:ring-2 focus:ring-primary/30',
                    isActive
                      ? 'bg-gradient-to-r from-primary/[0.08] to-primary/[0.02] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_12px_rgba(0,0,0,0.25)] ring-1 ring-primary/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03] hover:shadow-md'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "relative flex items-center justify-center",
                      isActive && "before:absolute before:-inset-2 before:bg-primary/10 before:blur-md before:rounded-full"
                    )}>
                      <item.icon className={cn(
                        "h-[18px] w-[18px] transition-all duration-300 relative z-10",
                        isActive ? "text-primary scale-110" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105"
                      )} />
                    </div>
                    
                    <span className="flex-1 truncate font-medium">{item.label}</span>
                    
                    {/* Active State Indicator */}
                    {isActive && (
                      <div className="absolute left-0 h-6 w-1 rounded-r-full bg-gradient-to-b from-primary to-primary/70 shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                    )}

                    <ChevronRight className={cn(
                      "h-3 w-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-40 group-hover:translate-x-0",
                      isActive && "opacity-0"
                    )} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Stats/Info Section */}
        <div className="mt-8 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/30 mb-3">
            System Status
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Uptime</span>
              <span className="font-medium text-emerald-400">99.9%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Security</span>
              <span className="flex items-center gap-1 font-medium text-blue-400">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer - Fixed at bottom of sidebar */}
      <div className="flex-none p-4 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent">
        {/* Connection Status Card */}
        <div className="mb-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Session</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            End-to-end encrypted
          </p>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group",
              isActive 
                ? "bg-white/[0.05] text-white" 
                : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
            )}
          >
            <Home className="h-[18px] w-[18px] group-hover:scale-105 transition-transform" />
            <span>Public Site</span>
          </NavLink>
          
          <button className="group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 active:scale-95">
            <div className="relative">
              <LogOut className="h-[18px] w-[18px] group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;