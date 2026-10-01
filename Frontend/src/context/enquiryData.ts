import { createContext, useContext } from "react";
import type { ChatLead, Enquiry } from "../../components/site/types";

export type LoadState = "idle" | "loading" | "ready" | "error";

export interface EnquiryDataValue {
    enquiries: Enquiry[];
    chatLeads: ChatLead[];
    status: LoadState;
    error: string | null;
    chatLeadsError: string | null;
    lastUpdated: Date | null;
    live: boolean;
    reload: () => Promise<void>;
    upsert: (enquiry: Enquiry) => void;
    removeEnquiries: (ids: string[]) => void;
    removeChatLead: (id: string) => void;
}

export const EnquiryDataContext = createContext<EnquiryDataValue | null>(null);

export function useEnquiryData() {
    const ctx = useContext(EnquiryDataContext);
    if (!ctx) throw new Error("useEnquiryData must be used within EnquiryDataProvider");
    return ctx;
}
