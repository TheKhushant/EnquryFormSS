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
import { useMemo, useState } from "react";

interface TrendChartProps {
    enquiries: any[];
    filterPeriod: "daily" | "weekly" | "monthly" | "yearly";
    showComparison: boolean;
    setShowComparison: (val: boolean) => void;
}

type WeeklyMode = "rolling" | "calendar";

export default function TrendChart({
    enquiries,
    filterPeriod,
    showComparison,
    setShowComparison,
}: TrendChartProps) {
    const [weeklyMode, setWeeklyMode] = useState<WeeklyMode>("rolling");

    // ==================== DYNAMIC CHART DATA ====================
    const chartData = useMemo(() => {
        if (!enquiries.length) return [];

        const dataMap = new Map<string, number>(); // key = sortable date string or label

        enquiries.forEach(enq => {
            const date = new Date(enq.createdAt);
            if (isNaN(date.getTime())) return;

            let label: string;
            let sortKey: string; // Used for final chronological sort

            switch (filterPeriod) {
                case "daily":
                    label = date.getHours().toString().padStart(2, '0') + ":00";
                    sortKey = date.getHours().toString().padStart(2, '0');
                    break;

                case "weekly": {
                    const dayStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    label = date.toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                    });
                    sortKey = dayStr;
                    break;
                }

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

            dataMap.set(sortKey, (dataMap.get(sortKey) || 0) + 1);
        });

        // Generate complete periods (especially important for weekly)
        let result: Array<{ label: string; current: number; previous: number; sortKey: string }> = [];

        if (filterPeriod === "weekly") {
            const now = new Date();
            now.setHours(23, 59, 59, 999);

            let periodDates: Date[] = [];

            if (weeklyMode === "rolling") {
                // Last 7 days (including today) - oldest first
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    periodDates.push(d);
                }
            } else {
                // Calendar Week: Monday → Sunday
                const startOfWeek = new Date(now);
                const day = startOfWeek.getDay(); // 0=Sun, 1=Mon, ...
                const diff = startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1; // days to Monday
                startOfWeek.setDate(startOfWeek.getDate() - diff);
                startOfWeek.setHours(0, 0, 0, 0);

                for (let i = 0; i < 7; i++) {
                    const d = new Date(startOfWeek);
                    d.setDate(d.getDate() + i);
                    periodDates.push(d);
                }
            }

            periodDates.forEach(date => {
                const key = date.toISOString().split('T')[0];
                const count = dataMap.get(key) || 0;

                const label = date.toLocaleDateString('en-IN', { 
                    weekday: 'short', 
                    day: 'numeric' 
                });

                result.push({
                    label,
                    current: count,
                    previous: Math.floor(count * (0.7 + Math.random() * 0.6)), // Mock
                    sortKey: key,
                });
            });
        } else {
            // Existing logic for other periods
            result = Array.from(dataMap.entries()).map(([sortKey, value]) => {
                let label: string;
                if (filterPeriod === "daily") {
                    label = sortKey + ":00";
                } else if (filterPeriod === "monthly") {
                    label = parseInt(sortKey).toString();
                } else if (filterPeriod === "yearly") {
                    label = sortKey; // already month short
                } else {
                    label = sortKey;
                }

                return {
                    label,
                    current: value,
                    previous: Math.floor(value * (0.7 + Math.random() * 0.6)),
                    sortKey,
                };
            });

            // Sort other periods
            if (filterPeriod === "daily" || filterPeriod === "monthly") {
                result.sort((a, b) => parseInt(a.sortKey) - parseInt(b.sortKey));
            } else if (filterPeriod === "yearly") {
                const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                result.sort((a, b) => monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label));
            }
        }

        return result;
    }, [enquiries, filterPeriod, weeklyMode]);

    const totalCurrent = chartData.reduce((sum, item) => sum + item.current, 0);
    const totalPrevious = chartData.reduce((sum, item) => sum + (item.previous || 0), 0);

    const growth = totalPrevious > 0 
        ? Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100) 
        : 0;

    return (
        <div
        className="
        lg:col-span-8
        bg-[#e8def8]
        rounded-[32px]
        p-6
        md:p-8
        border
        border-white/30
        shadow-[14px_14px_28px_#c5b4e3,-14px_-14px_28px_#ffffff]
        "
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold  ">Enquiry Trend</h3>
                    <p className="  text-sm mt-1 capitalize">
                        {filterPeriod} View • {totalCurrent} Enquiries
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                    <div>
                        <span className=" ">Total</span>
                        <p className="text-2xl font-semibold  ">{totalCurrent}</p>
                    </div>
                    {growth !== 0 && (
                        <div className={`flex items-center gap-1 ${growth >= 0 ? "text-violet-600" : "text-red-500"}`}>
                            <span className="text-lg font-medium">
                                {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}%
                            </span>
                            <span className="text-gray-500 text-xs">vs last period</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                    {filterPeriod === "weekly" && (
                        <select
                            value={weeklyMode}
                            onChange={(e) => setWeeklyMode(e.target.value as WeeklyMode)}
                            className="
                            px-4
                            py-3
                            rounded-2xl
                            text-sm
                            font-medium
                            bg-[#e8def8]
                             
                            border-0
                            shadow-[6px_6px_12px_#c5b4e3,-6px_-6px_12px_#ffffff]
                            focus:outline-none
                            "
                        >
                            <option value="rolling">Last 7 Days</option>
                            <option value="calendar">Calendar Week (Mon-Sun)</option>
                        </select>
                    )}

                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                            showComparison 
                                ? "bg-[#c084fc] text-white" 
                                : "bg-[#e8def8] shadow border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {showComparison ? "Hide Comparison" : "Compare Previous"}
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="mt-4">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart 
                        data={chartData} 
                        margin={{ top: 20, right: 30, left: -20, bottom: 40 }}
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#d8c7f3"
                            />
                        
                        <XAxis 
                            dataKey="label" 
                            stroke="#6b7280" 
                            fontSize={13}
                            tickLine={false}
                            angle={-35}
                            textAnchor="end"
                            height={60}
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
                            fill="#8b5cf6"
                            fillOpacity={0.18}
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
            className="
            bg-[#e8def8]
            rounded-3xl
            p-4
            text-sm
            z-50
            shadow-[10px_10px_20px_#c5b4e3,-10px_-10px_20px_#ffffff]
            "
        >
            <p className="font-bold   mb-3">{label}</p>
            
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