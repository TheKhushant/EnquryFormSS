import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/site/Layout";
import {
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingLibraryIcon,
    // SparklesIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
// const [reference, setReference] = useState("");

import { useEnquiries } from "../../contexts/EnquiryContext";

export default function EnquiryForm() {
    // const accentColor = "#e5bcfb";

    const raisedShadow =
    "shadow-[8px_8px_16px_#d8b4fe,-8px_-8px_16px_#ffffff]";

    const insetShadow =
    "shadow-[inset_6px_6px_12px_#d8b4fe,inset_-6px_-6px_12px_#ffffff]";

    const { addEnquiry } = useEnquiries();

    // State for Thank You Page
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [resume, setResume] = useState<File | null>(null);
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
        reference: "",
        referenceName: "",     
        referenceOther: "",
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

        const formDataToSend = new FormData();

formDataToSend.append("name", formData.name);
formDataToSend.append("mobile", formData.mobile);
formDataToSend.append("email", formData.email);
formDataToSend.append("college", formData.college);
formDataToSend.append("customCollege", formData.customCollege);
formDataToSend.append("enquiryFor", formData.enquiryFor);
formDataToSend.append("internshipDuration", formData.internshipDuration);
formDataToSend.append("internshipDomain", formData.internshipDomain);
formDataToSend.append("courseName", formData.courseName);
formDataToSend.append("jobType", formData.jobType);
formDataToSend.append("jobCategory", formData.jobCategory);
formDataToSend.append("experience", formData.experience);
formDataToSend.append("whomToMeet", formData.whomToMeet);
formDataToSend.append("reference", formData.reference);

if (resume) {
    formDataToSend.append(
        "resume",
        resume
    );
}

        console.log("FORM DATA BEFORE API:", formData);
        setIsLoading(true);

try {
    await axios.post(
        "http://localhost:5000/api/enquiries",
        formDataToSend
    );

    setIsSubmitted(true);

} catch (error: any) {

    console.log("FULL ERROR:", error);

    if (error.response) {
        console.log("Backend Error:", error.response.data);
    }

    alert(
        error?.response?.data?.message ||
        "Something went wrong!"
    );

} finally {

    setIsLoading(false);

}

};   // <-- ADD THIS

const resetForm = () => {
        setFormData({
            name: "", mobile: "", email: "", college: "", enquiryFor: "",
            internshipDuration: "", customCollege: "", internshipDomain: "",
            courseName: "", jobType: "", jobCategory: "",
            experience: "", whomToMeet: "", otherName: "", reference: "", referenceName: "", referenceOther: "",
        });
        setIsSubmitted(false);
    };

    // ==================== THANK YOU PAGE ====================
    const ThankYouPage = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen  bg-[#f3efff] flex items-center justify-center py-16 px-4"
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

                <h1 className="text-5xl font-bold text-violet-900 mb-4">Thank You!</h1>
                
                <div className=" bg-[#f3efff] rounded-3xl p-10 shadow-[10px_10px_20px_#d8b4fe,-10px_-10px_20px_#ffffff] mb-8">
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

                    {/* <p className="text-sm text-gray-500">
                        You will receive a confirmation on your email shortly
                    </p> */}
                </div>
            </div>
        </motion.div>
    );

    return (
        <Layout>
             {isLoading && (
            <div className="
                fixed
                inset-0
                bg-black/50
                z-[9999]
                flex
                items-center
                justify-center
            ">
                <div className="
                    bg-white
                    rounded-3xl
                    p-8
                    flex
                    flex-col
                    items-center
                    gap-4
                    shadow-xl
                ">
                    <div className="
                        animate-spin
                        rounded-full
                        h-12
                        w-12
                        border-b-4
                        border-purple-600
                    "></div>

                    <p className="font-semibold">
                        Submitting your enquiry...
                    </p>
                </div>
            </div>
        )}
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen  bg-[#f3efff] py-6 px-4"
                    >
                        <div className="max-w-2xl mx-auto">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-6"
                            >
                                {/* <div className="inline-flex items-center gap-3 px-6 py-2 rounded-3xl  bg-[#f3efff] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] mb-6">
                                    <SparklesIcon className="w-6 h-6" style={{ color: accentColor }} />
                                    <span className="font-semibold text-purple-800">Get In Touch</span>
                                </div> */}
                                <h1 className="text-5xl font-bold text-violet-900 tracking-tight">Enquiry Form</h1>
                                <p className="mt-4 text-violet-700 text-lg">Tell us what you're looking for</p>
                            </motion.div>

                            {/* Form */}
                            <motion.form
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#f3efff] rounded-3xl p-10 border border-violet-200 shadow-[10px_10px_20px_#d8b4fe,-10px_-10px_20px_#ffffff]"
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
                                                    className={`w-full pl-12 pr-6 py-1 rounded-3xl  bg-[#f3efff] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none focus:ring-2 focus:ring-violet-400`}
                                                    placeholder="Your Name Here"
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
                                                    className={`w-full pl-12 pr-6 py-1 rounded-3xl  bg-[#f3efff] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none focus:ring-2 focus:ring-violet-400`}
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
                                                    className={`w-full pl-12 pr-6 py-1 rounded-3xl  bg-[#f3efff] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none focus:ring-2 focus:ring-violet-400 text-gray-800`}
                                                >
                                                    <option value="">Select Your College</option>
                                                    <option value="Dr. Ambedkar College, Deekshabhoomi">
                                                        Dr. Ambedkar College, Deekshabhoomi
                                                    </option>
                                                    <option value="G H Raisoni College of Engineering">
                                                        G H Raisoni College of Engineering
                                                    </option>
                                                    <option value="Guru Nanak Institute of Engineering and Technology">
                                                        Guru Nanak Institute of Engineering and Technology
                                                    </option>
                                                    <option value="JD College of Engineering and Management">
                                                        JD College of Engineering and Management
                                                    </option>
                                                    <option value="Jhulelal Institute of Technology">
                                                        Jhulelal Institute of Technology
                                                    </option>
                                                    <option value="Karmaveer Dadasaheb Kannamwar College of Engineering">
                                                        Karmaveer Dadasaheb Kannamwar College of Engineering
                                                    </option>
                                                    <option value="Prerna College of Commerce and Science">
                                                        Prerna College of Commerce and Science
                                                    </option>
                                                    <option value="S. B. Jain Institute of Technology, Management and Research">
                                                        S. B. Jain Institute of Technology, Management and Research
                                                    </option>
                                                    <option value="Shri Ramdeobaba College of Engineering and Management">
                                                        Shri Ramdeobaba College of Engineering and Management
                                                    </option>
                                                    <option value="St. Vincent Pallotti College of Engineering and Technology">
                                                        St. Vincent Pallotti College of Engineering and Technology
                                                    </option>
                                                    <option value="Suryoday College of Engineering and Technology">
                                                        Suryoday College of Engineering and Technology
                                                    </option>
                                                    <option value="Tulsiramji Gaikwad-Patil College of Engineering and Technology">
                                                        Tulsiramji Gaikwad-Patil College of Engineering and Technology
                                                    </option>
                                                    <option value="Yeshwantrao Chavan College of Engineering">
                                                        Yeshwantrao Chavan College of Engineering
                                                    </option>
                                                    <option className="font-bold" value="Other">Other</option>
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
                                                            className={`w-full pl-6 pr-6 py-1 rounded-3xl  bg-[#f3efff] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none focus:ring-2 focus:ring-violet-400`}
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
                                                    className={`w-full pl-10 pr-2 py-1 rounded-3xl  bg-[#f3efff] ${insetShadow} focus:shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] transition-all outline-none focus:ring-2 focus:ring-violet-400`}
                                                    placeholder="mail@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enquiry For Buttons */}
                                    <div>
                                        <label className="block text-medium font-medium text-gray-700 mb-3">Enquiry For</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                                            {["Internship", "Job", "Course", "Hiring","Overseas","Certification","New Visitor","Offer Letter","Other"].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, enquiryFor: type }))}
                                                    className={`py-1 px-2 rounded-3xl font-sm transition-all ${formData.enquiryFor === type
                                                        ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-black shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"
                                                        : ` bg-[#f3efff] ${raisedShadow} hover:-translate-y-0.5`
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
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }} 
                                                animate={{ opacity: 1, height: "auto" }} 
                                                exit={{ opacity: 0, height: 0 }} 
                                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                                    <select 
                                                        name="internshipDuration" 
                                                        value={formData.internshipDuration} 
                                                        onChange={handleChange} 
                                                        className={`w-full p-4 py-2 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none focus:ring-2 focus:ring-violet-400`}
                                                    >
                                                        <option value="">Select Duration</option>
                                                        <option value="1 Month">1 Month</option>
                                                        <option value="3 Months">3 Months</option>
                                                        <option value="6 Months">6 Months</option>
                                                        <option value="12 Months">12 Months</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                                                    <select 
                                                        name="internshipDomain" 
                                                        value={formData.internshipDomain} 
                                                        onChange={handleChange} 
                                                        className={`w-full p-4 py-2 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none focus:ring-2 focus:ring-violet-400`}
                                                    >
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

                                        {formData.enquiryFor === "Course" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="grid grid-cols-1 gap-6"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Which Course?</label>
                                                    <select
                                                        name="courseName"
                                                        value={formData.courseName}
                                                        onChange={handleChange}
                                                        className={`w-full p-4 py-1 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none focus:ring-2 focus:ring-violet-400`}
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

                                        {formData.enquiryFor === "Job" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                                    <div className="flex gap-3">
                                                        {["Tech", "Non-Tech"].map((type) => (
                                                            <button
                                                                key={type}
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, jobType: type }))}
                                                                className={`flex-1 py-1 rounded-3xl font-medium ${formData.jobType === type
                                                                    ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white"
                                                                    : ` bg-[#f3efff] ${raisedShadow}`
                                                                    }`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {formData.jobType && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Role / Category</label>
                                                            <select
                                                                name="jobCategory"
                                                                value={formData.jobCategory}
                                                                onChange={handleChange}
                                                                className={`w-full p-4 py-1 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none focus:ring-2 focus:ring-violet-400`}
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
                                                                    className={`flex-1 py-1 rounded-3xl font-medium ${formData.experience === level
                                                                        ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white"
                                                                        : ` bg-[#f3efff] ${raisedShadow}`
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
                                    </AnimatePresence>

                                    {/* Whom to Meet */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Whom would you like to meet?
                                        </label>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {["Dr. N. G. Alvi", "Mr. Allan Abraham", "Mrs. Manisha Mali","Mr. Viraj Patle", "Other"].map((person) => (
                                                <label
                                                    key={person}
                                                    className={`flex items-center gap-3 p-1 rounded-3xl cursor-pointer transition-all ${formData.whomToMeet === person
                                                        ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white shadow-[inset_px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"
                                                        : ` bg-[#f3efff] ${raisedShadow} hover:-translate-y-0.5`
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
                                                        className={`w-full p-4 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none focus:ring-2 focus:ring-violet-400`}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {/* ==================== REFERENCE / SOURCE ==================== */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            How did you hear about us? (Reference)
                                        </label>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {["Instagram", "Facebook", "Ads", "Friends", "Teacher", "Newspaper", "Other"].map((ref) => (
                                                <label
                                                    key={ref}
                                                    className={`flex items-center gap-1 py-1 p-1 rounded-3xl cursor-pointer transition-all ${formData.reference === ref
                                                        ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"
                                                        : ` bg-[#f3efff] ${raisedShadow} hover:-translate-y-0.5`
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="reference"
                                                        value={ref}
                                                        checked={formData.reference === ref}
                                                        onChange={handleChange}
                                                        className="w-3 h-3 accent-purple-500"
                                                    />
                                                    <span className="font-sm text-sm">{ref}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* Conditional Input Fields */}
                                        <AnimatePresence>
                                            {/* Friends */}
                                            {formData.reference === "Friends" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4"
                                                >
                                                    <input
                                                        type="text"
                                                        name="referenceName"
                                                        value={formData.referenceName}
                                                        onChange={handleChange}
                                                        placeholder="Friend's Name"
                                                        className={`w-full p-4 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none focus:ring-2 focus:ring-violet-400`}
                                                        required
                                                    />
                                                </motion.div>
                                            )}

                                            {/* Teacher */}
                                            {formData.reference === "Teacher" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4"
                                                >
                                                    <input
                                                        type="text"
                                                        name="referenceName"
                                                        value={formData.referenceName}
                                                        onChange={handleChange}
                                                        placeholder="Teacher's Name"
                                                        className={`w-full p-4 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none focus:ring-2 focus:ring-violet-400`}
                                                        required
                                                    />
                                                </motion.div>
                                            )}

                                            {/* Other */}
                                            {formData.reference === "Other" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4"
                                                >
                                                    <input
                                                        type="text"
                                                        name="referenceOther"
                                                        value={formData.referenceOther}
                                                        onChange={handleChange}
                                                        placeholder="Please specify"
                                                        className={`w-full p-4 rounded-3xl  bg-[#f3efff] ${insetShadow} outline-none`}
                                                        required
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Resume (PDF/DOC/DOCX) if applicable
    </label>

    <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Resume
    </label>

    <label
        className="
        cursor-pointer
        block
        w-full
        p-4
        rounded-3xl
        bg-[#f3efff]
        shadow-[inset_6px_6px_12px_#d8b4fe,inset_-6px_-6px_12px_#ffffff]
        text-center
        font-medium
        text-purple-700
        hover:scale-[1.01]
        transition
        "
    >
        {resume
            ? resume.name
            : "📄 Upload Resume"}

        <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
                setResume(
                    e.target.files?.[0] || null
                )
            }
            className="hidden"
        />
    </label>
</div>
        
</div>

                                    {/* Submit Button */}
                                    <button
    type="submit"
    disabled={isLoading}
    className={`
        w-full
        py-3
        rounded-xl
        font-semibold
        text-white
        transition

        ${
            isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
        }
    `}
>
    {isLoading ? "Submitting..." : "Submit"}
</button>
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
