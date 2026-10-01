import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon, DocumentDuplicateIcon, MagnifyingGlassIcon, TrashIcon, ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import type { Enquiry } from "../../components/site/types";
import { useFilteredEnquiries } from "../hooks/useDashboardFilters";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import FilterBar from "../components/admin/FilterBar";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import DuplicatesDialog from "../components/admin/DuplicatesDialog";
import { Button, Card, EmptyState, PageHeader, PriorityBadge, Select, StatusBadge, Tag } from "../components/admin/ui";
import { cx } from "../lib/cx";
import { enquiryApi, getErrorMessage, type EnquiryUpdate } from "../lib/api";
import {
    formatDate, formatNumber, formatRelative, getCategory, getCollege, getOwner, getPriority, getProgram, getSource,
    getSourceDetail, getStatus, NOT_SPECIFIED, PRIORITIES, STATUSES, toDate,
} from "../lib/analytics";
import { downloadCsv, fileStamp, toCsv } from "../lib/csv";
import { ENQUIRY_CSV_COLUMNS } from "../lib/enquiryExport";

type ColumnId = "createdAt" | "name" | "mobile" | "college" | "category" | "program" | "duration" | "experience" | "owner" | "source" | "status" | "priority" | "followUp";

interface Column {
    id: ColumnId;
    label: string;
    sortValue?: (e: Enquiry) => string | number;
    render: (e: Enquiry, now: Date) => ReactNode;
    defaultVisible: boolean;
    className?: string;
}

const nextFollowUp = (e: Enquiry) => {
    const pending = (e.followUps || []).filter((f) => !f.completedAt).map((f) => toDate(f.dueAt)!).filter(Boolean);
    return pending.sort((a, b) => a.getTime() - b.getTime())[0] || null;
};

