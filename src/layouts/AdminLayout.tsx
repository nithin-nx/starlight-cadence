import { Outlet, NavLink } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  FileText, 
  CreditCard,
  LogOut,
  ChevronRight,
  Home
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const { signOut } = useAuth();

  const adminMenus = [
    { path: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/admin/users", label: "User Management", icon: Users },
    { path: "/admin/roles", label: "Role Management", icon: Shield },
    { path: "/admin/finance", label: "Finance", icon: CreditCard },
    { path: "/admin/reports", label: "Reports", icon: FileText },
    { path: "/admin/settings", label: "Admin Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">ISTE Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Administration
          </p>
          
          {adminMenus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Back to Main Site</span>
          </NavLink>
          
          <button
            onClick={signOut}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;