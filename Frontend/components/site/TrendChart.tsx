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
import { useMemo } from "react";

interface TrendChartProps {
    enquiries: any[];
    filterPeriod: "daily" | "weekly" | "monthly" | "yearly";
    chartView?: "daily" | "weekly"; // keeping for backward compatibility
    setChartView?: any;
    showComparison: boolean;
    setShowComparison: (val: boolean) => void;
}

export default function TrendChart({
    enquiries,
    filterPeriod,
    showComparison,
    setShowComparison,
}: TrendChartProps) {

    // ==================== DYNAMIC CHART DATA ====================
    const chartData = useMemo(() => {
        if (!enquiries.length) return [];

        const dataMap = new Map();

        enquiries.forEach(enq => {
            const date = new Date(enq.createdAt);
            if (isNaN(date.getTime())) return;

            let label: string;
            let sortKey: string;

            switch (filterPeriod) {
                case "daily":
                    label = date.getHours().toString().padStart(2, '0') + ":00";
                    sortKey = date.getHours().toString().padStart(2, '0');
                    break;

                case "weekly":
                    label = date.toLocaleDateString('en-IN', { weekday: 'short' });
                    sortKey = date.getDay().toString();
                    break;

                case "monthly":
                    label = date.getDate().toString();
                    sortKey = date.getDate().toString().padStart(2, '0');
                    break;

                case "yearly":
                    label = date.toLocaleDateString('en-IN', { month: 'short' });
                    sortKey = date.getMonth().toString().padStart(2, '0');
                    break;

                default:
                    label = "Unknown";
                    sortKey = "0";
            }

            dataMap.set(label, (dataMap.get(label) || 0) + 1);
        });

        // Convert to array and sort
        let result = Array.from(dataMap.entries()).map(([label, value]) => ({
            label,
            current: value,
            previous: Math.floor(value * (0.7 + Math.random() * 0.6)), // Mock previous for demo
        }));

        // Sort properly
        if (filterPeriod === "daily" || filterPeriod === "monthly") {
            result.sort((a, b) => parseInt(a.label) - parseInt(b.label));
        } else if (filterPeriod === "yearly") {
            const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            result.sort((a, b) => monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label));
        }

        return result;
    }, [enquiries, filterPeriod]);

    const totalCurrent = chartData.reduce((sum, item) => sum + item.current, 0);
    const totalPrevious = chartData.reduce((sum, item) => sum + (item.previous || 0), 0);

    const growth = totalPrevious > 0 
        ? Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100) 
        : 0;

    return (
        <div className="lg:col-span-8 bg-[#e0e5ec] rounded-3xl p-6 md:p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800">Enquiry Trend</h3>
                    <p className="text-gray-600 text-sm mt-1 capitalize">
                        {filterPeriod} View • {totalCurrent} Enquiries
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
                <div className="flex items-center gap-3">
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

            {/* Chart */}
            <div className="mt-4">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        
                        <XAxis 
                            dataKey="label" 
                            stroke="#6b7280" 
                            fontSize={13}
                            tickLine={false}
                            angle={filterPeriod === "monthly" ? -45 : 0}
                            textAnchor={filterPeriod === "monthly" ? "end" : "middle"}
                        />
                        
                        <YAxis 
                            stroke="#6b7280" 
                            fontSize={13}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="current"
                            stroke="none"
                            fill="#c084fc"
                            fillOpacity={0.08}
                        />

                        <Line
                            type="monotone"
                            dataKey="current"
                            stroke="#c084fc"
                            strokeWidth={4}
                            dot={{ r: 5, fill: "#fff", stroke: "#c084fc", strokeWidth: 3 }}
                            activeDot={{ r: 7, fill: "#c084fc" }}
                        />

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
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm mt-4">
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
            className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100 text-sm z-50"
        >
            <p className="font-medium text-gray-800 mb-3">{label}</p>
            
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-8 mb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600">
                            {entry.name === "current" ? "Enquiries" : "Previous"}
                        </span>
                    </div>
                    <span className="font-semibold text-gray-800">{entry.value}</span>
                </div>
            ))}
        </motion.div>
    );
};