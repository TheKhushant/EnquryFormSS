import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BellAlertIcon, CalendarDaysIcon, CheckIcon } from "@heroicons/react/24/outline";
import type { Enquiry } from "../../components/site/types";
import { useFilteredEnquiries } from "../hooks/useDashboardFilters";
import FilterBar from "../components/admin/FilterBar";
import { KpiCard } from "../components/admin/charts";
import { Button, Card, EmptyState, PageHeader, StatusBadge, Tabs, Tag } from "../components/admin/ui";
import { cx } from "../lib/cx";
import { enquiryApi, getErrorMessage } from "../lib/api";
import {
    flattenFollowUps, followUpStats, formatDate, formatNumber, formatPercent, formatRelative, getCategory, getOwner, getStatus,
    startOfDay, type FollowUpItem, type FollowUpState,
} from "../lib/analytics";

const TABS: { value: FollowUpState; label: string }[] = [
    { value: "overdue", label: "Overdue" },
    { value: "today", label: "Today" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
];

export default function FollowUpsPage() {
    const { scoped, options, range, filters, upsert } = useFilteredEnquiries();
    const [now] = useState(() => new Date());
    const tabParam = filters.params.get("tab") as FollowUpState | null;

    const items = useMemo(() => flattenFollowUps(scoped, now), [scoped, now]);
    const stats = useMemo(() => followUpStats(scoped, now), [scoped, now]);
    const counts = useMemo(() => {
        const c: Record<FollowUpState, number> = { overdue: 0, today: 0, upcoming: 0, completed: 0 };
        items.forEach((i) => (c[i.state] += 1));
        return c;
    }, [items]);

    const tab: FollowUpState = tabParam && TABS.some((t) => t.value === tabParam) ? tabParam : counts.overdue ? "overdue" : "today";
    const visible = useMemo(() => {
        const list = items.filter((i) => i.state === tab);
        // Completed: most recent first. Others: soonest due first.
        return tab === "completed" ? list.reverse() : list;
    }, [items, tab]);

    const groups = useMemo(() => {
        const map = new Map<string, FollowUpItem[]>();
        for (const i of visible) {
            const key = startOfDay(i.due).toISOString();
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(i);
        }
        return [...map.entries()];
    }, [visible]);

    return (
        <>
            <PageHeader title="Follow-ups" description="Scheduled call-backs and visits across all enquiries" />
            <FilterBar options={options} range={range} showRange={false} keys={["owner", "status", "category", "source", "priority"]} />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <KpiCard label="Overdue" icon={BellAlertIcon} value={formatNumber(stats.overdue)} tone={stats.overdue ? "alert" : "default"} hint="Due before today, not done" />
                <KpiCard label="Due today" icon={CalendarDaysIcon} value={formatNumber(stats.today)} hint={`${formatNumber(stats.upcoming)} upcoming`} />
                <KpiCard label="Completion rate" value={formatPercent(stats.completionRate)} hint={`${stats.completed} done of ${stats.completed + stats.overdue} due`} />
                <KpiCard label="Follow-up conversion" value={formatPercent(stats.followUpConversionRate)}
                    hint={`${stats.enquiriesWithFollowUp} enquiries with follow-ups · ${formatPercent(stats.onTimeRate)} done on time`} />
            </div>

            <Card className="mt-4">
                <div className="border-b border-violet-100 p-3">
                    <Tabs<FollowUpState>
                        value={tab}
                        onChange={(v) => filters.update({ tab: v })}
                        tabs={TABS.map((t) => ({ ...t, count: counts[t.value] }))}
                    />
                </div>
                {groups.length === 0 ? (
                    <EmptyState
                        icon={CalendarDaysIcon}
                        title={tab === "overdue" ? "Nothing overdue" : tab === "today" ? "No follow-ups due today" : tab === "upcoming" ? "No upcoming follow-ups" : "No completed follow-ups yet"}
                        description={items.length === 0 ? "Open any enquiry and schedule a follow-up to build your queue." : undefined}
                        action={items.length === 0 && <Link to="/dashboard/enquiries?status=New"><Button>Go to new enquiries</Button></Link>}
                    />
                ) : (
                    <div className="divide-y divide-violet-100">
                        {groups.map(([day, list]) => (
                            <div key={day}>
                                <h3 className="sticky top-16 z-[1] bg-[#faf8ff] px-5 py-2 text-xs font-semibold text-slate-500">
                                    {formatDate(new Date(day))} · {formatRelative(new Date(day), startOfDay(now))}
                                </h3>
                                <ul className="divide-y divide-violet-50">
                                    {list.map((i) => <FollowUpRow key={i.followUp._id} item={i} now={now} onDone={upsert} />)}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </>
    );
}

function FollowUpRow({ item, now, onDone }: { item: FollowUpItem; now: Date; onDone: (e: Enquiry) => void }) {
    const { enquiry: e, followUp: f, state } = item;
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("");
    const [busy, setBusy] = useState(false);

    const complete = async () => {
        setBusy(true);
        try {
            onDone(await enquiryApi.completeFollowUp(e._id, f._id, result.trim()));
            toast.success("Follow-up completed");
        } catch (err) {
            toast.error(getErrorMessage(err));
            setBusy(false);
        }
    };

    return (
        <li className="px-5 py-3">
            <div className="flex flex-wrap items-start gap-3">
                <span className={cx("mt-0.5 w-16 shrink-0 text-sm font-semibold tabular-nums", state === "overdue" ? "text-rose-600" : "text-slate-700")}>
                    {item.due.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                </span>
                <div className="min-w-0 flex-1">
                    <Link to={`/dashboard/enquiries/${e._id}`} className="font-medium text-slate-900 hover:text-violet-700">{e.name}</Link>
                    <span className="ml-2 text-sm text-slate-500">{e.mobile}</span>
                    {f.note && <p className="mt-0.5 text-sm text-slate-600">{f.note}</p>}
                    {f.completedAt && (
                        <p className="mt-0.5 text-xs text-slate-500">
                            Done {formatRelative(f.completedAt, now)}{item.completedOnTime === false && <span className="text-amber-700"> (late)</span>}
                            {f.result && <> — {f.result}</>}
                        </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={getStatus(e)} outcome={e.outcome} />
                        <Tag>{getCategory(e)}</Tag>
                        <span className="text-xs text-slate-500">· {getOwner(e)}</span>
                    </div>
                </div>
                {state !== "completed" && !open && (
                    <div className="flex gap-1.5">
                        <a href={`tel:${e.mobile}`}><Button size="sm">Call</Button></a>
                        <Button size="sm" variant="primary" icon={CheckIcon} onClick={() => setOpen(true)}>Done</Button>
                    </div>
                )}
            </div>
            {open && (
                <form className="mt-2 flex flex-col gap-2 sm:ml-[76px] sm:flex-row" onSubmit={(ev) => { ev.preventDefault(); complete(); }}>
                    <input autoFocus value={result} onChange={(ev) => setResult(ev.target.value)} placeholder="Result (optional)" aria-label="Follow-up result"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                    <div className="flex gap-2">
                        <Button type="submit" variant="primary" disabled={busy}>{busy ? "Saving…" : "Mark done"}</Button>
                        <Button onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
                    </div>
                </form>
            )}
        </li>
    );
}
