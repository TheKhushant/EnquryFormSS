interface Lead {
  _id: string;
  name: string;
  mobile: string;
  interest: string;
  createdAt: string;
}

interface Props {
  leads: Lead[];
}

export default function ChatLeads({ leads }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md mt-8">

      <h2 className="text-xl font-bold mb-4">
        🤖 Chatbot Leads
      </h2>

      {leads.length === 0 ? (
        <p>No chatbot leads yet</p>
      ) : (
        <table className="w-full">

          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Interest</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.mobile}</td>
                <td>{lead.interest}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}
