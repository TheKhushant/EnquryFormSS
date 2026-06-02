import { useState, useEffect, useMemo } from "react";
import Layout from "../../components/site/Layout";
import axios from "axios";
import ChatLeads from "../components/site/ChatLeads";
import StatsGrid from "../../components/site/StatsGrid";
import TrendChart from "../../components/site/TrendChart";
import TypeBreakdown from "../../components/site/TypeBreakdown";
import TopColleges from "../../components/site/TopColleges";
import RecentEnquiries from "../../components/site/RecentEnquiries";
import type { Enquiry } from "../../components/site/types";

export default function EnquiryDashboard() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatLeads, setChatLeads] = useState([]);
    const internshipLeads =
    chatLeads.filter(
        (x: any) =>
            x.interest?.toLowerCase().includes("internship")
    ).length;

const courseLeads =
    chatLeads.filter(
        (x: any) =>
            x.interest?.toLowerCase().includes("course")
    ).length;
    const fetchChatLeads = async () => {
    try {

        const response = await axios.get(
             "https://enquryformss-2.onrender.com/api/chat-leads"
        );

        setChatLeads(response.data.data || []);

    } catch (error) {
        console.error(error);
    }
};

    // ==================== MULTIPLE FILTERS ====================
    const [selectedPerson, setSelectedPerson] = useState<string>("all");
    const [selectedCollege, setSelectedCollege] = useState<string>("all");
    const [selectedReference, setSelectedReference] = useState<string>("all");
    const [selectedEnquiryFor, setSelectedEnquiryFor] = useState<string>("all");
    const [filterPeriod, setFilterPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
    const [showComparison, setShowComparison] = useState<boolean>(false);
    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://enquryformss-2.onrender.com/api/enquiries");
            const data = response?.data;
            if (data?.success && Array.isArray(data.data)) {
                setEnquiries(data.data);
            } else if (Array.isArray(data?.data)) {
                setEnquiries(data.data);
            } else {
                setEnquiries([]);
                console.warn("Unexpected enquiries response:", data);
            }
        } catch (error) {
            console.error("Error fetching enquiries:", error);
            setEnquiries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
        fetchChatLeads();
    }, []);

    // ==================== ADVANCED FILTERING ====================
    const filteredEnquiries = useMemo(() => {
        let result = [...enquiries];

        // Apply all filters
        if (selectedPerson !== "all") {
            result = result.filter(enq => enq.whomToMeet === selectedPerson);
        }
        if (selectedCollege !== "all") {
            result = result.filter(enq => enq.college === selectedCollege);
        }
        if (selectedReference !== "all") {
            result = result.filter(enq => enq.reference === selectedReference);   // ← Reference Filter
        }
        if (selectedEnquiryFor !== "all") {
            result = result.filter(enq => enq.enquiryFor === selectedEnquiryFor);
        }

        // Time Filter
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();

        result = result.filter(enq => {
            if (!enq.createdAt) return false;
            const d = new Date(enq.createdAt);
            if (isNaN(d.getTime())) return false;

            if (filterPeriod === "daily") {
                return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === currentDate;
            }
            if (filterPeriod === "weekly") {
                const weekAgo = new Date(now); 
                weekAgo.setDate(now.getDate() - 7);
                return d >= weekAgo && d <= now;
            }
            if (filterPeriod === "monthly") {
                return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
            }
            if (filterPeriod === "yearly") {
                return d.getFullYear() === currentYear;
            }
            return true;
        });

        return result;
    }, [enquiries, selectedPerson, selectedCollege, selectedReference, selectedEnquiryFor, filterPeriod]);

    // Get unique values for dropdowns
    const uniquePersons = useMemo(() => Array.from(new Set(enquiries.map(e => e.whomToMeet).filter(Boolean))).sort(), [enquiries]);
    const uniqueColleges = useMemo(() => Array.from(new Set(enquiries.map(e => e.college).filter(Boolean))).sort(), [enquiries]);
    const uniqueReferences = useMemo(() => Array.from(new Set(enquiries.map(e => e.reference).filter(Boolean))).sort(), [enquiries]);
    const uniqueEnquiryFor = useMemo(() => Array.from(new Set(enquiries.map(e => e.enquiryFor).filter(Boolean))).sort(), [enquiries]);

    const removeDuplicates = async () => {
        const confirmDelete = window.confirm(
            "Remove all duplicate enquiries of the same day?"
        );

        if (!confirmDelete) return;

        try {
            const res = await axios.delete(
            "https://enquryformss-2.onrender.com/api/enquiries/remove-duplicates"
            );

            alert(res.data.message);

            window.location.reload();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-[#e0e5ec] p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 text-2xl font-semibold text-gray-700">Loading dashboard...</div>
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#c084fc] border-t-transparent" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#e0e5ec] p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Enquiry Dashboard</h1>
                            {/* <p className="text-gray-600 mt-2">Real-time insights with advanced filters</p> */}
                        </div>

                        {/* All Filters in Dropdowns */}
                        <div className="flex flex-wrap items-end gap-2">
    
                        <div className="min-w-[130px] flex-1">
                            <FilterDropdown
                                label="Meet"
                                value={selectedPerson}
                                onChange={setSelectedPerson}
                                options={uniquePersons}
                            />
                        </div>

                        <div className="min-w-[130px] flex-1">
                            <FilterDropdown
                                label="College"
                                value={selectedCollege}
                                onChange={setSelectedCollege}
                                options={uniqueColleges}
                            />
                        </div>

                        <div className="min-w-[130px] flex-1">
                            <FilterDropdown
                                label="Reference"
                                value={selectedReference}
                                onChange={setSelectedReference}
                                options={uniqueReferences}
                            />
                        </div>

                        <div className="min-w-[130px] flex-1">
                            <FilterDropdown
                                label="Enquiry"
                                value={selectedEnquiryFor}
                                onChange={setSelectedEnquiryFor}
                                options={uniqueEnquiryFor}
                            />
                        </div>

                        <div className="min-w-[130px] flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">
                                Period
                            </label>

                            <select
                                value={filterPeriod}
                                onChange={(e) => setFilterPeriod(e.target.value as any)}
                                className="w-full bg-[#e0e5ec] px-3 py-2 rounded-xl text-sm font-medium shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>

                    </div>
                    </div>

                    <StatsGrid enquiries={filteredEnquiries} filterPeriod={filterPeriod} />

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="text-gray-500">
            Total Chat Leads
        </h3>

        <p className="text-3xl font-bold">
            {chatLeads.length}
        </p>
    </div>

    <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="text-gray-500">
            Internship Leads
        </h3>

        <p className="text-3xl font-bold">
            {internshipLeads}
        </p>
    </div>

    <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="text-gray-500">
            Course Leads
        </h3>

        <p className="text-3xl font-bold">
            {courseLeads}
        </p>
    </div>

</div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <TrendChart 
                            enquiries={filteredEnquiries} 
                            filterPeriod={filterPeriod}
                            showComparison={showComparison}
                            setShowComparison={setShowComparison}
                        />

                        <TypeBreakdown enquiries={filteredEnquiries} filterPeriod={filterPeriod} />
                        <TopColleges enquiries={filteredEnquiries} filterPeriod={filterPeriod}/>
                        <RecentEnquiries enquiries={filteredEnquiries} filterPeriod={filterPeriod} />
                        <ChatLeads leads={chatLeads} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}


// Reusable Filter Component
const FilterDropdown = ({ label, value, onChange, options }: any) => {
    const safeOptions = Array.isArray(options) ? options : [];

    return (
        <div>
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#e0e5ec] px-5 py-3 rounded-3xl font-medium text-gray-800 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#c084fc]"
            >
                <option key="all" value="all">All {label}</option>
                {safeOptions.map((item: string) => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );
};



