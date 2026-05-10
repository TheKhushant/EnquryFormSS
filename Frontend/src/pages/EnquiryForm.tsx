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
} from "@heroicons/react/24/outline";

import { useEnquiries } from "../../contexts/EnquiryContext";

export default function EnquiryForm() {
    const accentColor = "#e5bcfb";

    const raisedShadow = "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]";
    const insetShadow = "shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff]";

    const { addEnquiry } = useEnquiries();   // ← Using Context

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

        const submissionData = {
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            college: formData.college,
            customCollege: formData.customCollege,
            enquiryFor: formData.enquiryFor,
            internshipDuration: formData.internshipDuration,
            internshipDomain: formData.internshipDomain,
            jobType: formData.jobType,
            jobCategory: formData.jobCategory,
            experience: formData.experience,
            courseName: formData.courseName,
            whomToMeet: formData.whomToMeet === "Other"
                ? (formData.otherName || "Other")
                : formData.whomToMeet,
        };

        // addEnquiry(submissionData);

        // alert("Enquiry submitted successfully! ");
        try {
            // Backend API Call
            const response = await axios.post(
                `https://enquryformss-1.onrender.com/api/enquiries`,
                submissionData
            );

            console.log(response.data);

            // Local Context Update
            // addEnquiry(submissionData);

            alert("Enquiry submitted successfully!");

            // Reset form
            setFormData({
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
        } catch (error: any) {
            console.log("FULL ERROR:", error);

            if (error.response) {
                console.log("Backend Error:", error.response.data);
                console.log("Status:", error.response.status);
            } else if (error.request) {
                console.log("No Response From Server");
            } else {
                console.log("Error Message:", error.message);
            }

            alert(error?.response?.data?.message || "Something went wrong!");
        }
        // } catch (error) {
        //     console.log(error);
        //     alert("Something went wrong!");
        // }

        // Reset form
        // setFormData({
        //     name: "", mobile: "", email: "", college: "", enquiryFor: "",
        //     internshipDuration: "", customCollege: "", internshipDomain: "",
        //     courseName: "", jobType: "", jobCategory: "",
        //     experience: "", whomToMeet: "", otherName: "",
        // });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#e0e5ec] py-16 px-4">
                <div className="max-w-2xl mx-auto">
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

                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#e0e5ec] rounded-3xl p-10 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]"
                    >
                        <div className="space-y-8">

                            {/* Personal Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full pl-12 pr-6 py-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                            className={`w-full pl-12 pr-6 py-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none`}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* College & Email */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">College / University</label>
                                    <div className="relative">
                                        <BuildingLibraryIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            name="college"
                                            value={formData.college}
                                            onChange={handleChange}
                                            required
                                            className={`w-full pl-12 pr-6 py-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none text-gray-800`}
                                        >
                                            <option value="">Select Your College</option>
                                            {/* ... your college options ... */}
                                            <option value="Shri Ramdeobaba College of Engineering and Management">
                                                Shri Ramdeobaba College of Engineering and Management
                                            </option>
                                            <option value="G H Raisoni College of Engineering">G H Raisoni College of Engineering</option>
                                            <option value="St. Vincent Pallotti College of Engineering and Technology">
                                                St. Vincent Pallotti College of Engineering and Technology </option>
                                            <option value="Suryoday College of Engineering and Technology">
                                                Suryoday College of Engineering and Technology
                                            </option>
                                            <option className="font-bold" value="Other">Other</option>
                                            {/* <option value="Other">Other</option>    */}

                                        </select>
                                    </div>

                                    <AnimatePresence>
                                        {formData.college === "Other" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-3"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Enter your college name"
                                                    required
                                                    className={`w-full pl-6 pr-6 py-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none`}
                                                    value={formData.customCollege}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, customCollege: e.target.value }))}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className={`w-full pl-12 pr-6 py-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Enquiry For Buttons */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Enquiry For</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {["Internship", "Job", "Course", "Other"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, enquiryFor: type }))}
                                            className={`py-4 px-6 rounded-3xl font-medium transition-all ${formData.enquiryFor === type
                                                ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"
                                                : `bg-[#e0e5ec] ${raisedShadow} hover:-translate-y-0.5`
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conditional Fields */}
                            <AnimatePresence mode="wait">
                                {formData.enquiryFor === "Internship" && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Duration & Domain fields - same as before */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                            <select name="internshipDuration" value={formData.internshipDuration} onChange={handleChange} className={`w-full p-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} outline-none`}>
                                                <option value="">Select Duration</option>
                                                <option value="1 Month">1 Month</option>
                                                <option value="3 Months">3 Months</option>
                                                <option value="6 Months">6 Months</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                                            <select name="internshipDomain" value={formData.internshipDomain} onChange={handleChange} className={`w-full p-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} outline-none`}>
                                                <option value="">Select Domain</option>
                                                <option value="Fullstack">Fullstack Development</option>
                                                <option value="Data Analytics">Data Analytics</option>
                                                <option value="Cyber Security">Cyber Security</option>
                                                <option value="UI/UX">UI/UX Design</option>
                                                <option value="AI ML">AI & Machine Learning</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                                {/* ====================== COURSE ====================== */}
                                {formData.enquiryFor === "Course" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-1 gap-6"   // Single column (only 1 field)
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Which Course?</label>
                                            <select
                                                name="courseName"
                                                value={formData.courseName}
                                                onChange={handleChange}
                                                className={`w-full p-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} outline-none`}
                                            >
                                                <option value="">Select Course</option>
                                                <option value="Service Now">Service Now</option>
                                                <option value="Data Analytics">Data Analytics</option>
                                                <option value="DataBricks">DataBricks</option>
                                                <option value="AI ML">AI & Machine Learning</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ====================== JOB ====================== */}
                                {formData.enquiryFor === "Job" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Job Type - Always full width */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                            <div className="flex gap-3">
                                                {["Tech", "Non-Tech"].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, jobType: type }))}
                                                        className={`flex-1 py-4 rounded-3xl font-medium ${formData.jobType === type
                                                            ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white"
                                                            : `bg-[#e0e5ec] ${raisedShadow}`
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Job Category + Experience - 2 Column on Large Screen */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {formData.jobType && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Role / Category</label>
                                                    <select
                                                        name="jobCategory"
                                                        value={formData.jobCategory}
                                                        onChange={handleChange}
                                                        className={`w-full p-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} outline-none`}
                                                    >
                                                        <option value="">Select Role</option>
                                                        {formData.jobType === "Tech" ? (
                                                            <>
                                                                <option value="Fullstack Developer">Fullstack Developer</option>
                                                                <option value="AI ML Engineer">AI/ML Engineer</option>
                                                                <option value="Data Analyst">Data Analyst</option>
                                                                <option value="Java Developer">Java Developer</option>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <option value="BPO / Calling">BPO / Calling</option>
                                                                <option value="Service Now">Service Now</option>
                                                                <option value="Electronics">Electronics</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                                                <div className="flex gap-3">
                                                    {["Fresher", "Experienced"].map((level) => (
                                                        <button
                                                            key={level}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, experience: level }))}
                                                            className={`flex-1 py-4 rounded-3xl font-medium ${formData.experience === level
                                                                ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white"
                                                                : `bg-[#e0e5ec] ${raisedShadow}`
                                                                }`}
                                                        >
                                                            {level}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {/* Course and Job sections remain same - you can keep them as they were */}
                                {/* ... (Copy your previous Course and Job conditional blocks here) ... */}

                            </AnimatePresence>

                            {/* Whom to Meet - Keep your existing code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Whom would you like to meet?
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {["Mr. Allan Abhraham", "Mr. Viraj Patle", "Dr. N. G. Alvi", "Mrs. Manisha Mali", "Other"].map((person) => (
                                        <label
                                            key={person}
                                            className={`flex items-center gap-3 p-4 rounded-3xl cursor-pointer transition-all ${formData.whomToMeet === person
                                                ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white shadow-[inset_px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"
                                                : `bg-[#e0e5ec] ${raisedShadow} hover:-translate-y-0.5`
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="whomToMeet"
                                                value={person}
                                                checked={formData.whomToMeet === person}
                                                onChange={handleChange}
                                                className="w-5 h-5 accent-purple-500"
                                            />
                                            <span className="font-medium">{person}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Other Name Input */}
                                <AnimatePresence>
                                    {formData.whomToMeet === "Other" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4"
                                        >
                                            <input
                                                type="text"
                                                name="otherName"
                                                value={formData.otherName}
                                                onChange={handleChange}
                                                placeholder="Enter full name"
                                                className={`w-full p-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} outline-none`}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
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
            </div>
        </Layout>
    );
}