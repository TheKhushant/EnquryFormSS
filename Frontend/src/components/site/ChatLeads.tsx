import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDownTrayIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { ChatLead } from "../../../components/site/types";
import { chatLeadApi, getErrorMessage } from "../../lib/api";
import { formatDateTime, formatRelative } from "../../lib/analytics";
import { downloadCsv, fileStamp, toCsv } from "../../lib/csv";
import ConfirmDialog from "../admin/ConfirmDialog";
import { Button, Card, CardHeader, EmptyState, Tag } from "../admin/ui";

interface Props {
    leads: ChatLead[];
    onDeleted: (id: string) => void;
}

const ChatLeads = ({ leads, onDeleted }: Props) => {
    const [search, setSearch] = useState("");
    const [pendingDelete, setPendingDelete] = useState<ChatLead | null>(null);
    const [busy, setBusy] = useState(false);
    const [now] = useState(() => new Date());

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q ? leads.filter((l) => [l.name, l.mobile, l.interest].some((v) => v?.toLowerCase().includes(q))) : leads;
    }, [leads, search]);

    const handleDelete = async () => {
        if (!pendingDelete) return;
        setBusy(true);
        try {
            await chatLeadApi.remove(pendingDelete._id);
            onDeleted(pendingDelete._id);
            toast.success("Lead deleted");
            setPendingDelete(null);
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to delete lead"));
        } finally {
            setBusy(false);
        }
    };

    const exportCsv = () =>
        downloadCsv(
            `chatbot-leads-${fileStamp()}`,
            toCsv(filtered, [
                { header: "Name", value: (l) => l.name },
                { header: "Mobile", value: (l) => l.mobile },
                { header: "Interest", value: (l) => l.interest },
                { header: "Date", value: (l) => formatDateTime(l.createdAt) },
            ]),
        );

    return (
        <Card>
            <CardHeader
                title="Chatbot leads"
                subtitle={`${leads.length} leads captured by the website chatbot`}
                action={<Button size="sm" icon={ArrowDownTrayIcon} onClick={exportCsv} disabled={!filtered.length}>Export</Button>}
            />
            <div className="px-5 pt-4">
                <div className="relative max-w-xs">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, mobile, interest" aria-label="Search chatbot leads"
                        className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={ChatBubbleLeftRightIcon} title={leads.length ? "No leads match your search" : "No chatbot leads found"} />
            ) : (
                <div className="relative mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-y border-violet-100 bg-violet-50/40 text-xs text-slate-500">
                            <tr>
                                <th scope="col" className="py-2.5 pl-5 pr-3 text-left font-medium">Name</th>
                                <th scope="col" className="px-3 py-2.5 text-left font-medium">Mobile</th>
                                <th scope="col" className="px-3 py-2.5 text-left font-medium">Interest</th>
                                <th scope="col" className="px-3 py-2.5 text-left font-medium">Date</th>
                                <th scope="col" className="px-3 py-2.5"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-50">
                            {filtered.map((lead) => (
                                <tr key={lead._id} className="hover:bg-violet-50/40">
                                    <td className="py-2.5 pl-5 pr-3 font-medium text-slate-900">{lead.name}</td>
                                    <td className="px-3 py-2.5"><a href={`tel:${lead.mobile}`} className="text-violet-700 hover:underline">{lead.mobile}</a></td>
                                    <td className="px-3 py-2.5"><Tag className="max-w-[260px]">{lead.interest}</Tag></td>
                                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-600" title={formatDateTime(lead.createdAt)}>{formatRelative(lead.createdAt, now)}</td>
                                    <td className="px-3 py-2.5 text-right">
                                        <button type="button" onClick={() => setPendingDelete(lead)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete lead ${lead.name}`}>
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                open={!!pendingDelete}
                busy={busy}
                title="Delete this lead?"
                message={pendingDelete && <>The chatbot lead from <strong>{pendingDelete.name}</strong> will be permanently deleted.</>}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </Card>
    );
};

export default ChatLeads;
