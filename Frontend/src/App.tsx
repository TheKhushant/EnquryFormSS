import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnquiryDashboard from "./pages/EnquiryDashboard";
import EnquiryForm from "./pages/EnquiryForm";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EnquiryForm />} />
                <Route path="/dashboard" element={<EnquiryDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;