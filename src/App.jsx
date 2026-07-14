import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import Home from "./pages/Home";
import CheckMembership from "./pages/CheckMembership";
import ContactUs from "./pages/ContactUs";
import AboutSBN from "./pages/AboutSBN";
import PresidentMessagePage from "./pages/PresidentMessagePage";
import SBNMission from "./pages/SBNMission";
import MajorEvents from "./pages/MajorEvents";
import BenefitsForMembers from "./pages/BenefitsForMembers";
import MembersLogin from "./pages/MembersLogin";
import JoinSBN from "./pages/JoinSBN";
import MemberMyTables from "./pages/MemberMyTables";
import MemberConnect from "./pages/MemberConnect";
import MemberGnote from "./pages/MemberGnote";
import AdminLogin from "./pages/AdminLogin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { AdminLayout, ProtectedRoute } from "./pages/AdminDashboard";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginRoute = location.pathname === "/member-login" || location.pathname === "/admin/login";
  const hideLayout = isAdminRoute || isLoginRoute;
  const isHomePage = location.pathname === '/';

  // Automatically scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={`main-content ${isHomePage ? 'main-content--home' : ''}`}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/member-login" element={<MembersLogin />} />
        <Route path="/about-sbn" element={<AboutSBN />} />
        <Route path="/president-message" element={<PresidentMessagePage />} />
        <Route path="/sbn-mission" element={<SBNMission />} />
        <Route path="/major-events" element={<MajorEvents />} />
        <Route path="/benefits-for-members" element={<BenefitsForMembers />} />
        <Route path="/join-sbn" element={<JoinSBN />} />
        <Route path="/check-membership" element={<CheckMembership />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/my-tables" element={<MemberMyTables />} />
        <Route path="/connect" element={<MemberConnect />} />
        <Route path="/gnote" element={<MemberGnote />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <FloatingButtons />}
    </>
  );
}
