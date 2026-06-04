import { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { Enquiry } from "./types";

interface TypeBreakdownProps {
    enquiries: Enquiry[];
    filterPeriod: "daily" | "weekly" | "monthly" | "yearly";


}

const COLORS = [
    "#c084fc", // Purple
    "#a855f7", // Vibrant Purple
    "#7e22ce", // Deep Purple
    "#6b21a8", // Dark Purple
    "#d8b4fe", // Light Purple
    "#e879f9", // Pinkish
];

export default function TypeBreakdown({ enquiries, filterPeriod }: TypeBreakdownProps) {
    const typeData = useMemo(() => {
        const count = enquiries.reduce((acc, curr) => {
            const type = curr.enquiryFor?.trim() || "Other";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const total = enquiries.length;

        return Object.entries(count)
            .map(([name, value]) => ({
                name,
                value,
                percentage: total > 0 ? Math.round((value / total) * 100) : 0,
                color: COLORS[Object.keys(count).indexOf(name) % COLORS.length],
            }))
            .sort((a, b) => b.value - a.value); // Sort by count descending
    }, [enquiries, filterPeriod]);

    const totalEnquiries = enquiries.length;

    return (
        <div
            className="
            lg:col-span-4
            bg-[#e8def8]
            rounded-[32px]
            p-4 md:p-6
            border border-white/20
            flex flex-col
            shadow-[14px_14px_28px_#c5b4e3,-14px_-14px_28px_#ffffff]
            "
            >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800">Enquiry Types</h3>
                    <p className="text-gray-600 text-sm mt-1">
                        {totalEnquiries} total enquiries
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 flex items-center justify-center py-4">
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={typeData.length > 0 ? typeData : [{ name: "No Data", value: 1 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={105}
                            dataKey="value"
                            animationDuration={800}
                            animationBegin={100}
                        >
                            {typeData.length > 0 ? (
                                typeData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.color}
                                        stroke="#e8def8"
                                        strokeWidth={3}
                                    />
                                ))
                            ) : (
                                <Cell fill="#d1d5db" />
                            )}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4">
                {typeData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-3">
                        {typeData.map((item, index) => (
                            <div 
                                key={index} 
                                className="flex items-center gap-3 group"
                            >
                                <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {item.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-gray-800">{item.value}</span>
                                    <span className="text-xs text-gray-500 ml-1.5">
                                        ({item.percentage}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8  ">
                        No enquiry data available
                    </div>
                )}
            </div>
        </div>
    );
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;

    return (
        <div className="bg-[#e8def8] shadow-[10px_10px_20px_#c5b4e3,-10px_-10px_20px_#ffffff] rounded-3xl px-5 py-4 border border-white/30 text-sm min-w-[180px]">
            <div className="flex items-center gap-3">
                <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: data.color }}
                />
                <span className="font-medium  ">{data.name}</span>
            </div>
            
            <div className="mt-3 flex justify-between items-baseline">
                <span className="text-gray-600">Enquiries</span>
                <span className="text-2xl font-semibold text-gray-900">{data.value}</span>
            </div>
            
            <div className="text-xs text-gray-500 mt-1">
                {data.percentage}% of total
            </div>
        </div>
    );
};