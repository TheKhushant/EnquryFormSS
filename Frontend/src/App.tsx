import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnquiryDashboard from "./pages/EnquiryDashboard";
import EnquiryForm from "./pages/EnquiryForm";
import AdminLogin from "./pages/AdminLogin";
import ChatBot from "./components/ChatBot";

const App = () => {
    return (
        <Router>

            <Routes>
                <Route path="/" element={<EnquiryForm />} />
                <Route path="/dashboard" element={<EnquiryDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>

            <ChatBot />

        </Router>
    );
};

export default App;