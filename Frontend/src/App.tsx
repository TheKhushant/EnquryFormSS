import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import EnquiryForm from "./pages/EnquiryForm";
import AdminLogin from "./pages/AdminLogin";
import ChatBot from "./components/ChatBot";
import { isAdminLoggedIn } from "./lib/auth";

// The admin area (and recharts) is code-split so the public enquiry form stays light.
const AdminShell = lazy(() => import("./components/admin/AdminShell"));
const EnquiryDashboard = lazy(() => import("./pages/EnquiryDashboard"));
const EnquiriesPage = lazy(() => import("./pages/EnquiriesPage"));
const EnquiryDetailPage = lazy(() => import("./pages/EnquiryDetailPage"));
const FollowUpsPage = lazy(() => import("./pages/FollowUpsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const ChatLeadsPage = lazy(() => import("./pages/ChatLeadsPage"));

function RequireAdmin() {
    const location = useLocation();
    if (!isAdminLoggedIn()) {
        return <Navigate to="/admin-login" replace state={{ from: location.pathname + location.search }} />;
    }
    return <Outlet />;
}

function AdminLoading() {
    return (
        <div className="grid min-h-screen place-items-center bg-[#f7f5fd]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" aria-label="Loading" />
        </div>
    );
}

// The visitor chatbot is for the public site, not the admin dashboard.
function PublicChatBot() {
    const { pathname } = useLocation();
    return pathname.startsWith("/dashboard") ? null : <ChatBot />;
}

const App = () => {
    return (
        <Router>

            <Routes>
                <Route path="/" element={<EnquiryForm />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route element={<RequireAdmin />}>
                    <Route path="/dashboard" element={<Suspense fallback={<AdminLoading />}><AdminShell /></Suspense>}>
                        <Route index element={<EnquiryDashboard />} />
                        <Route path="enquiries" element={<EnquiriesPage />} />
                        <Route path="enquiries/:id" element={<EnquiryDetailPage />} />
                        <Route path="follow-ups" element={<FollowUpsPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="insights" element={<InsightsPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="chat-leads" element={<ChatLeadsPage />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Route>
            </Routes>

            <PublicChatBot />

        </Router>
    );
};

export default App;
