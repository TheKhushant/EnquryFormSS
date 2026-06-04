import axios from "axios";

interface ChatLead {
    _id: string;
    name: string;
    mobile: string;
    interest: string;
    createdAt: string;
}

interface Props {
    leads: ChatLead[];
}

const ChatLeads = ({ leads }: Props) => {

    const handleDelete = async (id: string) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this lead?"
        );

        if (!confirmDelete) return;

        try {

            await axios.delete(
                `https://enquryformss-2.onrender.com/api/chat-leads/${id}`
            );

            alert("Lead deleted successfully");

            window.location.reload();

        } catch (error) {

            console.error(error);
            alert("Failed to delete lead");

            
        }
    };

    return (
        <div className="
            lg:col-span-12
            bg-[#e8def8]
            rounded-[32px]
            p-8
            border
            border-white/30
            shadow-[14px_14px_28px_#c5b4e3,-14px_-14px_28px_#ffffff]
            ">

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-bold  ">
                    Chatbot Leads
                </h2>

                <span className="
                    px-4
                    py-2
                    rounded-2xl
                    text-sm
                    font-bold
                     
                    bg-[#ede9fe]
                    shadow-[4px_4px_8px_#c5b4e3,-4px_-4px_8px_#ffffff]
                    ">
                    {leads.length} Leads
                </span>

            </div>

            <div
                className="
                overflow-x-auto
                rounded-3xl
                bg-[#efe7ff]
                p-2
                shadow-[inset_4px_4px_10px_#c5b4e3,inset_-4px_-4px_10px_#ffffff]
                "
            >

                <table className="w-full">
                    <thead>
                    <tr className="border-b border-[#d8c7f3]">
                        <th
                            className="
                            text-left
                            p-4
                            text-[#6d28d9]
                            font-semibold
                            text-sm
                            uppercase
                            tracking-wide
                            "
                        >
                            Name
                        </th>

                        <th
                            className="
                            text-left
                            p-4
                            text-[#6d28d9]
                            font-semibold
                            text-sm
                            uppercase
                            tracking-wide
                            "
                        >
                            Mobile
                        </th>

                        <th
                            className="
                            text-left
                            p-4
                            text-[#6d28d9]
                            font-semibold
                            text-sm
                            uppercase
                            tracking-wide
                            "
                        >
                            Interest
                        </th>

                        <th
                            className="
                            text-left
                            p-4
                            text-[#6d28d9]
                            font-semibold
                            text-sm
                            uppercase
                            tracking-wide
                            "
                        >
                            Date
                        </th>

                        <th
                            className="
                            text-left
                            p-4
                            text-[#6d28d9]
                            font-semibold
                            text-sm
                            uppercase
                            tracking-wide
                            "
                        >
                            Action
                        </th>
                    </tr>
                </thead>

                    <tbody>

                        {leads.map((lead) => (

                            <tr
                                key={lead._id}
                                className="
                                    border-b
                                    border-[#ddd6fe]
                                    hover:bg-[#f3ecff]
                                    transition-all
                                    duration-300
                                    "
                            >
                                <td className="p-4 font-semibold  ">
                                    {lead.name}
                                </td>

                                <td className="p-4 font-semibold  ">
                                    {lead.mobile}
                                </td>

                                <td className="p-4 font-semibold  ">
                                    <span className="
                                    px-3
                                    py-1.5
                                    rounded-2xl
                                    
                                    font-semibold
                                     
                                    bg-[#ede9fe]
                                    
                                    ">
                                        {lead.interest}
                                    </span>
                                </td>

                                <td className="p-4 font-semibold  ">
                                    {new Date(
                                        lead.createdAt
                                    ).toLocaleDateString()}
                                </td>

                                <td className="p-3">
                                    <button
                                        onClick={() =>
                                            handleDelete(lead._id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>

                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="
                                    py-12
                                    text-center
                                     
                                    font-medium
                                    "
                                >
                                    No chatbot leads found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default ChatLeads;