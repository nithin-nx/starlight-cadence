import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";

/* ================= PUBLIC SITE ================= */
import Index from "./pages/Index";
import About from "./pages/About";
import PublicEvents from "./pages/Events";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

/* ================= JOIN ISTE ================= */
import Intro from "./pages/join-iste/Intro";
import Form from "./pages/join-iste/Form";

/* ================= PUBLIC DASHBOARD ================= */
import PublicLayout from "@/layouts/PublicLayout";
import PublicOverview from "@/pages/dashboard/public/Overview";
import PublicProfile from "@/pages/dashboard/public/Profile";
import PublicMembership from "@/pages/dashboard/public/Membership";
import PublicEventsDash from "@/pages/dashboard/public/Events";
import PublicCertificates from "@/pages/dashboard/public/Certificates";
import PublicGallery from "@/pages/dashboard/public/Gallery";
import PublicNotifications from "@/pages/dashboard/public/Notifications";
import PublicPayments from "@/pages/dashboard/public/Payments";
import PublicSettings from "@/pages/dashboard/public/Settings";

/* ================= EXE-COM DASHBOARD ================= */
import ExecomLayout from "@/layouts/ExecomLayout";
import ExecomOverview from "@/pages/dashboard/execom/Overview";
import ExecomMembership from "@/pages/dashboard/execom/Membership";
import ExecomEvents from "@/pages/dashboard/execom/Events";
import ExecomParticipants from "@/pages/dashboard/execom/Participants";
import ExecomGallery from "@/pages/dashboard/execom/Gallery";
import ExecomNotifications from "@/pages/dashboard/execom/Notifications";
import ExecomCertificates from "@/pages/dashboard/execom/Certificates";
import ExecomFinance from "@/pages/dashboard/execom/Finance";
import ExecomProfile from "@/pages/dashboard/execom/Profile";
import ExecomSettings from "@/pages/dashboard/execom/Settings";

/* ================= TREASURER & FACULTY ================= */
import TreasureDashboard from "@/components/dashboard/TreasureDashboard";
import FacultyDashboard from "@/components/dashboard/FacultyDashboard";

/* ================= ADMIN DASHBOARD ================= */
import AdminLayout from "@/layouts/AdminLayout";
import AdminOverview from "@/pages/dashboard/admin/Overview";
import AdminEvents from "@/pages/dashboard/admin/Events";
import AdminMembership from "@/pages/dashboard/admin/AdminMembership";
import AdminParticipants from "@/pages/dashboard/admin/Participants";
import AdminFinance from "@/pages/dashboard/admin/Finance";
import AdminFinancialRecords from "@/pages/dashboard/admin/FinancialRecords";
import AdminNotifications from "@/pages/dashboard/admin/Notifications";
import AdminCertificates from "@/pages/dashboard/admin/Certificates";
import AdminGallery from "@/pages/dashboard/admin/Gallery";
import AdminProfile from "@/pages/dashboard/admin/Profile";
import AdminSettings from "@/pages/dashboard/admin/Settings";
import SystemMonitor from "@/pages/dashboard/admin/SystemMonitor";
import ContentEditor from "@/pages/dashboard/admin/ContentEditor";
import DataManager from "@/pages/dashboard/admin/DataManager";
import RoleAssigner from "@/pages/dashboard/admin/RoleAssigner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />

      <Routes>
        {/* ===== PUBLIC SITE ===== */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<PublicEvents />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />

        {/* ===== JOIN ISTE ===== */}
        <Route path="/join-iste" element={<Intro />} />
        <Route path="/join-iste/form" element={<Form />} />

        {/* ===== UNAUTHORIZED ===== */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ===== PUBLIC DASHBOARD ===== */}
        <Route
          path="/dashboard/public"
          element={
            <ProtectedRoute role="public">
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PublicOverview />} />
          <Route path="profile" element={<PublicProfile />} />
          <Route path="membership" element={<PublicMembership />} />
          <Route path="events" element={<PublicEventsDash />} />
          <Route path="certificates" element={<PublicCertificates />} />
          <Route path="gallery" element={<PublicGallery />} />
          <Route path="notifications" element={<PublicNotifications />} />
          <Route path="payments" element={<PublicPayments />} />
          <Route path="settings" element={<PublicSettings />} />
        </Route>

        {/* ===== EXE-COM DASHBOARD ===== */}
        <Route
          path="/dashboard/execom"
          element={
            <ProtectedRoute role="execom">
              <ExecomLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ExecomOverview />} />
          <Route path="membership" element={<ExecomMembership />} />
          <Route path="events" element={<ExecomEvents />} />
          <Route path="participants" element={<ExecomParticipants />} />
          <Route path="gallery" element={<ExecomGallery />} />
          <Route path="notifications" element={<ExecomNotifications />} />
          <Route path="certificates" element={<ExecomCertificates />} />
          <Route path="finance" element={<ExecomFinance />} />
          <Route path="profile" element={<ExecomProfile />} />
          <Route path="settings" element={<ExecomSettings />} />
        </Route>

        {/* ===== TREASURER DASHBOARD ===== */}
        <Route
          path="/dashboard/treasurer"
          element={
            <ProtectedRoute role="treasurer">
              <TreasureDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== FACULTY DASHBOARD ===== */}
        <Route
          path="/dashboard/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN DASHBOARD (Nested Layout) ===== */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="faculty">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="membership" element={<AdminMembership />} />
          <Route path="participants" element={<AdminParticipants />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="financial-records" element={<AdminFinancialRecords />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="system-monitor" element={<SystemMonitor />} />
          <Route path="content-editor" element={<ContentEditor />} />
          <Route path="data-manager" element={<DataManager />} />
          <Route path="role-assigner" element={<RoleAssigner />} />
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;