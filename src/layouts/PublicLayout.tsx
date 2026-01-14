import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LogOut, 
  Home, 
  ChevronRight,
  Sparkles,
  Users,
  Calendar,
  Award,
  Image as ImageIcon,
  Bell,
  CreditCard,
  Settings,
  FileText,
  Shield,
  Loader2,
  User,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const menu = [
  { label: "Overview", path: "/dashboard/public", icon: BarChart3 },
  { label: "My Profile", path: "/dashboard/public/profile", icon: User },
  { label: "Membership Status", path: "/dashboard/public/membership", icon: Shield },
  { label: "Events", path: "/dashboard/public/events", icon: Calendar },
  { label: "Certificates", path: "/dashboard/public/certificates", icon: Award },
  { label: "Gallery", path: "/dashboard/public/gallery", icon: ImageIcon },
  { label: "Notifications", path: "/dashboard/public/notifications", icon: Bell },
  { label: "Payments / Receipts", path: "/dashboard/public/payments", icon: CreditCard },
  { label: "Settings", path: "/dashboard/public/settings", icon: Settings },
];

const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.pop()?.replace(/-/g, ' ') || 'Overview';

  return (
    <div className="flex min-h-screen bg-[#09090b] text-slate-200 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 flex-none flex flex-col border-r border-white/5 bg-[#0c0c0e]">
        {/* Brand Header */}
        <div className="flex-none flex h-20 items-center px-6 border-b border-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_0_20px_rgba(var(--primary),0.15)]">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                ISTE Portal
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/80 leading-none mt-0.5">
                Student Portal
              </span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                {userData?.avatar_url ? (
                  <img 
                    src={userData.avatar_url} 
                    alt="Profile" 
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0c0c0e]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">
                {userData?.full_name || 'Student User'}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {userData?.student_id || 'ISTE Member'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          <div>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/30 mb-4">
              Main Menu
            </p>
            <nav className="space-y-1.5">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
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

          {/* Quick Stats */}
          <div className="mt-8 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/30 mb-3">
              Quick Stats
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Events Attended</span>
                <span className="font-medium text-emerald-400">12</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Certificates</span>
                <span className="font-medium text-primary">5</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Member Since</span>
                <span className="font-medium text-blue-400">2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-4 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent">
          {/* Connection Status */}
          <div className="mb-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secure Session</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              End-to-end encrypted
            </p>
          </div>

          {/* Actions */}
          <nav className="space-y-1">
            <button
              onClick={() => navigate('/')}
              className="group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all duration-200"
            >
              <Home className="h-[18px] w-[18px] group-hover:scale-105 transition-transform" />
              <span>Public Site</span>
            </button>
            
            <button
              onClick={logout}
              disabled={loading}
              className="group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <LogOut className="h-[18px] w-[18px] group-hover:-translate-x-0.5 transition-transform" />
              )}
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Content Header */}
        <div className="flex-none px-8 py-6 border-b border-white/5 bg-gradient-to-r from-[#0c0c0e] to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-2">
                <button 
                  onClick={() => navigate('/dashboard/public')}
                  className="hover:text-primary transition-colors duration-200 hover:underline underline-offset-4"
                >
                  Dashboard
                </button>
                <ChevronRight className="h-3 w-3 opacity-30" />
                <span className="text-white/90 font-medium capitalize">
                  {currentPage}
                </span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Badge */}
              <button className="relative p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/[0.03] transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium">{userData?.full_name?.split(' ')[0] || 'Student'}</p>
                      <p className="text-xs text-muted-foreground">Student Account</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/dashboard/public/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/public/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-blue-500/3 blur-[100px] pointer-events-none" />

          {/* Content Container */}
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10 py-6 min-h-full">
            <div className="relative flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Outlet />
            </div>

            {/* Footer */}
            <footer className="mt-20 pb-8 pt-6 border-t border-white/5">
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
                    <span>Student Portal Active</span>
                  </div>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="font-mono">v1.0.0</span>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-primary/60">Student</span>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

// Add these missing components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default PublicLayout;