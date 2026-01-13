import {
  LayoutDashboard,
  User,
  Users,
  UserCheck,
  Calendar,
  Image,
  Bell,
  Award,
  Wallet,
  FileText,
  Settings,
  Shield,
} from "lucide-react";

/**
 * CENTRAL DASHBOARD MENU CONFIG
 * Used by all role-based layouts
 */

export const dashboardMenus = {
  /* ================= PUBLIC (STUDENT) ================= */
  public: [
    {
      label: "Overview",
      path: "/dashboard/public",
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      path: "/dashboard/public/profile",
      icon: User,
    },
    {
      label: "Membership Status",
      path: "/dashboard/public/membership",
      icon: FileText,
    },
    {
      label: "Events",
      path: "/dashboard/public/events",
      icon: Calendar,
    },
    {
      label: "Certificates",
      path: "/dashboard/public/certificates",
      icon: Award,
    },
    {
      label: "Gallery",
      path: "/dashboard/public/gallery",
      icon: Image,
    },
    {
      label: "Notifications",
      path: "/dashboard/public/notifications",
      icon: Bell,
    },
    {
      label: "Payments",
      path: "/dashboard/public/payments",
      icon: Wallet,
    },
    {
      label: "Settings",
      path: "/dashboard/public/settings",
      icon: Settings,
    },
  ],

  /* ================= EXE-COM ================= */
  execom: [
    {
      label: "Overview",
      path: "/dashboard/execom",
      icon: LayoutDashboard,
    },
    {
      label: "Membership",
      path: "/dashboard/execom/membership",
      icon: UserCheck,
    },
    
    {
      label: "Events",
      path: "/dashboard/execom/events",
      icon: Calendar,
    },
    {
      label: "Participants",
      path: "/dashboard/execom/participants",
      icon: Users,
    },
    {
      label: "Gallery",
      path: "/dashboard/execom/gallery",
      icon: Image,
    },
    {
      label: "Notifications",
      path: "/dashboard/execom/notifications",
      icon: Bell,
    },
    {
      label: "Certificates",
      path: "/dashboard/execom/certificates",
      icon: Award,
    },
    {
      label: "Finance (View)",
      path: "/dashboard/execom/finance",
      icon: Wallet,
    },
    {
      label: "Profile",
      path: "/dashboard/execom/profile",
      icon: User,
    },
    {
      label: "Settings",
      path: "/dashboard/execom/settings",
      icon: Settings,
    },
  ],

  /* ================= TREASURER ================= */
  treasure: [
    {
      label: "Overview",
      path: "/dashboard/treasurer",
      icon: LayoutDashboard,
    },
    {
      label: "Financial Records",
      path: "/dashboard/treasurer/finance",
      icon: Wallet,
    },
    {
      label: "Financial Summary",
      path: "/dashboard/treasurer/summary",
      icon: FileText,
    },
    {
      label: "Settings",
      path: "/dashboard/treasurer/settings",
      icon: Settings,
    },
  ],

  /* ================= FACULTY (ADMIN) ================= */
  faculty: [
    {
      label: "Admin Overview",
      path: "/dashboard/faculty",
      icon: LayoutDashboard,
    },
    {
      label: "All Members",
      path: "/dashboard/faculty/members",
      icon: Users,
    },
    {
      label: "Membership Approval",
      path: "/dashboard/faculty/membership",
      icon: Shield,
    },
    {
      label: "Assign Roles",
      path: "/dashboard/faculty/roles",
      icon: Shield,
    },
    {
      label: "System Monitor",
      path: "/dashboard/faculty/system",
      icon: FileText,
    },
    {
      label: "Settings",
      path: "/dashboard/faculty/settings",
      icon: Settings,
    },
  ],
};
