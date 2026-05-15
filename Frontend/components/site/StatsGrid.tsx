import { UsersIcon, CalendarIcon, ArrowTrendingUpIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import type { Enquiry } from "./types.ts";

const accentColor = "#e5bcfb";

interface StatsGridProps {
    enquiries: Enquiry[];
    filterPeriod: "daily" | "weekly" | "monthly" | "yearly";
}

export default function StatsGrid({ enquiries, filterPeriod }: StatsGridProps) {
    const totalEnquiries = enquiries.length;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const todayEnquiries = enquiries.filter(e => e.createdAt?.split("T")[0] === today).length;
    const yesterdayEnquiries = enquiries.filter(e => e.createdAt?.split("T")[0] === yesterday).length;
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

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#e0e5ec] rounded-3xl p-4 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 text-sm">{stat.label}</p>
                            <p className="text-5xl font-bold text-gray-800 mt-3">{stat.value}</p>
                        </div>
                        <div className="p-1 rounded-2xl bg-white/60">
                            <stat.icon className="w-5 h-5" style={{ color: accentColor }} />
                        </div>
                    </div>
                    <p className="text-emerald-600 text-sm font-medium mt-4 flex items-center gap-1">
                        {stat.change} from last period
                    </p>
                </motion.div>
            ))}
        </div>
    );
}