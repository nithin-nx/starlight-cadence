import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const menu = [
  { label: "Overview", path: "/dashboard/public" },
  { label: "My Profile", path: "/dashboard/public/profile" },
  { label: "Membership Status", path: "/dashboard/public/membership" },
  { label: "Events", path: "/dashboard/public/events" },
  { label: "Certificates", path: "/dashboard/public/certificates" },
  { label: "Gallery", path: "/dashboard/public/gallery" },
  { label: "Notifications", path: "/dashboard/public/notifications" },
  { label: "Payments / Receipts", path: "/dashboard/public/payments" },
  { label: "Settings", path: "/dashboard/public/settings" },
];

const PublicLayout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border p-6">
        <h2 className="font-orbitron text-primary text-xl mb-6">
          Student Dashboard
        </h2>

        <nav className="space-y-2">
          {menu.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-10 flex items-center gap-2 text-red-400 hover:text-red-500"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
