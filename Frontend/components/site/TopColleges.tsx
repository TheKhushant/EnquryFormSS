import { useMemo } from "react";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import type { Enquiry } from "./types.ts";

interface TopCollegesProps {
    enquiries: Enquiry[];
    filterPeriod: "daily" | "weekly" | "monthly" | "yearly";
}

export default function TopColleges({ enquiries, filterPeriod }: TopCollegesProps) {
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
    }, [enquiries, filterPeriod]);

    return (
        <div className="
            lg:col-span-5
            bg-[#e8def8]
            rounded-[32px]
            p-8
            border
            border-white/30
            shadow-[14px_14px_28px_#c5b4e3,-14px_-14px_28px_#ffffff]
            ">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Top Colleges</h3>
            <div className="space-y-4">
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
    );
}