import { Outlet, NavLink } from "react-router-dom";
import { 
  LogOut, 
  ShieldCheck, 
  Zap, 
  ChevronRight
} from "lucide-react";
import { dashboardMenus } from "@/config/dashboardMenus";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const ExecomLayout = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#09090b] text-slate-200">
      {/* SIDEBAR - Fixed with independent scrollbar */}
      <aside className="fixed lg:sticky top-0 left-0 z-40 h-screen w-72 flex-col border-r border-white/5 bg-[#0c0c0e] p-6 hidden lg:flex">
        
        {/* Header Section - Fixed */}
        <div className="flex-shrink-0 mb-8 px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tighter text-white uppercase">
                Execom <span className="text-primary">Core</span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
                Administrative Unit
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION - Scrollable Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-thin pr-2">
          <nav className="space-y-1 pb-4">
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-4">
              Management Tools
            </p>
            
            {dashboardMenus.execom.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ease-out",
                    "hover:bg-white/[0.03]",
                    isActive 
                      ? "bg-white/[0.05] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                      : "text-slate-400"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Glowing Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)]" />
                    )}
                    
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "text-primary scale-110" : "group-hover:text-slate-200"
                    )} />
                    
                    <span className="flex-1 text-sm font-medium tracking-tight">
                      {item.label}
                    </span>

                    {/* Hidden arrow that slides in on hover */}
                    <ChevronRight className={cn(
                      "h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300",
                      "group-hover:opacity-100 group-hover:translate-x-0",
                      isActive && "text-primary/50"
                    )} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* FOOTER - Fixed at bottom of sidebar */}
        <div className="flex-shrink-0 pt-6 border-t border-white/5 mt-4">
          <button
            onClick={signOut}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/5 hover:text-red-400"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 group-hover:bg-red-500/10 transition-colors">
              <LogOut size={18} />
            </div>
            Logout Session
          </button>
          
          {/* Subtle System Info */}
          <div className="mt-4 px-2 flex items-center gap-2 opacity-30">
            <Zap size={12} />
            <span className="text-[10px] uppercase tracking-tighter">
              v2.4.0 High-Security Node
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - Independent scrollable area */}
      <main className="flex-1 h-screen overflow-hidden bg-[#09090b]">
        {/* Content wrapper with independent scroll */}
        <div className="h-full overflow-y-auto custom-scrollbar">
          {/* Subtle top-right glow decoration */}
          <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-primary/5 blur-[120px] pointer-events-none" />
          
          <div className="min-h-full p-8 lg:p-12 relative">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExecomLayout;