import { useState, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Enquiry } from "./types";

interface RecentEnquiriesProps {
    enquiries: Enquiry[];
}

export default function RecentEnquiries({ enquiries }: RecentEnquiriesProps) {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("All");
    const [filterCollege, setFilterCollege] = useState<string>("All");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const enquiryTypes = useMemo(() => {
        return ["All", ...new Set(enquiries.map(e => e.enquiryFor).filter(Boolean))];
    }, [enquiries]);

    const colleges = useMemo(() => {
        const cols = enquiries.map(e => 
            e.college === "Other" ? e.customCollege : e.college
        ).filter(Boolean);
        return ["All", ...new Set(cols)];
    }, [enquiries]);

    const filteredEnquiries = useMemo(() => {
        return enquiries
            .filter(enq => {
                const matchesSearch =
                    enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    enq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    enq.mobile.includes(searchTerm);

                const matchesType = filterType === "All" || enq.enquiryFor === filterType;

                const collegeName = enq.college === "Other" ? enq.customCollege : enq.college;
                const matchesCollege = filterCollege === "All" || collegeName === filterCollege;

                const enqDate = enq.createdAt.split("T")[0];
                const matchesDateFrom = !dateFrom || enqDate >= dateFrom;
                const matchesDateTo = !dateTo || enqDate <= dateTo;

                return matchesSearch && matchesType && matchesCollege && matchesDateFrom && matchesDateTo;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [enquiries, searchTerm, filterType, filterCollege, dateFrom, dateTo]);

    return (
        <>
            {/* Recent Enquiries Card */}
            <div className="lg:col-span-7 bg-[#e0e5ec] rounded-3xl p-6 md:p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Recent Enquiries</h3>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-purple-600 hover:underline text-sm font-medium flex items-center gap-1"
                    >
                        View All ({enquiries.length}) →
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="text-left py-4 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-600">Date</th>
                                <th className="text-left py-4 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-600">Name</th>
                                <th className="text-left py-4 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-600">College</th>
                                <th className="text-left py-4 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-600">Enquiry For</th>
                                <th className="text-left py-4 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-600">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.slice(0, 8).map((enq) => (
                                <tr key={enq._id} className="border-b border-gray-200 hover:bg-white/30 transition-colors">
                                    <td className="py-4 px-3 md:px-4 text-xs md:text-sm">
                                        {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="py-4 px-3 md:px-4 font-medium text-sm">{enq.name}</td>
                                    <td className="py-4 px-3 md:px-4 text-xs md:text-sm text-gray-600">
                                        {(enq.college === "Other" ? enq.customCollege : enq.college) || "N/A"}
                                    </td>
                                    <td className="py-4 px-3 md:px-4">
                                        <span className="inline-block px-3 py-1 rounded-3xl text-xs font-medium bg-purple-100 text-purple-700">
                                            {enq.enquiryFor}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 md:px-4 text-xs md:text-sm text-gray-600">{enq.mobile}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Full View Modal - Improved Mobile View */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
                    {/* <div className="bg-[#e0e5ec] w-full max-w-7xl h-[95vh] sm:h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"> */}

                    <div className="bg-[#e0e5ec] w-full max-w-7xl h-screen sm:h-screen rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">    
                    
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-300 flex-shrink-0">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Enquiries</h2>
                                <p className="text-gray-600 text-sm">
                                    {filteredEnquiries.length} records found
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 sm:p-3 hover:bg-white/60 rounded-2xl transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </button>
                        </div>

                        {/* Filters - Compact on Mobile */}
                        <div className="hidden sm:flex p-4 border-b border-gray-300 bg-white/40 flex-wrap gap-4 items-end flex-shrink-0">
                            <div className="w-full sm:w-auto">
                                <label className="text-xs font-medium text-gray-700 block mb-1">Search</label>
                                <input
                                    type="text"
                                    placeholder="Name, Email or Mobile..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-72 px-4 py-2.5 text-sm rounded-2xl bg-white shadow border border-gray-200 focus:outline-none focus:border-purple-400"
                                />
                            </div>

                            <div className="w-full sm:w-auto">
                                <label className="text-xs font-medium text-gray-700 block mb-1">Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full sm:w-48 px-4 py-2.5 text-sm rounded-2xl bg-white shadow border border-gray-200"
                                >
                                    {enquiryTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full sm:w-auto">
                                <label className="text-xs font-medium text-gray-700 block mb-1">College</label>
                                <select
                                    value={filterCollege}
                                    onChange={(e) => setFilterCollege(e.target.value)}
                                    className="w-full sm:w-52 px-4 py-2.5 text-sm rounded-2xl bg-white shadow border border-gray-200"
                                >
                                    {colleges.map(col => (
                                        <option key={col} value={col}>{col}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">From</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white shadow border border-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">To</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white shadow border border-gray-200"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterType("All");
                                    setFilterCollege("All");
                                    setDateFrom("");
                                    setDateTo("");
                                }}
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 whitespace-nowrap mt-6 sm:mt-0"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Table Container - Full Height */}
                        <div className="flex-1 overflow-auto p-4 sm:p-6">
                            <table className="w-full min-w-[900px] text-sm">
                                <thead className="sticky top-0 bg-[#e0e5ec] z-10 shadow">
                                    <tr className="border-b-2 border-gray-400">
                                        <th className="text-left py-3 px-3 text-xs font-medium">Date & Time</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Name</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Email</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Mobile</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">College</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Enquiry For</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Course/Domain</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Duration</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Experience</th>
                                        <th className="text-left py-3 px-3 text-xs font-medium">Whom to Meet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEnquiries.map((enq) => (
                                        <tr key={enq._id} className="border-b border-gray-200 hover:bg-white/60 transition-colors">
                                            <td className="py-4 px-3 text-xs">
                                                {new Date(enq.createdAt).toLocaleDateString('en-IN')}<br />
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 font-medium text-sm">{enq.name}</td>
                                            <td className="py-4 px-3 text-xs text-gray-600 break-all">{enq.email || "—"}</td>
                                            <td className="py-4 px-3 text-xs text-gray-600">{enq.mobile}</td>
                                            <td className="py-4 px-3 text-xs text-gray-600">
                                                {(enq.college === "Other" ? enq.customCollege : enq.college) || "N/A"}
                                            </td>
                                            <td className="py-4 px-3">
                                                <span className="inline-block px-3 py-1 rounded-3xl text-xs font-medium bg-purple-100 text-purple-700">
                                                    {enq.enquiryFor}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-xs text-gray-600">
                                                {enq.courseName || enq.internshipDomain || "—"}
                                            </td>
                                            <td className="py-4 px-3 text-xs text-gray-600">
                                                {enq.internshipDuration || "—"}
                                            </td>
                                            <td className="py-4 px-3 text-xs text-gray-600">{enq.experience || "—"}</td>
                                            <td className="py-4 px-3 text-xs text-gray-600">{enq.whomToMeet || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredEnquiries.length === 0 && (
                                <div className="text-center py-16 text-gray-500">
                                    No enquiries found matching your filters.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}