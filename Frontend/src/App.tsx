import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnquiryDashboard from "./pages/EnquiryDashboard";
import EnquiryForm from "./pages/EnquiryForm";
import AdminLogin from "./pages/AdminLogin";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EnquiryForm />} />
                <Route path="/dashboard" element={<EnquiryDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
        </Router>
    );
};

export default App;