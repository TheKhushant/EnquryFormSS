import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/site/Layout";
import axios from "axios";

import {
    UsersIcon,
    CalendarIcon,
    ArrowTrendingUpIcon,
    ChartBarIcon,
    BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface Enquiry {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    college: string;
    customCollege?: string;
    enquiryFor: string;
    createdAt: string;
    internshipDuration?: string;
    internshipDomain?: string;
    courseName?: string;
    jobType?: string;
    jobCategory?: string;
    experience?: string;
    whomToMeet?: string;
}

export default function EnquiryDashboard() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartView, setChartView] = useState<"daily" | "weekly">("daily");
    const [showComparison, setShowComparison] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

    const accentColor = "#e5bcfb";

    // Fetch Enquiries
    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await axios.get("https://enquryformss-1.onrender.com/api/enquiries");
            console.log("Enquiries Data:", response.data);
            setEnquiries(response.data.data || []);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    // ====================== CALCULATIONS ======================
    const totalEnquiries = enquiries.length;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const todayEnquiries = enquiries.filter(
        (e) => e.createdAt?.split("T")[0] === today
    ).length;

    const yesterdayEnquiries = enquiries.filter(
        (e) => e.createdAt?.split("T")[0] === yesterday
    ).length;

    const todayDifference = todayEnquiries - yesterdayEnquiries;

    const stats = [
        { label: "Total Enquiries", value: totalEnquiries, icon: UsersIcon, change: "+12%" },
        {
            label: "Today",
            value: todayEnquiries,
            icon: CalendarIcon,
            change: `${todayDifference >= 0 ? "+" : ""}${todayDifference}`,
        },
        { label: "This Week", value: totalEnquiries, icon: ArrowTrendingUpIcon, change: "+18%" },
        { label: "This Month", value: totalEnquiries, icon: ChartBarIcon, change: "+24%" },
    ];

    // Enquiry Type Breakdown
    const typeData = useMemo(() => {
        const count = enquiries.reduce((acc, curr) => {
            const type = curr.enquiryFor || "Other";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors = ["#c084fc", "#a855f7", "#e5bcfb", "#6b21a8"];

        return Object.entries(count).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length],
        }));
    }, [enquiries]);

    // Top Colleges
    const topColleges = useMemo(() => {
        const count = enquiries.reduce((acc, curr) => {
            const collegeName = curr.college === "Other" 
                ? curr.customCollege || "Other" 
                : curr.college;
            
            if (collegeName) {
                acc[collegeName] = (acc[collegeName] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(count)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({
                name: name.length > 28 ? name.substring(0, 25) + "..." : name,
                count,
            }));
    }, [enquiries]);

    // Mock Chart Data (You can make this dynamic later)
    const chartData = {
        daily: [
            { label: "Mon", current: 12, previous: 8 },
            { label: "Tue", current: 18, previous: 10 },
            { label: "Wed", current: 9, previous: 6 },
            { label: "Thu", current: 22, previous: 14 },
            { label: "Fri", current: 31, previous: 20 },
            { label: "Sat", current: 15, previous: 12 },
            { label: "Sun", current: 8, previous: 5 },
        ],
        weekly: [
            { label: "Week 1", current: 80, previous: 60 },
            { label: "Week 2", current: 120, previous: 95 },
            { label: "Week 3", current: 95, previous: 70 },
            { label: "Week 4", current: 140, previous: 110 },
        ],
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
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-center mb-10"
                    >
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Enquiry Dashboard</h1>
                            <p className="text-gray-600 mt-2">Real-time insights from your enquiry form</p>
                        </div>
                        <div className="flex gap-3">
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
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#e0e5ec] rounded-3xl p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 text-sm">{stat.label}</p>
                                        <p className="text-5xl font-bold text-gray-800 mt-3">{stat.value}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/60">
                                        <stat.icon className="w-8 h-8" style={{ color: accentColor }} />
                                    </div>
                                </div>
                                <p className="text-emerald-600 text-sm font-medium mt-4 flex items-center gap-1">
                                    {stat.change} from last period
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Trend Chart */}
                        <div className="lg:col-span-8 bg-[#e0e5ec] rounded-3xl p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-semibold text-gray-800">Enquiry Trend</h3>
                                <div className="flex gap-3 items-center">
                                    <select
                                        value={chartView}
                                        onChange={(e) => setChartView(e.target.value as "daily" | "weekly")}
                                        className="px-4 py-2 rounded-xl bg-white shadow border border-gray-200"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>

                                    <button
                                        onClick={() => setShowComparison(!showComparison)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            showComparison ? "bg-purple-600 text-white" : "bg-white shadow"
                                        }`}
                                    >
                                        Compare
                                    </button>
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={chartData[chartView]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                    <XAxis dataKey="label" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="current" stroke="#c084fc" strokeWidth={3} dot={{ r: 5 }} />
                                    {showComparison && (
                                        <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Type Breakdown */}
                        <div className="lg:col-span-4 bg-[#e0e5ec] rounded-3xl p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-8">Enquiry Types</h3>
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={typeData.length > 0 ? typeData : [{ name: "No Data", value: 1 }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={130}
                                        dataKey="value"
                                    >
                                        {typeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {typeData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm">{item.name}</span>
                                        <span className="ml-auto font-semibold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Colleges */}
                        <div className="lg:col-span-5 bg-[#e0e5ec] rounded-3xl p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Top Colleges</h3>
                            <div className="space-y-6">
                                {topColleges.length > 0 ? (
                                    topColleges.map((college, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <BuildingLibraryIcon className="w-6 h-6 text-purple-500" />
                                                <span className="font-medium">{college.name}</span>
                                            </div>
                                            <span className="font-bold text-xl">{college.count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No enquiries yet</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Enquiries */}
                        <div className="lg:col-span-7 bg-[#e0e5ec] rounded-3xl p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-semibold text-gray-800">Recent Enquiries</h3>
                                <button className="text-purple-600 hover:underline text-sm font-medium">
                                    View All →
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-300">
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Date</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Name</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">College</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Enquiry For</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enquiries.slice(0, 8).map((enq) => (
                                            <tr key={enq._id} className="border-b border-gray-200 hover:bg-white/30 transition-colors">
                                                <td className="py-5 px-4 text-sm">
                                                    {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td className="py-5 px-4 font-medium">{enq.name}</td>
                                                <td className="py-5 px-4 text-sm text-gray-600">
                                                    {(enq.college === "Other" ? enq.customCollege : enq.college) || "N/A"}
                                                </td>
                                                <td className="py-5 px-4">
                                                    <span className="inline-block px-4 py-1 rounded-3xl text-xs font-medium bg-purple-100 text-purple-700">
                                                        {enq.enquiryFor}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-4 text-sm text-gray-600">{enq.mobile}</td>
                                            </tr>
                                        ))}
                                        {enquiries.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-gray-500">
                                                    No enquiries yet. Submit from the form!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}