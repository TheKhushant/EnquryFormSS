import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import type { ChatLead, Enquiry } from "../../components/site/types";
import { API_BASE_URL, chatLeadApi, enquiryApi, getErrorMessage } from "../lib/api";
import { EnquiryDataContext, type LoadState } from "./enquiryData";

const byNewest = (a: Enquiry, b: Enquiry) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

/**
 * Single source of enquiry data for the admin area: fetched once, shared by
 * every dashboard page (no refetch on navigation), and kept fresh through the
 * backend's socket.io events.
 */
export default function EnquiryDataProvider({ children }: { children: ReactNode }) {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [chatLeads, setChatLeads] = useState<ChatLead[]>([]);
    const [status, setStatus] = useState<LoadState>("loading");
    const [error, setError] = useState<string | null>(null);
    const [chatLeadsError, setChatLeadsError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [live, setLive] = useState(false);

    const reload = useCallback(async () => {
        setStatus((s) => (s === "ready" ? "ready" : "loading"));
        const [enqResult, leadResult] = await Promise.allSettled([enquiryApi.list(), chatLeadApi.list()]);

        if (enqResult.status === "fulfilled") {
            setEnquiries([...enqResult.value].sort(byNewest));
            setError(null);
            setStatus("ready");
            setLastUpdated(new Date());
        } else {
            setError(getErrorMessage(enqResult.reason, "Failed to load enquiries"));
            setStatus("error");
        }

        if (leadResult.status === "fulfilled") {
            setChatLeads(leadResult.value);
            setChatLeadsError(null);
        } else {
            setChatLeadsError(getErrorMessage(leadResult.reason, "Failed to load chat leads"));
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
        reload();
    }, [reload]);

    const upsert = useCallback((enquiry: Enquiry) => {
        setEnquiries((prev) => {
            const idx = prev.findIndex((e) => e._id === enquiry._id);
            if (idx === -1) return [enquiry, ...prev].sort(byNewest);
            const next = [...prev];
            next[idx] = enquiry;
            return next;
        });
        setLastUpdated(new Date());
    }, []);

    const removeEnquiries = useCallback((ids: string[]) => {
        const set = new Set(ids);
        setEnquiries((prev) => prev.filter((e) => !set.has(e._id)));
    }, []);

    const removeChatLead = useCallback((id: string) => {
        setChatLeads((prev) => prev.filter((l) => l._id !== id));
    }, []);

    useEffect(() => {
        const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
        socket.on("connect", () => setLive(true));
        socket.on("disconnect", () => setLive(false));
        socket.on("new-enquiry", (enquiry: Enquiry) => {
            upsert(enquiry);
            toast.success(`New enquiry from ${enquiry.name}`, { icon: "📩" });
        });
        socket.on("enquiry-updated", (enquiry: Enquiry) => upsert(enquiry));
        return () => {
            socket.disconnect();
        };
    }, [upsert]);

    const value = useMemo(
        () => ({ enquiries, chatLeads, status, error, chatLeadsError, lastUpdated, live, reload, upsert, removeEnquiries, removeChatLead }),
        [enquiries, chatLeads, status, error, chatLeadsError, lastUpdated, live, reload, upsert, removeEnquiries, removeChatLead],
    );

    return <EnquiryDataContext.Provider value={value}>{children}</EnquiryDataContext.Provider>;
}
