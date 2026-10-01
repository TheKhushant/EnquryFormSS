import { useState } from "react";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FILTER_KEYS, OUTCOME_FILTERS, useDashboardFilters, type FilterKey } from "../../hooks/useDashboardFilters";
import { RANGE_OPTIONS, addDays, formatDate, startOfDay, toDateInput, type DateRange } from "../../lib/analytics";
import { Button, Select } from "./ui";
import { cx } from "../../lib/cx";

const LABELS: Record<FilterKey, string> = {
    status: "Status",
    source: "Source",
    category: "Enquiry type",
    program: "Course / domain",
    college: "College",
    country: "Preferred country",
    owner: "Counselor",
    priority: "Priority",
    outcome: "Outcome",
};

interface FilterBarProps {
    options: Record<string, string[]>;
    range: DateRange;
    prevRange?: DateRange | null;
    /** Dimension filters to offer; defaults to all. */
    keys?: readonly FilterKey[];
    showRange?: boolean;
}

/** Global filters, synced to the URL so the view can be bookmarked or shared. */
export default function FilterBar({ options, range, prevRange, keys = FILTER_KEYS, showRange = true }: FilterBarProps) {
    const { range: rangeKey, from, to, values, update, clear } = useDashboardFilters();
    const [open, setOpen] = useState(false);
    const active = keys.filter((k) => values[k]);

    const setRange = (value: string) => {
        if (value === "custom") {
            const today = startOfDay(new Date());
            update({ range: "custom", from: from || toDateInput(addDays(today, -29)), to: to || toDateInput(today) });
        } else {
            update({ range: value, from: null, to: null });
        }
    };

    const optionLabel = (k: FilterKey, v: string) => (k === "outcome" ? OUTCOME_FILTERS.find((o) => o.value === v)?.label || v : v);

    return (
        <div className="mb-5 space-y-3 print:hidden">
            <div className="flex flex-wrap items-center gap-2">
                {showRange && (
                    <>
                        <div className="w-full sm:w-44">
                            <Select value={rangeKey} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
                                {RANGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </Select>
                        </div>
                        {rangeKey === "custom" && (
                            <div className="flex w-full items-center gap-2 sm:w-auto">
                                <input type="date" value={from || ""} max={to || undefined} onChange={(e) => update({ from: e.target.value })} aria-label="From date"
                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                                <span className="text-slate-400">–</span>
                                <input type="date" value={to || ""} min={from || undefined} onChange={(e) => update({ to: e.target.value })} aria-label="To date"
                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                            </div>
                        )}
                    </>
                )}
                <Button icon={AdjustmentsHorizontalIcon} onClick={() => setOpen((o) => !o)} aria-expanded={open} className={cx(open && "ring-violet-300 bg-violet-50 text-violet-700")}>
                    Filters{active.length > 0 && <span className="ml-0.5 rounded-full bg-violet-600 px-1.5 text-[11px] text-white">{active.length}</span>}
                </Button>
                {showRange && (
                    <p className="text-xs text-slate-500 sm:ml-1">
                        {formatDate(range.start)} – {formatDate(addDays(range.end, -1))}
                        {prevRange && <span className="hidden md:inline"> · compared with {formatDate(prevRange.start)} – {formatDate(addDays(prevRange.end, -1))}</span>}
                    </p>
                )}
            </div>

            {open && (
                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-violet-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                    {keys.map((k) => (
                        <Select key={k} label={LABELS[k]} value={values[k]} onChange={(e) => update({ [k]: e.target.value || null })}>
                            <option value="">All</option>
                            {k === "outcome"
                                ? OUTCOME_FILTERS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
                                : (options[k] || []).map((v) => <option key={v} value={v}>{v}</option>)}
                        </Select>
                    ))}
                </div>
            )}

            {active.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {active.map((k) => (
                        <span key={k} className="inline-flex items-center gap-1 rounded-full bg-violet-100 py-1 pl-3 pr-1 text-xs font-medium text-violet-800">
                            <span className="text-violet-500">{LABELS[k]}:</span> {optionLabel(k, values[k])}
                            <button type="button" onClick={() => update({ [k]: null })} className="rounded-full p-0.5 hover:bg-violet-200" aria-label={`Remove ${LABELS[k]} filter`}>
                                <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                        </span>
                    ))}
                    <button type="button" onClick={clear} className="text-xs font-medium text-slate-500 hover:text-violet-700">Clear all</button>
                </div>
            )}
        </div>
    );
}
