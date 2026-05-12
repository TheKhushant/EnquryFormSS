import { useState, useEffect } from "react";
import Layout from "../../components/site/Layout";
import axios from "axios";

import StatsGrid from "../../components/site/StatsGrid";
import TrendChart from "../../components/site/TrendChart";
import TypeBreakdown from "../../components/site/TypeBreakdown";
import TopColleges from "../../components/site/TopColleges";
import RecentEnquiries from "../../components/site/RecentEnquiries.tsx";

import type { Enquiry } from "../../components/site/types.ts";

export default function EnquiryDashboard() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartView, setChartView] = useState<"daily" | "weekly">("daily");
    const [showComparison, setShowComparison] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await axios.get("https://enquryformss-2.onrender.com/api/enquiries");
            setEnquiries(response.data.data || []);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700">
                    Loading Dashboard...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#e0e5ec] p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Enquiry Dashboard</h1>
                            <p className="text-gray-600 mt-2">Real-time insights from your enquiry form</p>
                        </div>

                        {/* <div className="flex gap-3"> */}
                        <div className="hidden sm:flex gap-3">
                            {(["daily", "weekly", "monthly"] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setFilterPeriod(period)}
                                    className={`px-5 py-3 rounded-3xl font-medium transition-all ${
                                        filterPeriod === period
                                            ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white"
                                            : "bg-[#e0e5ec] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]"
                                    }`}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <StatsGrid enquiries={enquiries} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <TrendChart
                            chartView={chartView}
                            setChartView={setChartView}
                            showComparison={showComparison}
                            setShowComparison={setShowComparison}
                        />

                        <TypeBreakdown enquiries={enquiries} />

                        <TopColleges enquiries={enquiries} />

                        <RecentEnquiries enquiries={enquiries} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}