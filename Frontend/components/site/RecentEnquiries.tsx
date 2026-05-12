import type { Enquiry } from "./types.ts";

interface RecentEnquiriesProps {
    enquiries: Enquiry[];
}

export default function RecentEnquiries({ enquiries }: RecentEnquiriesProps) {
    return (
        <div className="lg:col-span-7 bg-[#e0e5ec] rounded-3xl p-8 shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-800">Recent Enquiries</h3>
                <button className="text-purple-600 hover:underline text-sm font-medium">
                    View All →
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Date</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Name</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">College</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Enquiry For</th>
                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.slice(0, 8).map((enq) => (
                            <tr key={enq._id} className="border-b border-gray-200 hover:bg-white/30 transition-colors">
                                <td className="py-5 px-4 text-sm">
                                    {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                                </td>
                                <td className="py-5 px-4 font-medium">{enq.name}</td>
                                <td className="py-5 px-4 text-sm text-gray-600">
                                    {(enq.college === "Other" ? enq.customCollege : enq.college) || "N/A"}
                                </td>
                                <td className="py-5 px-4">
                                    <span className="inline-block px-4 py-1 rounded-3xl text-xs font-medium bg-purple-100 text-purple-700">
                                        {enq.enquiryFor}
                                    </span>
                                </td>
                                <td className="py-5 px-4 text-sm text-gray-600">{enq.mobile}</td>
                            </tr>
                        ))}
                        {enquiries.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-500">
                                    No enquiries yet. Submit from the form!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}