import { Route, Routes } from "react-router";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Footer from "./components/Footer.jsx";

import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CreateReportPage from "./pages/CreateReportPage.jsx";
import ReportDetailsPage from "./pages/ReportDetailsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import GuidelinesPage from "./pages/GuidelinesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ResponsesReceivedPage from "./pages/ResponsesReceivedPage.jsx";
import MyResponsesPage from "./pages/MyResponsesPage.jsx";

import MyReportsPage from "./pages/MyReportsPage.jsx";
import ClaimsReceivedPage from "./pages/ClaimsReceivedPage.jsx";
import MyClaimsPage from "./pages/MyClaimsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/reports" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/reports/:id" element={<ReportDetailsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/reports" element={<MyReportsPage />} />
            <Route
              path="/profile/claims-received"
              element={<ClaimsReceivedPage />}
            />
            <Route
              path="/profile/responses-received"
              element={<ResponsesReceivedPage />}
            />
            <Route path="/profile/responses" element={<MyResponsesPage />} />
            <Route path="/profile/claims" element={<MyClaimsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reports/new" element={<CreateReportPage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
