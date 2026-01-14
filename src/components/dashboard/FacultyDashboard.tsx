import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Wallet,
  Calendar,
  Trash2,
  UserPlus,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DashboardSidebar from "./DashboardSidebar";

/* ======================================================
   TYPES
====================================================== */

type Role = "public" | "execom" | "treasure" | "faculty";
type TabId = "users" | "roles" | "events" | "finances";

interface TabItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

interface UserWithRole {
  id: string;
  user_id: string;
  role: Role;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface EventRow {
  id: string;
  title: string;
  date: string;
}

interface FinanceRow {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

/* ======================================================
   COMPONENT
====================================================== */

const FacultyDashboard: React.FC = () => {
  const { user, signOut, role } = useAuth();

  const [activeTab, setActiveTab] = useState<TabId>("users");
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [finances, setFinances] = useState<FinanceRow[]>([]);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("public");

  /* ======================================================
     TABS
  ====================================================== */

  const tabs: TabItem[] = [
    { id: "users", label: "User Management", icon: Users },
    { id: "roles", label: "Role Assignment", icon: Shield },
    { id: "events", label: "Events", icon: Calendar },
    { id: "finances", label: "Finance", icon: Wallet },
  ];

  /* ======================================================
     DATA FETCHING
  ====================================================== */

  useEffect(() => {
    fetchUsers();
    fetchEvents();
    fetchFinances();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("id, user_id, role")
      .order("role");

    if (!data) return;

    const userIds = data.map((u) => u.user_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", userIds);

    const merged = data.map((u) => ({
      ...u,
      profiles: profiles?.find((p) => p.user_id === u.user_id) ?? null,
    }));

    setUsers(merged as UserWithRole[]);
  };

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, title, date")
      .order("date", { ascending: false });

    if (data) setEvents(data);
  };

  const fetchFinances = async () => {
    const { data } = await supabase
      .from("financial_records")
      .select("id, title, amount, type, date")
      .order("date", { ascending: false });

    if (data) setFinances(data as FinanceRow[]);
  };

  /* ======================================================
     ROLE ASSIGNMENT (FIXED UPSERT)
  ====================================================== */

  const handleAssignRole = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id: selectedUserId,
          role: selectedRole,
          assigned_by: user?.id ?? null,
        },
        {
          onConflict: "user_id", // ✅ single-role-per-user
        }
      );

    if (error) {
      console.error(error);
      toast.error("Failed to assign role");
      return;
    }

    toast.success("Role updated successfully");
    setShowRoleForm(false);
    setSelectedUserId("");
    fetchUsers(); // refresh list
  };


  /* ======================================================
     DELETE ACTIONS
  ====================================================== */

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) toast.error("Delete failed");
    else {
      toast.success("Event deleted");
      fetchEvents();
    }
  };

  const deleteFinance = async (id: string) => {
    if (!confirm("Delete this record?")) return;

    const { error } = await supabase
      .from("financial_records")
      .delete()
      .eq("id", id);

    if (error) toast.error("Delete failed");
    else {
      toast.success("Record deleted");
      fetchFinances();
    }
  };

  /* ======================================================
     UI HELPERS
  ====================================================== */

  const roleBadge = (role: Role) => {
    const base = "px-3 py-1 text-xs rounded-full font-medium";
    switch (role) {
      case "faculty":
        return `${base} bg-purple-500/20 text-purple-400`;
      case "treasure":
        return `${base} bg-yellow-500/20 text-yellow-400`;
      case "execom":
        return `${base} bg-blue-500/20 text-blue-400`;
      default:
        return `${base} bg-gray-500/20 text-gray-400`;
    }
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role={role} />

      <main className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-orbitron font-bold">
              Faculty <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Administrative Control</p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-lg flex gap-2 items-center ${activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* USERS */}
          {activeTab === "users" &&
            users.map((u) => (
              <div
                key={u.id}
                className="p-4 mb-2 bg-muted rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {u.profiles?.full_name ?? "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {u.profiles?.email}
                  </p>
                </div>
                <span className={roleBadge(u.role)}>{u.role}</span>
              </div>
            ))}

          {/* ROLES */}
          {activeTab === "roles" && (
            <div className="space-y-4">
              <Button onClick={() => setShowRoleForm(true)}>
                <UserPlus size={16} /> Assign Role
              </Button>

              {showRoleForm && (
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <div>
                    <Label>User</Label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full p-2 rounded"
                    >
                      <option value="">Select user</option>
                      {users.map((u) => (
                        <option key={u.user_id} value={u.user_id}>
                          {u.profiles?.full_name ??
                            u.profiles?.email ??
                            u.user_id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Role</Label>
                    <select
                      value={selectedRole}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as Role)
                      }
                      className="w-full p-2 rounded"
                    >
                      <option value="public">Public</option>
                      <option value="execom">Execom</option>
                      <option value="treasure">Treasure</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>

                  <Button onClick={handleAssignRole}>Save</Button>
                </div>
              )}
            </div>
          )}

          {/* EVENTS */}
          {activeTab === "events" &&
            events.map((e) => (
              <div
                key={e.id}
                className="p-4 mb-2 bg-muted rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm">
                    {new Date(e.date).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteEvent(e.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}

          {/* FINANCES */}
          {activeTab === "finances" &&
            finances.map((f) => (
              <div
                key={f.id}
                className="p-4 mb-2 bg-muted rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm">
                    ₹{f.amount} • {f.type}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteFinance(f.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
        </motion.div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
