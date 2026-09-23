import { Route, Routes } from "react-router";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CreateReportPage from "./pages/CreateReportPage.jsx";
import ReportDetailsPage from "./pages/ReportDetailsPage.jsx";

import MyReportsPage from "./pages/MyReportsPage.jsx";
import ClaimsReceivedPage from "./pages/ClaimsReceivedPage.jsx";
import MyClaimsPage from "./pages/MyClaimsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />

      <Route path="/reports" element={<HomePage />} />

      <Route path="/login" element={<AuthPage mode="login" />} />

      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route path="/reports/:id" element={<ReportDetailsPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/profile/reports" element={<MyReportsPage />} />

        <Route
          path="/profile/claims-received"
          element={<ClaimsReceivedPage />}
        />

        <Route path="/profile/claims" element={<MyClaimsPage />} />

        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/reports/new" element={<CreateReportPage />} />
      </Route>
    </Routes>
  );
}

export default App;