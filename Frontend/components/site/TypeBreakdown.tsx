import { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { Enquiry } from "./types.ts";

interface TypeBreakdownProps {
    enquiries: Enquiry[];
}

export default function TypeBreakdown({ enquiries }: TypeBreakdownProps) {
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

    return (
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
    );
}