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

    return (
        <div className="lg:col-span-12 bg-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-bold">
                    🤖 Chatbot Leads
                </h2>

                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {leads.length} Leads
                </span>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Mobile</th>
                            <th className="text-left p-3">Interest</th>
                            <th className="text-left p-3">Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {leads.map((lead) => (

                            <tr
                                key={lead._id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-3">
                                    {lead.name}
                                </td>

                                <td className="p-3">
                                    {lead.mobile}
                                </td>

                                <td className="p-3">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                                        {lead.interest}
                                    </span>
                                </td>

                                <td className="p-3">
                                    {new Date(
                                        lead.createdAt
                                    ).toLocaleDateString()}
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default ChatLeads;