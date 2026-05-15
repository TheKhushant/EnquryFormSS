import { useState, useEffect, useRef, useMemo } from "react";
import Layout from "../../components/site/Layout";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

import StatsGrid from "../../components/site/StatsGrid";
import TrendChart from "../../components/site/TrendChart";
import TypeBreakdown from "../../components/site/TypeBreakdown";
import TopColleges from "../../components/site/TopColleges";
import RecentEnquiries from "../../components/site/RecentEnquiries";
import voice from "../assets/notify.mp3";
import type { Enquiry } from "../../components/site/types";

export default function EnquiryDashboard() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartView, setChartView] = useState<"daily" | "weekly">("daily");
    const [showComparison, setShowComparison] = useState(false);

    // ==================== FILTER STATES ====================
    const [selectedPerson, setSelectedPerson] = useState<string>("all");
    const [filterPeriod, setFilterPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

    const socketRef = useRef<Socket | null>(null);

    // Notification setup
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // Socket connection
    useEffect(() => {
        const socket = io("https://enquryformss-2.onrender.com", {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        socket.on("connect", () => console.log("✅ Socket connected"));
        socket.on("new-enquiry", (data: Enquiry) => {
            console.log("📩 New enquiry received:", data);
            setEnquiries((prev) => [data, ...prev]);
            playNotificationSound();
            showNotification();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const playNotificationSound = () => {
        try {
            const audio = new Audio(voice);
            audio.volume = 0.7;
            audio.play();
        } catch (error) {
            console.error("Audio playback failed:", error);
        }
    };

    const showNotification = () => {
        toast.success("New Enquiry Received!", { duration: 4000, position: "top-right" });

        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Enquiry", {
                body: "A new enquiry has arrived",
                icon: "/favicon.ico",
            });
        }
    };

    const fetchEnquiries = async () => {
        try {
            const response = await axios.get("https://enquryformss-2.onrender.com/api/enquiries");
            setEnquiries(response.data.data || response.data || []);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
            toast.error("Failed to load enquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    // ==================== FILTERING LOGIC (with Yearly) ====================
    const filteredEnquiries = useMemo(() => {
        let result = [...enquiries];

        // 1. Filter by Person
        if (selectedPerson !== "all") {
            result = result.filter(enq => enq.whomToMeet === selectedPerson);
        }

        // 2. Time Period Filter
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();

        result = result.filter(enq => {
            if (!enq.createdAt) return false;

            const enquiryDate = new Date(enq.createdAt);
            if (isNaN(enquiryDate.getTime())) return false;

            if (filterPeriod === "daily") {
                return (
                    enquiryDate.getFullYear() === currentYear &&
                    enquiryDate.getMonth() === currentMonth &&
                    enquiryDate.getDate() === currentDate
                );
            }

            if (filterPeriod === "weekly") {
                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(now.getDate() - 7);
                return enquiryDate >= oneWeekAgo && enquiryDate <= now;
            }

            if (filterPeriod === "monthly") {
                return (
                    enquiryDate.getFullYear() === currentYear &&
                    enquiryDate.getMonth() === currentMonth
                );
            }

            if (filterPeriod === "yearly") {
                return enquiryDate.getFullYear() === currentYear;
            }

            return true;
        });

        console.log(`Filter: ${filterPeriod} | Person: ${selectedPerson} | Total: ${enquiries.length} | Filtered: ${result.length}`);
        return result;
    }, [enquiries, selectedPerson, filterPeriod]);

    // Get unique persons
    const uniquePersons = useMemo(() => {
        const persons = new Set(enquiries.map(enq => enq.whomToMeet).filter(Boolean));
        return Array.from(persons).sort();
    }, [enquiries]);

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
                    {/* Header with Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Enquiry Dashboard</h1>
                            <p className="text-gray-600 mt-2">Real-time insights from your enquiry form</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {/* Whom To Meet */}
                            <div className="relative min-w-[200px]">
                                <label className="text-xs text-gray-500 mb-1 block">Whom To Meet</label>
                                <select
                                    value={selectedPerson}
                                    onChange={(e) => setSelectedPerson(e.target.value)}
                                    className="w-full bg-[#e0e5ec] px-5 py-3 rounded-3xl font-medium text-gray-800 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#c084fc] cursor-pointer appearance-none"
                                >
                                    <option value="all">All Persons</option>
                                    {uniquePersons.map(person => (
                                        <option key={person} value={person}>{person}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Period */}
                            <div className="relative min-w-[180px]">
                                <label className="text-xs text-gray-500 mb-1 block">Time Period</label>
                                <select
                                    value={filterPeriod}
                                    onChange={(e) => setFilterPeriod(e.target.value as "daily" | "weekly" | "monthly" | "yearly")}
                                    className="w-full bg-[#e0e5ec] px-5 py-3 rounded-3xl font-medium text-gray-800 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#c084fc] cursor-pointer appearance-none"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Components */}
                    <StatsGrid enquiries={filteredEnquiries} filterPeriod={filterPeriod} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <TrendChart
                            enquiries={filteredEnquiries}
                            filterPeriod={filterPeriod}
                            chartView={chartView}
                            setChartView={setChartView}
                            showComparison={showComparison}
                            setShowComparison={setShowComparison}
                        />

                        <TypeBreakdown enquiries={filteredEnquiries} filterPeriod={filterPeriod} />
                        <TopColleges enquiries={filteredEnquiries} filterPeriod={filterPeriod} />
                        <RecentEnquiries enquiries={filteredEnquiries} filterPeriod={filterPeriod} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}