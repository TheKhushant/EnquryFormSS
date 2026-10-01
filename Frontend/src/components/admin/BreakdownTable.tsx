import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import type { BreakdownRow } from "../../lib/analytics";
import { formatDuration, formatNumber, formatPercent } from "../../lib/analytics";
import { Delta, Meter } from "./ui";
import { cx } from "../../lib/cx";

type SortKey = keyof Pick<BreakdownRow, "key" | "total" | "change" | "contacted" | "open" | "converted" | "lost" | "conversionRate" | "medianResponseMs" | "pendingFollowUps">;

interface Column {
    key: SortKey;
    label: string;
    title?: string;
    render: (r: BreakdownRow) => ReactNode;
    hideOnMobile?: boolean;
}

/**
 * Ranking table for any dimension. Rows link to the Enquiries list filtered
 * by that value (keeping the current date range).
 */
export default function BreakdownTable({
    rows, dimensionLabel, filterKey, showComparison, showResponse, showFollowUps, limit,
}: {
    rows: BreakdownRow[];
    dimensionLabel: string;
    filterKey?: string;
    showComparison?: boolean;
    showResponse?: boolean;
    showFollowUps?: boolean;
    limit?: number;
}) {
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "total", dir: -1 });
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const sorted = useMemo(() => {
        const list = [...rows];
        list.sort((a, b) => {
            const av = a[sort.key];
            const bv = b[sort.key];
            if (av === bv) return b.total - a.total;
            if (av === null) return 1;
            if (bv === null) return -1;
            return (av < bv ? -1 : 1) * sort.dir;
        });
        return list;
    }, [rows, sort]);

    const visible = limit && !expanded ? sorted.slice(0, limit) : sorted;
    const maxTotal = Math.max(1, ...rows.map((r) => r.total));

    const columns: Column[] = [
        { key: "total", label: "Enquiries", render: (r) => <span className="font-semibold text-slate-900">{formatNumber(r.total)}</span> },
        ...(showComparison ? [{ key: "change" as SortKey, label: "vs prev.", title: "Change in enquiries vs the comparison period", render: (r: BreakdownRow) => r.previous === 0 && r.total > 0 ? <span className="text-xs text-slate-500">new</span> : <Delta value={r.change} /> }] : []),
        { key: "contacted", label: "Contacted", hideOnMobile: true, render: (r) => formatNumber(r.contacted) },
        { key: "open", label: "Open", hideOnMobile: true, render: (r) => formatNumber(r.open) },
        { key: "converted", label: "Converted", render: (r) => <span className="text-emerald-700">{formatNumber(r.converted)}</span> },
        { key: "lost", label: "Lost", hideOnMobile: true, render: (r) => <span className="text-rose-700">{formatNumber(r.lost)}</span> },
        { key: "conversionRate", label: "Conv. rate", title: "Converted ÷ enquiries", render: (r) => formatPercent(r.conversionRate) },
        ...(showResponse ? [{ key: "medianResponseMs" as SortKey, label: "Median response", hideOnMobile: true, title: "Median time from enquiry to first contact (where recorded)", render: (r: BreakdownRow) => formatDuration(r.medianResponseMs) }] : []),
        ...(showFollowUps ? [{ key: "pendingFollowUps" as SortKey, label: "Follow-ups", hideOnMobile: true, title: "Pending follow-ups (overdue in red)", render: (r: BreakdownRow) => <>{formatNumber(r.pendingFollowUps)}{r.overdueFollowUps > 0 && <span className="ml-1 text-xs text-rose-600">({r.overdueFollowUps} late)</span>}</> }] : []),
    ];

    const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === "key" ? 1 : -1 }));

    const openRow = (key: string) => {
        if (!filterKey) return;
        const next = new URLSearchParams();
        ["range", "from", "to"].forEach((k) => params.get(k) && next.set(k, params.get(k)!));
        next.set(filterKey, key);
        navigate(`/dashboard/enquiries?${next.toString()}`);
    };

    if (!rows.length) return <p className="px-5 py-10 text-center text-sm text-slate-500">No enquiries in this period.</p>;

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-y border-violet-100 bg-violet-50/40 text-xs text-slate-500">
                        <tr>
                            <SortHeader col="key" label={dimensionLabel} className="pl-5 text-left" sort={sort} onSort={toggleSort} />
                            {columns.map((c) => <SortHeader key={c.key} col={c.key} label={c.label} title={c.title} sort={sort} onSort={toggleSort} className={cx("text-right", c.hideOnMobile && "hidden md:table-cell")} />)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-violet-50">
                        {visible.map((r) => (
                            <tr
                                key={r.key}
                                onClick={() => openRow(r.key)}
                                className={cx("tabular-nums", filterKey && "cursor-pointer hover:bg-violet-50/50")}
                            >
                                <td className="max-w-[220px] py-2.5 pl-5 pr-3">
                                    <span className="block truncate font-medium text-slate-800" title={r.key}>{r.key}</span>
                                    <div className="mt-1 w-full max-w-[160px]"><Meter value={r.total / maxTotal} label={`${r.key} share`} /></div>
                                </td>
                                {columns.map((c) => (
                                    <td key={c.key} className={cx("whitespace-nowrap px-3 py-2.5 text-right text-slate-600", c.hideOnMobile && "hidden md:table-cell")}>{c.render(r)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {limit && rows.length > limit && (
                <button type="button" onClick={() => setExpanded((e) => !e)} className="w-full border-t border-violet-100 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-50/50">
                    {expanded ? "Show less" : `Show all ${rows.length}`}
                </button>
            )}
        </div>
    );
}

function SortHeader({ col, label, title, className, sort, onSort }: {
    col: SortKey;
    label: string;
    title?: string;
    className?: string;
    sort: { key: SortKey; dir: 1 | -1 };
    onSort: (key: SortKey) => void;
}) {
    return (
        <th scope="col" className={cx("whitespace-nowrap px-3 py-2.5 font-medium", className)} aria-sort={sort.key === col ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
            <button type="button" onClick={() => onSort(col)} title={title} className="inline-flex items-center gap-0.5 hover:text-slate-900">
                {label}
                {sort.key === col && (sort.dir === 1 ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}
            </button>
        </th>
    );
}
