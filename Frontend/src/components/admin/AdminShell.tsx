import EnquiryDataProvider from "../../context/EnquiryDataProvider";
import AdminLayout from "./AdminLayout";

/** Lazy-loaded entry for the whole admin area: data provider + layout. */
export default function AdminShell() {
    return (
        <EnquiryDataProvider>
            <AdminLayout />
        </EnquiryDataProvider>
    );
}
