import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
// Add this import at the top of DashboardLayout.tsx
import { cn } from '@/lib/utils'; // or your actual path
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, loading: authLoading, role: userRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Reset mobile sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#09090b] to-[#0c0c0e]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-primary/80" />
        </div>
        <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse">
          Securing dashboard session...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.pop()?.replace(/-/g, ' ') || 'Overview';

  return (
    /* Fixed layout - no scrolling at root level */
    <div className="flex min-h-screen w-full bg-[#09090b] text-slate-200 selection:bg-primary/30 overflow-hidden">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* FIXED SIDEBAR - Never moves or scrolls */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 flex-none transform transition-all duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:flex lg:flex-col",
          "border-r border-white/5 bg-[#0c0c0e] shadow-2xl",
          sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <DashboardSidebar
          role={userRole ?? 'public'}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* MAIN CONTENT AREA - Only this scrolls */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Fixed Header */}
        <DashboardHeader
          role={userRole ?? 'public'}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* SCROLLABLE CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Background decorative elements (fixed in scroll area) */}
          <div className="fixed top-0 right-0 -z-10 h-[600px] w-[600px] bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-[120px] pointer-events-none" />
          <div className="fixed bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-blue-500/3 blur-[100px] pointer-events-none" />

          {/* Content wrapper with max width */}
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10 py-6 min-h-full">
            
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <nav className="flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                <Link 
                  to="/dashboard" 
                  className="hover:text-primary transition-colors duration-200 hover:underline underline-offset-4"
                >
                  Console
                </Link>
                <ChevronRight className="h-3 w-3 opacity-30" />
                <span className="text-white/90 font-medium capitalize">
                  {currentPage}
                </span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
              </h1>
            </div>

            {/* Page Content Area */}
            <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="rounded-2xl bg-gradient-to-br from-white/[0.02] to-black/20 border border-white/5 shadow-2xl shadow-black/20 p-6 md:p-8 backdrop-blur-sm">
                {children}
              </div>
            </div>

            {/* Footer at bottom of scrollable content */}
            <footer className="mt-16 pb-10 pt-8 border-t border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} ISTE GEC Idukki
                  </p>
                  <p className="text-[9px] text-muted-foreground/30 mt-1">
                    Government Engineering College Idukki
                  </p>
                </div>
                <div className="flex items-center gap-6 text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    </div>
                    <span>System Active</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="font-mono">v1.2.0</span>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-primary/60">{userRole}</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;