import { motion } from "framer-motion";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

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

interface TrendChartProps {
    chartView: "daily" | "weekly";
    setChartView: (view: "daily" | "weekly") => void;
    showComparison: boolean;
    setShowComparison: (val: boolean) => void;
}

export default function TrendChart({
    chartView,
    setChartView,
    showComparison,
    setShowComparison,
}: TrendChartProps) {
    return (
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
                        <Line
                            type="monotone"
                            dataKey="previous"
                            stroke="#94a3b8"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}