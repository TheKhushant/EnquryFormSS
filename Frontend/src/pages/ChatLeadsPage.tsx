import ChatLeads from "../components/site/ChatLeads";
import { ErrorState, PageHeader } from "../components/admin/ui";
import { useEnquiryData } from "../context/enquiryData";

export default function ChatLeadsPage() {
    const { chatLeads, chatLeadsError, removeChatLead, reload } = useEnquiryData();
    return (
        <>
            <PageHeader title="Chat Leads" description="Contacts captured by the website chatbot" />
            {chatLeadsError && !chatLeads.length ? <ErrorState message={chatLeadsError} onRetry={reload} /> : <ChatLeads leads={chatLeads} onDeleted={removeChatLead} />}
        </>
    );
}
