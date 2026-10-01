import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    BellAlertIcon, CheckBadgeIcon, ClockIcon, InboxArrowDownIcon, SparklesIcon, UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useFilteredEnquiries } from "../hooks/useDashboardFilters";
import FilterBar from "../components/admin/FilterBar";
import { BarList, Donut, Funnel, KpiCard, LegendItem, TrendChart } from "../components/admin/charts";
import { Button, Card, CardHeader, PageHeader, StatusBadge, Tag } from "../components/admin/ui";
import {
    ageInDays, autoGranularity, breakdown, buildFunnel, buildTimeSeries, flattenFollowUps, formatNumber, formatPercent,
    formatDuration, formatRelative, getCategory, getCollege, getSource, getStatus, inRange, percentChange,
    responseTimes, summarize, topKeys, toDate,
} from "../lib/analytics";
import { BRAND, PREVIOUS, colorMap } from "../lib/theme";

export default function EnquiryDashboard() {
    const { current, previous, scoped, range, prevRange, options, chatLeads, filters } = useFilteredEnquiries();
    const [showPrevious, setShowPrevious] = useState(true);
    const search = filters.params.toString();
    const withFilters = (path: string, extra = "") => `${path}?${[search, extra].filter(Boolean).join("&")}`;

    const now = useMemo(() => new Date(), []);
    const s = useMemo(() => summarize(current), [current]);
    const ps = useMemo(() => (previous ? summarize(previous) : null), [previous]);
    const response = useMemo(() => responseTimes(current), [current]);
    const prevResponse = useMemo(() => (previous ? responseTimes(previous) : null), [previous]);

    const series = useMemo(
        () => buildTimeSeries(current, range, autoGranularity(range), prevRange && previous ? { enquiries: previous, range: prevRange } : null),
        [current, range, prevRange, previous],
    );
    const funnel = useMemo(() => buildFunnel(current), [current]);
    const sources = useMemo(() => breakdown(current, getSource), [current]);
    const categories = useMemo(() => breakdown(current, getCategory), [current]);
    const categoryColors = useMemo(() => colorMap(topKeys(breakdown(scoped, getCategory), 7)), [scoped]);

    // Operational queue ignores the date range: an old lead can still need attention today.
    const followUps = useMemo(() => flattenFollowUps(scoped, now), [scoped, now]);
    const overdue = followUps.filter((f) => f.state === "overdue");
    const dueToday = followUps.filter((f) => f.state === "today");
    const uncontacted = useMemo(
        () => scoped.filter((e) => getStatus(e) === "New" && ageInDays(e, now) >= 2 && ageInDays(e, now) < 30).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
        [scoped, now],
    );

    const leadsInRange = useMemo(() => chatLeads.filter((l) => inRange(toDate(l.createdAt), range)), [chatLeads, range]);
    const leadInterest = (word: string) => leadsInRange.filter((l) => l.interest?.toLowerCase().includes(word)).length;

    const donutData = categories.slice(0, 7).map((c) => ({ name: c.key, value: c.total, color: categoryColors[c.key] || categoryColors.Other }));
    const otherCategories = categories.slice(7).reduce((sum, c) => sum + c.total, 0);
    if (otherCategories) donutData.push({ name: "Other types", value: otherCategories, color: categoryColors.Other });

    const prevLabel = prevRange ? `vs ${prevRange.label}` : undefined;

    return (
        <>
            <PageHeader
                title="Overview"
                description={<>What's happening across enquiries · <span className="font-medium text-slate-700">{range.label}</span></>}
                actions={<Link to={withFilters("/dashboard/insights")}><Button icon={SparklesIcon}>View insights</Button></Link>}
            />
            <FilterBar options={options} range={range} prevRange={prevRange} />

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
                <KpiCard label="Enquiries" icon={InboxArrowDownIcon} value={formatNumber(s.total)}
                    delta={ps ? percentChange(s.total, ps.total) : undefined} deltaSuffix={prevLabel ? "vs prev." : undefined}
                    hint={s.uniqueContacts !== s.total ? `${s.uniqueContacts} unique` : undefined} to={withFilters("/dashboard/enquiries")} />
                <KpiCard label="Awaiting contact" icon={UserPlusIcon} value={formatNumber(s.byStatus.New)}
                    hint={`${formatPercent(s.total ? s.byStatus.New / s.total : null)} still New`} to={withFilters("/dashboard/enquiries", "status=New")} />
                <KpiCard label="Converted" icon={CheckBadgeIcon} value={formatNumber(s.converted)}
                    delta={ps && ps.converted > 0 ? percentChange(s.converted, ps.converted) : undefined}
                    hint={`${formatNumber(s.lost)} lost${ps && ps.converted === 0 ? " · none in prev. period" : ""}`} to={withFilters("/dashboard/enquiries", "outcome=converted")} />
                <KpiCard label="Conversion rate" value={formatPercent(s.conversionRate)}
                    hint={ps?.conversionRate !== null && ps?.conversionRate !== undefined && s.conversionRate !== null
                        ? `${((s.conversionRate - ps.conversionRate) * 100).toFixed(1)} pts vs prev.`
                        : "Converted ÷ enquiries"} />
                <KpiCard label="First response" icon={ClockIcon} value={formatDuration(response.median)}
                    delta={response.median !== null && prevResponse?.median ? percentChange(response.median, prevResponse.median) : undefined}
                    invertDelta hint={response.count ? `median of ${response.count}` : "No contacts logged yet"} />
                <KpiCard label="Follow-ups due" icon={BellAlertIcon} value={formatNumber(overdue.length + dueToday.length)}
                    tone={overdue.length ? "alert" : "default"} hint={`${overdue.length} overdue · ${dueToday.length} today`} to={withFilters("/dashboard/follow-ups")} />
            </div>

            {/* Trend + attention */}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader
                        title="Enquiry volume"
                        subtitle={`${formatNumber(s.total)} enquiries${ps ? ` · ${formatNumber(ps.total)} in ${prevRange?.label}` : ""}`}
                        action={prevRange && (
                            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
                                <input type="checkbox" checked={showPrevious} onChange={(e) => setShowPrevious(e.target.checked)} className="h-4 w-4 rounded accent-violet-600" />
                                Compare previous
                            </label>
                        )}
                    />
                    <div className="px-2 pb-3 pt-4 sm:px-4">
                        <TrendChart data={series} showPrevious={showPrevious && !!prevRange} />
                        <div className="mt-2 flex justify-center gap-5">
                            <LegendItem color={BRAND} label="This period" />
                            {showPrevious && prevRange && <LegendItem color={PREVIOUS} label="Previous period" dashed />}
                        </div>
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader title="Needs attention" subtitle="Across all dates, current filters" />
                    <div className="flex-1 space-y-4 px-5 pb-5 pt-4">
                        <AttentionGroup title="Overdue follow-ups" tone="rose" count={overdue.length} href={withFilters("/dashboard/follow-ups", "tab=overdue")}
                            items={overdue.slice(0, 3).map((f) => ({ id: f.enquiry._id + f.followUp._id, enquiryId: f.enquiry._id, name: f.enquiry.name, meta: `due ${formatRelative(f.due, now)}` }))} />
                        <AttentionGroup title="Follow-ups today" tone="amber" count={dueToday.length} href={withFilters("/dashboard/follow-ups", "tab=today")}
                            items={dueToday.slice(0, 3).map((f) => ({ id: f.enquiry._id + f.followUp._id, enquiryId: f.enquiry._id, name: f.enquiry.name, meta: f.due.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) }))} />
                        <AttentionGroup title="Not contacted (2–30 days old)" tone="sky" count={uncontacted.length} href={withFilters("/dashboard/enquiries", "status=New&range=all&sort=createdAt&dir=asc")}
                            items={uncontacted.slice(0, 3).map((e) => ({ id: e._id, enquiryId: e._id, name: e.name, meta: `received ${formatRelative(e.createdAt, now)}` }))} />
                    </div>
                </Card>
            </div>

            {/* Pipeline, sources, types */}
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                    <CardHeader title="Conversion funnel" subtitle="Furthest stage reached" action={<Link to={withFilters("/dashboard/analytics", "tab=funnel")} className="text-xs font-medium text-violet-700 hover:underline">Details</Link>} />
                    <div className="px-5 pb-5 pt-4"><Funnel stages={funnel} /></div>
                </Card>
                <Card>
                    <CardHeader title="Where enquiries come from" subtitle="By reference source" action={<Link to={withFilters("/dashboard/analytics", "tab=sources")} className="text-xs font-medium text-violet-700 hover:underline">Details</Link>} />
                    <div className="px-5 pb-5 pt-4">
                        <BarList rows={sources.slice(0, 7).map((r) => ({ key: r.key, value: r.total, meta: formatPercent(r.share, 0) }))} />
                    </div>
                </Card>
                <Card className="md:col-span-2 xl:col-span-1">
                    <CardHeader title="Enquiry types" subtitle="What people are asking for" />
                    <div className="px-5 pb-5 pt-4"><Donut data={donutData} /></div>
                </Card>
            </div>

            {/* Recent + chat leads */}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader title="Latest enquiries" action={<Link to={withFilters("/dashboard/enquiries")} className="text-xs font-medium text-violet-700 hover:underline">View all ({formatNumber(s.total)})</Link>} />
                    <ul className="mt-3 divide-y divide-violet-50 border-t border-violet-100">
                        {current.slice(0, 6).map((e) => (
                            <li key={e._id}>
                                <Link to={`/dashboard/enquiries/${e._id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-violet-50/50">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700" aria-hidden>
                                        {e.name?.trim()?.[0]?.toUpperCase() || "?"}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-slate-900">{e.name}</span>
                                        <span className="block truncate text-xs text-slate-500">{getCollege(e)}</span>
                                    </span>
                                    <Tag className="hidden sm:inline-flex">{getCategory(e)}</Tag>
                                    <StatusBadge status={getStatus(e)} outcome={e.outcome} />
                                    <span className="hidden w-24 text-right text-xs text-slate-500 md:block">{formatRelative(e.createdAt, now)}</span>
                                </Link>
                            </li>
                        ))}
                        {!current.length && <li className="px-5 py-10 text-center text-sm text-slate-500">No enquiries in this period.</li>}
                    </ul>
                </Card>
                <Card>
                    <CardHeader title="Chatbot leads" subtitle={range.label} action={<Link to="/dashboard/chat-leads" className="text-xs font-medium text-violet-700 hover:underline">Manage</Link>} />
                    <div className="grid grid-cols-3 gap-2 px-5 pb-5 pt-4 text-center">
                        {[
                            { label: "Total", value: leadsInRange.length },
                            { label: "Internship", value: leadInterest("internship") },
                            { label: "Course", value: leadInterest("course") },
                        ].map((m) => (
                            <div key={m.label} className="rounded-xl bg-violet-50/60 px-2 py-3">
                                <p className="text-2xl font-bold tabular-nums text-slate-900">{m.value}</p>
                                <p className="text-xs text-slate-500">{m.label}</p>
                            </div>
                        ))}
                    </div>
                    <p className="px-5 pb-5 text-xs text-slate-500">{formatNumber(chatLeads.length)} chatbot leads all time.</p>
                </Card>
            </div>
        </>
    );
}

const TONES = {
    rose: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-800",
    sky: "bg-sky-50 text-sky-700",
};

function AttentionGroup({ title, count, items, href, tone }: {
    title: string;
    count: number;
    href: string;
    tone: keyof typeof TONES;
    items: { id: string; enquiryId: string; name: string; meta: string }[];
}) {
    return (
        <div>
            <Link to={href} className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700 hover:text-violet-700">
                {title}
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${count ? TONES[tone] : "bg-slate-100 text-slate-500"}`}>{count}</span>
            </Link>
            {items.length ? (
                <ul className="space-y-1">
                    {items.map((i) => (
                        <li key={i.id}>
                            <Link to={`/dashboard/enquiries/${i.enquiryId}`} className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm hover:bg-violet-50">
                                <span className="truncate text-slate-800">{i.name}</span>
                                <span className="shrink-0 text-xs text-slate-500">{i.meta}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="px-2 text-xs text-slate-400">All clear</p>
            )}
        </div>
    );
}
