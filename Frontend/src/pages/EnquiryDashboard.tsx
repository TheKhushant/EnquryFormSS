import { useState, useEffect, useRef } from "react";
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
    const [filterPeriod, setFilterPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

    const socketRef = useRef<Socket | null>(null);

    // Request notification permission on mount
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

        socket.on("connect", () => {
            console.log("✅ Socket connected");
        });

        socket.on("new-enquiry", (data: Enquiry) => {
            console.log("📩 New enquiry received:", data);

            setEnquiries((prev) => [data, ...prev]);
            playNotificationSound();
            showNotification();
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
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
        toast.success("New Enquiry Received!", {
            duration: 4000,
            position: "top-right",
        });

        // Browser notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Enquiry", {
                body: "A new enquiry has arrived",
                icon: "/favicon.ico", // Optional
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

                        <div className="hidden sm:flex gap-3">
                            {(["daily", "weekly", "monthly"] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setFilterPeriod(period)}
                                    className={`px-5 py-3 rounded-3xl font-medium transition-all ${
                                        filterPeriod === period
                                            ? "bg-gradient-to-r from-[#e5bcfb] to-[#c084fc] text-white shadow-lg"
                                            : "bg-[#e0e5ec] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-inner"
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