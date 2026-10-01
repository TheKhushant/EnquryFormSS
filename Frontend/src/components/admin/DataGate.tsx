import type { ReactNode } from "react";
import { useEnquiryData } from "../../context/enquiryData";
import { ErrorState, PageSkeleton } from "./ui";

/** Shows the skeleton / error state until enquiry data is available. */
export default function DataGate({ children }: { children: ReactNode }) {
    const { status, error, reload, enquiries } = useEnquiryData();
    if (status === "loading" && !enquiries.length) return <PageSkeleton />;
    if (status === "error" && !enquiries.length) return <ErrorState message={error || "Failed to load enquiries"} onRetry={reload} />;
    return <>{children}</>;
}