const COLUMNS: Column[] = [
    {
        id: "createdAt", label: "Received", defaultVisible: true, sortValue: (e) => e.createdAt,
        render: (e) => (
            <span className="whitespace-nowrap">
                <span className="block text-slate-800">{formatDate(e.createdAt)}</span>
                <span className="text-xs text-slate-500">{new Date(e.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span>
            </span>
        ),
    },
    {
        id: "name", label: "Name", defaultVisible: true, sortValue: (e) => e.name?.toLowerCase() || "",
        render: (e) => (
            <>
                <span className="block font-medium text-slate-900">{e.name}</span>
                <span className="block max-w-[200px] truncate text-xs text-slate-500">{e.email}</span>
            </>
        ),
    },
    { id: "mobile", label: "Mobile", defaultVisible: true, render: (e) => <span className="whitespace-nowrap">{e.mobile}</span> },
    { id: "college", label: "College", defaultVisible: true, sortValue: getCollege, render: (e) => <span className="block max-w-[180px] truncate" title={getCollege(e)}>{getCollege(e)}</span> },
    { id: "category", label: "Enquiry for", defaultVisible: true, sortValue: getCategory, render: (e) => <Tag>{getCategory(e)}</Tag> },
    { id: "program", label: "Course / domain", defaultVisible: true, sortValue: getProgram, render: (e) => (getProgram(e) === NOT_SPECIFIED ? "—" : getProgram(e)) },
    { id: "duration", label: "Duration", defaultVisible: false, render: (e) => e.internshipDuration || "—" },
    { id: "experience", label: "Experience", defaultVisible: false, render: (e) => e.experience || "—" },
    { id: "owner", label: "Counselor", defaultVisible: true, sortValue: getOwner, render: (e) => <span className="whitespace-nowrap">{getOwner(e)}</span> },
    {
        id: "source", label: "Source", defaultVisible: true, sortValue: getSource,
        render: (e) => (
            <>
                <span className="block">{getSource(e)}</span>
                {getSourceDetail(e) && <span className="text-xs text-slate-500">{getSourceDetail(e)}</span>}
            </>
        ),
    },
    { id: "status", label: "Status", defaultVisible: true, sortValue: (e) => STATUSES.indexOf(getStatus(e)), render: (e) => <StatusBadge status={getStatus(e)} outcome={e.outcome} /> },
    { id: "priority", label: "Priority", defaultVisible: true, sortValue: (e) => PRIORITIES.indexOf(getPriority(e)), render: (e) => <PriorityBadge priority={getPriority(e)} /> },
    {
        id: "followUp", label: "Next follow-up", defaultVisible: false, sortValue: (e) => nextFollowUp(e)?.getTime() ?? Number.MAX_SAFE_INTEGER,
        render: (e, now) => {
            const d = nextFollowUp(e);
            if (!d) return "—";
            return <span className={cx("whitespace-nowrap", d < now && "font-medium text-rose-600")}>{formatRelative(d, now)}</span>;
        },
    },
];

const COLUMN_STORAGE = "ss_enquiry_columns";
const PAGE_SIZES = [25, 50, 100];

function loadColumns(): ColumnId[] {
    try {
        const saved = JSON.parse(localStorage.getItem(COLUMN_STORAGE) || "null");
        if (Array.isArray(saved)) return saved.filter((id) => COLUMNS.some((c) => c.id === id));
    } catch {
        // ignore unreadable preferences
    }
    return COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id);
}

type BulkAction = { kind: "delete" } | { kind: "update"; updates: EnquiryUpdate; label: string };

export default function EnquiriesPage() {
    const { current, range, prevRange, options, filters, upsert, removeEnquiries } = useFilteredEnquiries();
    const navigate = useNavigate();
    const { params, update, q } = filters;
    const [now] = useState(() => new Date());

    // ---------- search (debounced into the URL) ----------
    const [search, setSearch] = useState(q);
    const [syncedQ, setSyncedQ] = useState(q);
    if (q !== syncedQ) {
        // q changed from outside (global search, "clear all"): mirror it in the input.
        setSyncedQ(q);
        setSearch(q);
    }
    const debounced = useDebouncedValue(search, 300);
    useEffect(() => {
        if (debounced === search && debounced !== q) update({ q: debounced || null });
    }, [debounced, search, q, update]);

    // ---------- sorting & paging (URL) ----------
    const sortId = (params.get("sort") as ColumnId) || "createdAt";
    const dir = params.get("dir") === "asc" ? 1 : -1;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const [pageSize, setPageSize] = useState(() => {
        try {
            return Number(localStorage.getItem("ss_enquiry_page_size")) || 25;
        } catch {
            return 25;
        }
    });

    const [visibleCols, setVisibleCols] = useState<ColumnId[]>(loadColumns);
    const [showColumns, setShowColumns] = useState(false);
    const columns = COLUMNS.filter((c) => visibleCols.includes(c.id));

    const sorted = useMemo(() => {
        const col = COLUMNS.find((c) => c.id === sortId)?.sortValue ? COLUMNS.find((c) => c.id === sortId)! : COLUMNS[0];
        const get = col.sortValue!;
        return [...current].sort((a, b) => {
            const av = get(a);
            const bv = get(b);
            if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
            return av === bv ? 0 : (av < bv ? -1 : 1) * dir;
        });
    }, [current, sortId, dir]);

    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, pageCount);
    const rows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    // ---------- selection ----------
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [selectionScope, setSelectionScope] = useState(current);
    if (selectionScope !== current) {
        // Filters or data changed: never keep (and bulk-act on) rows that are no longer visible.
        setSelectionScope(current);
        const ids = new Set(current.map((e) => e._id));
        if ([...selected].some((id) => !ids.has(id))) setSelected(new Set([...selected].filter((id) => ids.has(id))));
    }
    const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(r._id));
    const toggleOne = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    const togglePage = () =>
        setSelected((prev) => {
            const next = new Set(prev);
            rows.forEach((r) => (allOnPageSelected ? next.delete(r._id) : next.add(r._id)));
            return next;
        });

    // ---------- actions ----------
    const [pending, setPending] = useState<BulkAction | null>(null);
    const [deleteOne, setDeleteOne] = useState<Enquiry | null>(null);
    const [busy, setBusy] = useState(false);
    const [showDuplicates, setShowDuplicates] = useState(false);

    const runBulk = async () => {
        if (!pending) return;
        const ids = [...selected];
        setBusy(true);
        try {
            if (pending.kind === "delete") {
                const res = await enquiryApi.bulkRemove(ids);
                removeEnquiries(ids);
                toast.success(res.message || `${ids.length} deleted`);
            } else {
                const res = await enquiryApi.bulkUpdate(ids, pending.updates);
                (res.data || []).forEach(upsert);
                toast.success(res.message || `${ids.length} updated`);
            }
            setSelected(new Set());
            setPending(null);
        } catch (e) {
            toast.error(getErrorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    const runDeleteOne = async () => {
        if (!deleteOne) return;
        setBusy(true);
        try {
            await enquiryApi.remove(deleteOne._id);
            removeEnquiries([deleteOne._id]);
            toast.success("Enquiry deleted");
            setDeleteOne(null);
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to delete enquiry"));
        } finally {
            setBusy(false);
        }
    };

    const exportRows = (list: Enquiry[], name: string) => {
        downloadCsv(`${name}-${fileStamp()}`, toCsv(list, ENQUIRY_CSV_COLUMNS));
        toast.success(`Exported ${list.length} enquiries`);
    };

    const setSort = (id: ColumnId) => {
        if (sortId === id) update({ sort: id, dir: dir === 1 ? "desc" : "asc" });
        else update({ sort: id, dir: id === "createdAt" || id === "followUp" ? (id === "followUp" ? "asc" : "desc") : "asc" });
    };

    const toggleColumn = (id: ColumnId) => {
        setVisibleCols((prev) => {
            const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
            try {
                localStorage.setItem(COLUMN_STORAGE, JSON.stringify(next));
            } catch {
                // preference not persisted
            }
            return next;
        });
    };

    const ownerOptions = options.owner.filter((o) => o !== "Unassigned");

    return (
        <>
            <PageHeader
                title="Enquiries"
                description={`${formatNumber(sorted.length)} matching · ${range.label}`}
                actions={
                    <>
                        <Button icon={DocumentDuplicateIcon} onClick={() => setShowDuplicates(true)}>Duplicates</Button>
                        <Button icon={ArrowDownTrayIcon} onClick={() => exportRows(sorted, "enquiries")} disabled={!sorted.length}>Export CSV</Button>
                    </>
                }
            />
            <FilterBar options={options} range={range} prevRange={prevRange} />

            <Card className="overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 border-b border-violet-100 p-3">
                    <div className="relative w-full sm:w-auto sm:min-w-0 sm:max-w-xs sm:flex-1">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, mobile, email, ID…"
                            aria-label="Search enquiries"
                            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                        />
                    </div>
                    <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
                        {["", ...STATUSES].map((s) => (
                            <button
                                key={s || "all"}
                                type="button"
                                onClick={() => update({ status: s || null })}
                                className={cx(
                                    "shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                                    filters.values.status === s ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-violet-50",
                                )}
                            >
                                {s || "All"}
                            </button>
                        ))}
                    </div>
                    <div className="relative ml-auto hidden md:block">
                        <Button size="sm" icon={ViewColumnsIcon} onClick={() => setShowColumns((s) => !s)} aria-expanded={showColumns}>Columns</Button>
                        {showColumns && (
                            <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-violet-100 bg-white p-2 shadow-xl">
                                {COLUMNS.map((c) => (
                                    <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-violet-50">
                                        <input type="checkbox" checked={visibleCols.includes(c.id)} onChange={() => toggleColumn(c.id)} className="h-4 w-4 accent-violet-600" />
                                        {c.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bulk bar */}
                {selected.size > 0 && (
                    <div className="flex flex-wrap items-center gap-2 border-b border-violet-100 bg-violet-50 px-3 py-2 text-sm">
                        <span className="font-medium text-violet-900">{selected.size} selected</span>
                        {selected.size < sorted.length && (
                            <button type="button" className="text-xs font-medium text-violet-700 underline" onClick={() => setSelected(new Set(sorted.map((e) => e._id)))}>
                                Select all {sorted.length}
                            </button>
                        )}
                        <span className="mx-1 hidden h-4 w-px bg-violet-200 sm:block" />
                        <BulkSelect label="Set status" options={STATUSES} onPick={(v) => setPending({ kind: "update", updates: { status: v as Enquiry["status"] }, label: `Set status to ${v}` })} />
                        <BulkSelect label="Set outcome" options={["Converted", "Not Converted"]} onPick={(v) => setPending({ kind: "update", updates: { outcome: v as Enquiry["outcome"] }, label: `Close as ${v}` })} />
                        <BulkSelect label="Set priority" options={[...PRIORITIES]} onPick={(v) => setPending({ kind: "update", updates: { priority: v as Enquiry["priority"] }, label: `Set priority to ${v}` })} />
                        {ownerOptions.length > 0 && (
                            <BulkSelect label="Assign to" options={ownerOptions} onPick={(v) => setPending({ kind: "update", updates: { assignedTo: v }, label: `Assign to ${v}` })} />
                        )}
                        <Button size="sm" icon={ArrowDownTrayIcon} onClick={() => exportRows(sorted.filter((e) => selected.has(e._id)), "enquiries-selected")}>Export</Button>
                        <Button size="sm" variant="danger" icon={TrashIcon} onClick={() => setPending({ kind: "delete" })}>Delete</Button>
                        <button type="button" onClick={() => setSelected(new Set())} className="ml-auto text-xs text-slate-500 hover:text-slate-800">Clear selection</button>
                    </div>
                )}

                {sorted.length === 0 ? (
                    <EmptyState
                        title="No enquiries match"
                        description="Try a wider date range or clear some filters."
                        action={<Button onClick={() => update({ range: "all", q: null, status: null, source: null, category: null, program: null, college: null, owner: null, priority: null, outcome: null })}>Show all enquiries</Button>}
                    />
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="relative hidden max-h-[calc(100vh-260px)] overflow-auto md:block">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10 bg-[#faf8ff] text-xs text-slate-500 shadow-[0_1px_0_#ede9fe]">
                                    <tr>
                                        <th scope="col" className="w-10 px-3 py-2.5">
                                            <input type="checkbox" checked={allOnPageSelected} onChange={togglePage} aria-label="Select all on this page" className="h-4 w-4 accent-violet-600" />
                                        </th>
                                        {columns.map((c) => (
                                            <th key={c.id} scope="col" className="whitespace-nowrap px-3 py-2.5 text-left font-medium" aria-sort={sortId === c.id ? (dir === 1 ? "ascending" : "descending") : undefined}>
                                                {c.sortValue ? (
                                                    <button type="button" onClick={() => setSort(c.id)} className="inline-flex items-center gap-0.5 hover:text-slate-900">
                                                        {c.label}
                                                        {sortId === c.id && (dir === 1 ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}
                                                    </button>
                                                ) : c.label}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-3 py-2.5"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-violet-50">
                                    {rows.map((e) => (
                                        <tr
                                            key={e._id}
                                            onClick={() => navigate(`/dashboard/enquiries/${e._id}`)}
                                            className={cx("cursor-pointer align-top text-slate-600 hover:bg-violet-50/50", selected.has(e._id) && "bg-violet-50/70")}
                                        >
                                            <td className="px-3 py-3" onClick={(ev) => ev.stopPropagation()}>
                                                <input type="checkbox" checked={selected.has(e._id)} onChange={() => toggleOne(e._id)} aria-label={`Select ${e.name}`} className="h-4 w-4 accent-violet-600" />
                                            </td>
                                            {columns.map((c) => <td key={c.id} className="px-3 py-3">{c.render(e, now)}</td>)}
                                            <td className="px-3 py-3 text-right" onClick={(ev) => ev.stopPropagation()}>
                                                <button type="button" onClick={() => setDeleteOne(e)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete enquiry from ${e.name}`} title="Delete">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <ul className="divide-y divide-violet-50 md:hidden">
                            {rows.map((e) => (
                                <li key={e._id} className={cx("flex gap-3 px-3 py-3", selected.has(e._id) && "bg-violet-50/70")}>
                                    <input type="checkbox" checked={selected.has(e._id)} onChange={() => toggleOne(e._id)} aria-label={`Select ${e.name}`} className="mt-1 h-4 w-4 shrink-0 accent-violet-600" />
                                    <Link to={`/dashboard/enquiries/${e._id}`} className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="truncate font-medium text-slate-900">{e.name}</span>
                                            <StatusBadge status={getStatus(e)} outcome={e.outcome} />
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-500">{e.mobile} · {formatRelative(e.createdAt, now)}</p>
                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                            <Tag>{getCategory(e)}</Tag>
                                            {getProgram(e) !== NOT_SPECIFIED && <Tag className="bg-slate-100 text-slate-600">{getProgram(e)}</Tag>}
                                        </div>
                                        <p className="mt-1 truncate text-xs text-slate-500">{getCollege(e)}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Pagination */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-violet-100 px-3 py-2.5 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="hidden whitespace-nowrap sm:inline">Rows per page</span>
                                <Select
                                    value={pageSize}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setPageSize(v);
                                        try {
                                            localStorage.setItem("ss_enquiry_page_size", String(v));
                                        } catch {
                                            // preference not persisted
                                        }
                                        update({ page: null });
                                    }}
                                    className="w-20 py-1.5"
                                    aria-label="Rows per page"
                                >
                                    {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
                                </Select>
                            </div>
                            <span className="tabular-nums">
                                {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} of {formatNumber(sorted.length)}
                            </span>
                            <div className="flex gap-1">
                                <Button size="sm" icon={ChevronLeftIcon} disabled={safePage <= 1} onClick={() => update({ page: String(safePage - 1) })} aria-label="Previous page" />
                                <Button size="sm" icon={ChevronRightIcon} disabled={safePage >= pageCount} onClick={() => update({ page: String(safePage + 1) })} aria-label="Next page" />
                            </div>
                        </div>
                    </>
                )}
            </Card>

            <ConfirmDialog
                open={!!pending}
                busy={busy}
                tone={pending?.kind === "delete" ? "danger" : "primary"}
                title={pending?.kind === "delete" ? `Delete ${selected.size} enquiries?` : `${pending?.kind === "update" ? pending.label : ""} for ${selected.size} enquiries?`}
                message={pending?.kind === "delete" ? "This permanently removes them, including their notes and follow-ups. This cannot be undone." : "Each change is recorded in the enquiry's activity timeline."}
                confirmLabel={pending?.kind === "delete" ? "Delete" : "Apply"}
                onConfirm={runBulk}
                onCancel={() => setPending(null)}
            />
            <ConfirmDialog
                open={!!deleteOne}
                busy={busy}
                title="Delete this enquiry?"
                message={deleteOne && <>The enquiry from <strong>{deleteOne.name}</strong> ({deleteOne.mobile}) will be permanently deleted.</>}
                confirmLabel="Delete"
                onConfirm={runDeleteOne}
                onCancel={() => setDeleteOne(null)}
            />
            <DuplicatesDialog open={showDuplicates} onClose={() => setShowDuplicates(false)} onDeleted={removeEnquiries} />
        </>
    );
}

function BulkSelect({ label, options, onPick }: { label: string; options: readonly string[]; onPick: (v: string) => void }) {
    return (
        <select
            value=""
            onChange={(e) => e.target.value && onPick(e.target.value)}
            aria-label={label}
            className="rounded-lg border border-violet-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
            <option value="">{label}…</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
    );
}
