import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { enquiryApi, getErrorMessage, type DuplicateGroup } from "../../lib/api";
import { formatDate } from "../../lib/analytics";
import { Button, EmptyState } from "./ui";

/**
 * Review same-day duplicate submissions (same mobile, same day) and delete
 * selected entries. At least one entry per group must be kept.
 */
export default function DuplicatesDialog({ open, onClose, onDeleted }: { open: boolean; onClose: () => void; onDeleted: (ids: string[]) => void }) {
    const ref = useRef<HTMLDialogElement>(null);
    const [groups, setGroups] = useState<DuplicateGroup[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<string[]>([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
        if (!open) return;

        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when the dialog opens
        setGroups(null);
        setError(null);
        setSelected([]);
        enquiryApi.duplicates()
            .then((g) => {
                if (cancelled) return;
                setGroups(g);
                // Pre-select every entry except the oldest in each group.
                setSelected(g.flatMap((grp) => [...grp.entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(1).map((e) => e._id)));
            })
            .catch((e) => !cancelled && setError(getErrorMessage(e, "Failed to scan duplicates")));
        return () => {
            cancelled = true;
        };
    }, [open]);

    const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const remove = async () => {
        for (const group of groups || []) {
            if (group.entries.every((e) => selected.includes(e._id))) {
                toast.error(`Keep at least one enquiry for ${group.mobile}`);
                return;
            }
        }
        setBusy(true);
        try {
            const res = await enquiryApi.deleteDuplicates(selected);
            toast.success(res.message || "Duplicates deleted");
            onDeleted(selected);
            onClose();
        } catch (e) {
            toast.error(getErrorMessage(e, "Delete failed"));
        } finally {
            setBusy(false);
        }
    };

    return (
        <dialog
            ref={ref}
            onCancel={(e) => {
                e.preventDefault();
                if (!busy) onClose();
            }}
            className="m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl flex-col rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-slate-900/40 open:flex"
        >
            <div className="flex items-center justify-between border-b border-violet-100 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Duplicate enquiries</h2>
                    <p className="text-xs text-slate-500">Same mobile number submitted more than once on the same day. Oldest entry is kept by default.</p>
                </div>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close">
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
                {error && <p className="text-sm text-rose-600">{error}</p>}
                {!groups && !error && <p className="text-sm text-slate-500">Scanning…</p>}
                {groups?.length === 0 && <EmptyState compact title="No duplicates found" description="Every mobile number appears at most once per day." />}
                <div className="space-y-3">
                    {groups?.map((g) => (
                        <fieldset key={`${g.mobile}_${g.date}`} className="rounded-xl border border-violet-100 p-3">
                            <legend className="px-1 text-sm font-semibold text-slate-800">{g.mobile} <span className="font-normal text-slate-500">· {formatDate(g.date)} · {g.count} entries</span></legend>
                            {g.entries.map((e) => (
                                <label key={e._id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-violet-50">
                                    <input type="checkbox" checked={selected.includes(e._id)} onChange={() => toggle(e._id)} className="h-4 w-4 accent-rose-600" />
                                    <span className="flex-1">{e.name} <span className="text-slate-500">· {e.enquiryFor}</span></span>
                                    <span className="text-xs text-slate-500">{new Date(e.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span>
                                </label>
                            ))}
                        </fieldset>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-b-2xl bg-slate-50 px-5 py-3">
                <span className="text-xs text-slate-500">{selected.length} selected for deletion</span>
                <div className="flex gap-2">
                    <Button onClick={onClose} disabled={busy}>Cancel</Button>
                    <Button variant="danger" onClick={remove} disabled={busy || !selected.length}>{busy ? "Deleting…" : "Delete selected"}</Button>
                </div>
            </div>
        </dialog>
    );
}
