import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
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
    const currentData = chartData[chartView];
    const totalCurrent = currentData.reduce((sum, item) => sum + item.current, 0);
    const totalPrevious = currentData.reduce((sum, item) => sum + (item.previous || 0), 0);
    
    const growth = totalPrevious > 0 
        ? Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100) 
        : 0;

    return (
        <div className="lg:col-span-8 bg-[#e0e5ec] rounded-3xl p-6 md:p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800">Enquiry Trend</h3>
                    <p className="text-gray-600 text-sm mt-1">
                        {chartView === "daily" ? "This Week" : "This Month"}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                    <div>
                        <span className="text-gray-500">Total</span>
                        <p className="text-2xl font-semibold text-gray-800">{totalCurrent}</p>
                    </div>
                    {growth !== 0 && (
                        <div className={`flex items-center gap-1 ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                            <span className="text-lg font-medium">
                                {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}%
                            </span>
                            <span className="text-gray-500 text-xs">vs last period</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Mobile Tabs */}
                    <div className="sm:hidden flex bg-white rounded-2xl p-1 shadow-sm">
                        <button
                            onClick={() => setChartView("daily")}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                                chartView === "daily" 
                                    ? "bg-purple-600 text-white shadow" 
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setChartView("weekly")}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                                chartView === "weekly" 
                                    ? "bg-purple-600 text-white shadow" 
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Weekly
                        </button>
                    </div>

                    {/* Desktop Controls */}
                    <div className="hidden sm:flex gap-3">
                        <select
                            value={chartView}
                            onChange={(e) => setChartView(e.target.value as "daily" | "weekly")}
                            className="px-5 py-2.5 rounded-2xl bg-white shadow border border-gray-200 text-sm focus:outline-none focus:border-purple-400"
                        >
                            <option value="daily">Daily View</option>
                            <option value="weekly">Weekly View</option>
                        </select>

                        <button
                            onClick={() => setShowComparison(!showComparison)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                                showComparison 
                                    ? "bg-purple-600 text-white" 
                                    : "bg-white shadow border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {showComparison ? "Hide Comparison" : "Compare Previous"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={currentData} margin={{ top: 30, right: 5, left: -35, bottom: 55 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        
                        <XAxis 
                            dataKey="label" 
                            stroke="#6b7280" 
                            fontSize={13}
                            tickLine={false}
                        />
                        
                        <YAxis 
                            stroke="#6b7280" 
                            fontSize={13}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Area under current line */}
                        <Area
                            type="monotone"
                            dataKey="current"
                            stroke="none"
                            fill="#c084fc"
                            fillOpacity={0.08}
                        />

                        {/* Current Line */}
                        <Line
                            type="monotone"
                            dataKey="current"
                            stroke="#c084fc"
                            strokeWidth={4}
                            dot={{ r: 5, fill: "#fff", stroke: "#c084fc", strokeWidth: 3 }}
                            activeDot={{ r: 7, fill: "#c084fc" }}
                        />

                        {/* Previous Line */}
                        {showComparison && (
                            <Line
                                type="monotone"
                                dataKey="previous"
                                stroke="#94a3b8"
                                strokeWidth={2.5}
                                strokeDasharray="6 4"
                                dot={{ r: 4, fill: "#fff", stroke: "#94a3b8", strokeWidth: 2 }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-[#c084fc] rounded" />
                    <span className="text-gray-700">Current Period</span>
                </div>
                {showComparison && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-[#94a3b8] rounded" style={{ border: "1px dashed #94a3b8" }} />
                        <span className="text-gray-700">Previous Period</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100 text-sm"
        >
            <p className="font-medium text-gray-800 mb-3">{label}</p>
            
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-6 mb-1">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600">
                            {entry.name === "current" ? "Current" : "Previous"}
                        </span>
                    </div>
                    <span className="font-semibold text-gray-800">{entry.value}</span>
                </div>
            ))}
        </motion.div>
    );
};