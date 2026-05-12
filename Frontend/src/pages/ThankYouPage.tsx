import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/site/Layout";
import {
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingLibraryIcon,
    SparklesIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { useEnquiries } from "../../contexts/EnquiryContext";

export default function EnquiryForm() {
    const accentColor = "#e5bcfb";

    const raisedShadow = "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]";
    const insetShadow = "shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff]";

    const { addEnquiry } = useEnquiries();

    // New State for Thank You Page
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        college: "",
        enquiryFor: "",
        internshipDuration: "",
        customCollege: "",
        internshipDomain: "",
        courseName: "",
        jobType: "",
        jobCategory: "",
        experience: "",
        whomToMeet: "",
        otherName: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.mobile || !formData.email || !formData.college || !formData.enquiryFor) {
            alert("Please fill all required fields");
            return;
        }

        const submissionData = { /* ... your existing submissionData ... */ };

        try {
            const response = await axios.post(
                `https://enquryformss-2.onrender.com/api/enquiries`,
                submissionData
            );

            console.log(response.data);

            // Success → Show Thank You Page
            setIsSubmitted(true);

            // Optional: Add to context
            // addEnquiry(submissionData);

        } catch (error: any) {
            console.log("FULL ERROR:", error);
            alert(error?.response?.data?.message || "Something went wrong!");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "", mobile: "", email: "", college: "", enquiryFor: "",
            internshipDuration: "", customCollege: "", internshipDomain: "",
            courseName: "", jobType: "", jobCategory: "",
            experience: "", whomToMeet: "", otherName: "",
        });
        setIsSubmitted(false);
    };

    // ==================== THANK YOU PAGE ====================
    const ThankYouPage = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-[#e0e5ec] flex items-center justify-center py-16 px-4"
        >
            <div className="max-w-lg w-full text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 12 }}
                    className="mx-auto w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-[8px_8px_20px_#bebebe,-8px_-8px_20px_#ffffff]"
                >
                    <CheckCircleIcon className="w-20 h-20" style={{ color: "#22c55e" }} />
                </motion.div>

                <h1 className="text-5xl font-bold text-gray-800 mb-4">Thank You!</h1>
                
                <div className="bg-[#e0e5ec] rounded-3xl p-10 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff] mb-8">
                    <p className="text-2xl font-medium text-gray-700 mb-3">
                        Your form has been submitted successfully
                    </p>
                    <p className="text-gray-600 text-lg">
                        We will connect with you shortly.<br />
                        Please wait for our team to reach out.
                    </p>
                </div>

                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetForm}
                        className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white font-bold text-xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]"
                    >
                        Submit Another Enquiry
                    </motion.button>

                    <p className="text-sm text-gray-500">
                        You will receive a confirmation on your email shortly
                    </p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <Layout>
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen bg-[#e0e5ec] py-16 px-4"
                    >
                        <div className="max-w-2xl mx-auto">
                            {/* Your existing header */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-12"
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] mb-6">
                                    <SparklesIcon className="w-6 h-6" style={{ color: accentColor }} />
                                    <span className="font-semibold text-purple-800">Get In Touch</span>
                                </div>
                                <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Enquiry Form</h1>
                                <p className="mt-4 text-gray-600 text-lg">Tell us what you're looking for</p>
                            </motion.div>

                            {/* Your existing form (unchanged) */}
                            <motion.form
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#e0e5ec] rounded-3xl p-10 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]"
                            >
                                {/* ... ALL YOUR EXISTING FORM FIELDS ... */}
                                {/* (Keep everything from Personal Info to Submit Button unchanged) */}
                                {/* I'll keep it short here for brevity */}
                                <div className="space-y-8">
                                    {/* Paste all your form content here (Personal Info, College, Enquiry For, etc.) */}
                                    {/* ... your existing fields ... */}

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white font-bold text-xl shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] active:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] mt-6"
                                    >
                                        Submit Enquiry
                                    </motion.button>
                                </div>
                            </motion.form>
                        </div>
                    </motion.div>
                ) : (
                    <ThankYouPage key="thankyou" />
                )}
            </AnimatePresence>
        </Layout>
    );
}