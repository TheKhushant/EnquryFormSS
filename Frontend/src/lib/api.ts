import axios from "axios";
import type { ChatLead, Enquiry, EnquiryOutcome, EnquiryPriority, EnquiryStatus } from "../../components/site/types";

export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://enquryformss-2.onrender.com";

export const http = axios.create({ baseURL: `${API_BASE_URL}/api` });

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type EnquiryUpdate = Partial<{
    status: EnquiryStatus;
    priority: EnquiryPriority;
    assignedTo: string;
    outcome: EnquiryOutcome;
}>;

export const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 && !error.response.data?.message) {
            return "This action isn't available on the server yet. Please redeploy the backend.";
        }
        return error.response?.data?.message || error.message || fallback;
    }
    return error instanceof Error ? error.message : fallback;
};

export const enquiryApi = {
    list: async () => {
        const res = await http.get<ApiResponse<Enquiry[]>>("/enquiries");
        return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    get: async (id: string) => (await http.get<ApiResponse<Enquiry>>(`/enquiries/${id}`)).data.data,
    update: async (id: string, updates: EnquiryUpdate) =>
        (await http.patch<ApiResponse<Enquiry>>(`/enquiries/${id}`, updates)).data.data,
    bulkUpdate: async (ids: string[], updates: EnquiryUpdate) =>
        (await http.patch<ApiResponse<Enquiry[]>>("/enquiries/bulk", { ids, updates })).data,
    remove: async (id: string) => (await http.delete(`/enquiries/${id}`)).data,
    bulkRemove: async (ids: string[]) =>
        (await http.post<{ deletedCount: number; message: string }>("/enquiries/bulk-delete", { ids })).data,
    addNote: async (id: string, text: string) =>
        (await http.post<ApiResponse<Enquiry>>(`/enquiries/${id}/notes`, { text })).data.data,
    addFollowUp: async (id: string, dueAt: string, note: string) =>
        (await http.post<ApiResponse<Enquiry>>(`/enquiries/${id}/follow-ups`, { dueAt, note })).data.data,
    completeFollowUp: async (id: string, followUpId: string, result: string) =>
        (await http.patch<ApiResponse<Enquiry>>(`/enquiries/${id}/follow-ups/${followUpId}/complete`, { result })).data.data,
    deleteFollowUp: async (id: string, followUpId: string) =>
        (await http.delete<ApiResponse<Enquiry>>(`/enquiries/${id}/follow-ups/${followUpId}`)).data.data,
    duplicates: async () =>
        (await http.get<ApiResponse<DuplicateGroup[]>>("/enquiries/duplicates")).data.data || [],
    deleteDuplicates: async (ids: string[]) =>
        (await http.post<{ message: string }>("/enquiries/delete-duplicates", { ids })).data,
    removeDuplicates: async () =>
        (await http.delete<{ message: string }>("/enquiries/remove-duplicates")).data,
};

export interface DuplicateGroup {
    mobile: string;
    date: string;
    count: number;
    entries: Enquiry[];
}

export const chatLeadApi = {
    list: async () => {
        const res = await http.get<ApiResponse<ChatLead[]>>("/chat-leads");
        return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    remove: async (id: string) => (await http.delete(`/chat-leads/${id}`)).data,
};
