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
  faculty: {
    label: "Faculty Admin",
    items: [
      { icon: "🏠", label: "Overview", href: "/dashboard/admin/overview" },
      { icon: "📅", label: "Events", href: "/dashboard/admin/events" },
      { icon: "👥", label: "Members", href: "/dashboard/admin/membership" },
      { icon: "💰", label: "Finance", href: "/dashboard/admin/finance" },
      { icon: "📊", label: "Financial Records", href: "/dashboard/admin/financial-records" }, // NEW
      { icon: "📢", label: "Notifications", href: "/dashboard/admin/notifications" },
      { icon: "👤", label: "Participants", href: "/dashboard/admin/participants" },
      { icon: "📜", label: "Certificates", href: "/dashboard/admin/certificates" },
      { icon: "🖼️", label: "Gallery", href: "/dashboard/admin/gallery" },
      // NEW ADMIN FEATURES:
      { icon: "⚙️", label: "System Monitor", href: "/dashboard/admin/system-monitor" },
      { icon: "📝", label: "Content Editor", href: "/dashboard/admin/content-editor" },
      { icon: "🗑️", label: "Data Manager", href: "/dashboard/admin/data-manager" },
      { icon: "👑", label: "Role Assigner", href: "/dashboard/admin/role-assigner" },
      { icon: "⚙️", label: "Settings", href: "/dashboard/admin/settings" },
      { icon: "👤", label: "Profile", href: "/dashboard/admin/profile" },
    ]
  },
};
