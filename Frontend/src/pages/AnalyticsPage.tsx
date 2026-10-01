import { useMemo, useState, type ReactNode } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Enquiry } from "../../components/site/types";
import { useFilteredEnquiries } from "../hooks/useDashboardFilters";
import FilterBar from "../components/admin/FilterBar";
import BreakdownTable from "../components/admin/BreakdownTable";
import { BarList, Funnel, Heatmap, KpiCard, LegendItem, LegendSwatch, StackedBars, TrendChart } from "../components/admin/charts";
import { Card, CardHeader, Delta, PageHeader, Select, Tabs } from "../components/admin/ui";
import {
    autoGranularity, breakdown, buildFunnel, buildTimeSeries, conversionTimes, DIMENSIONS, formatDuration, formatNumber,
    formatPercent, getCategory, getSource, getSourceDetail, leadAging, percentChange, responseTimes, summarize,
    topKeys, weekdayHourMatrix, WEEKDAYS, type DateRange, type DimensionKey, type Granularity,
} from "../lib/analytics";
import { AXIS, BRAND, CATEGORICAL, GRID, PREVIOUS, STATUS_STYLES, colorMap } from "../lib/theme";

type Tab = "trends" | "funnel" | "sources" | "programs" | "colleges" | "team" | "compare";

const TABS: { value: Tab; label: string }[] = [
    { value: "trends", label: "Trends" },
    { value: "funnel", label: "Funnel & conversion" },
    { value: "sources", label: "Sources" },
    { value: "programs", label: "Courses & types" },
    { value: "colleges", label: "Colleges" },
    { value: "team", label: "Counselors" },
    { value: "compare", label: "Compare" },
];

interface ViewProps {
    current: Enquiry[];
    previous: Enquiry[] | null;
    scoped: Enquiry[];
    range: DateRange;
    prevRange: DateRange | null;
}

export default function AnalyticsPage() {
    const data = useFilteredEnquiries();
    const { filters, options, range, prevRange } = data;
    const tabParam = filters.params.get("tab") as Tab | null;
    const tab: Tab = tabParam && TABS.some((t) => t.value === tabParam) ? tabParam : "trends";
    const props: ViewProps = { current: data.current, previous: data.previous, scoped: data.scoped, range, prevRange };

    return (
        <>
            <PageHeader title="Analytics" description={<>{formatNumber(data.current.length)} enquiries · {range.label}</>} />
            <FilterBar options={options} range={range} prevRange={prevRange} />
            <div className="mb-4">
                <Tabs<Tab> tabs={TABS} value={tab} onChange={(v) => filters.update({ tab: v })} />
            </div>
            {tab === "trends" && <TrendsView {...props} />}
            {tab === "funnel" && <FunnelView {...props} />}
            {tab === "sources" && <DimensionView {...props} dimension="source" extra={<SourceDetails current={props.current} />} />}
            {tab === "programs" && (
                <div className="space-y-4">
                    <DimensionView {...props} dimension="category" />
                    <DimensionView {...props} dimension="program" hideCharts />
                    <ProfileBreakdowns current={props.current} />
                </div>
            )}
            {tab === "colleges" && <DimensionView {...props} dimension="college" />}
            {tab === "team" && <DimensionView {...props} dimension="owner" team />}
            {tab === "compare" && <CompareView {...props} options={options} />}
        </>
    );
}

// ==================== TRENDS ====================

function TrendsView({ current, previous, scoped, range, prevRange }: ViewProps) {
    const [granularity, setGranularity] = useState<Granularity | "auto">("auto");
    const g = granularity === "auto" ? autoGranularity(range) : granularity;
    const [now] = useState(() => new Date());

    const series = useMemo(
        () => buildTimeSeries(current, range, g, prevRange && previous ? { enquiries: previous, range: prevRange } : null),
        [current, range, g, prevRange, previous],
    );
    const typeKeys = useMemo(() => topKeys(breakdown(scoped, getCategory), 6), [scoped]);
    const typeColors = useMemo(() => colorMap(typeKeys), [typeKeys]);
    const byType = useMemo(() => {
        const present = new Set(current.map(getCategory));
        const keys = typeKeys.filter((k) => present.has(k));
        const hasOther = current.some((e) => !typeKeys.includes(getCategory(e)));
        return { keys: hasOther ? [...keys, "Other"] : keys, data: buildTimeSeries(current, range, g, null, getCategory, hasOther ? [...keys, "Other"] : keys) };
    }, [current, range, g, typeKeys]);

    const matrix = useMemo(() => weekdayHourMatrix(current), [current]);
    const byWeekday = WEEKDAYS.map((d, i) => ({ key: d, value: matrix[i].reduce((a, b) => a + b, 0) }));
    const aging = useMemo(() => leadAging(scoped, now), [scoped, now]);
    const openTotal = aging.reduce((s, b) => s + b.total, 0);

    // Hour bucketing over long ranges would produce thousands of points.
    const tooFine = g === "hour" && (range.end.getTime() - range.start.getTime()) / 86_400_000 > 7;

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader
                    title="Enquiries over time"
                    subtitle={previous ? `${formatNumber(current.length)} this period · ${formatNumber(previous.length)} previous` : `${formatNumber(current.length)} enquiries`}
                    action={
                        <Select value={granularity} onChange={(e) => setGranularity(e.target.value as Granularity | "auto")} className="w-32 py-1.5" aria-label="Group by">
                            <option value="auto">Auto</option>
                            <option value="hour">Hourly</option>
                            <option value="day">Daily</option>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                        </Select>
                    }
                />
                <div className="px-2 pb-3 pt-4 sm:px-4">
                    {tooFine ? (
                        <p className="py-16 text-center text-sm text-slate-500">Hourly grouping is available for ranges up to 7 days.</p>
                    ) : (
                        <>
                            <TrendChart data={series} showPrevious={!!previous} height={300} />
                            <div className="mt-2 flex justify-center gap-5">
                                <LegendItem color={BRAND} label="This period" />
                                {previous && <LegendItem color={PREVIOUS} label="Previous period" dashed />}
                            </div>
                        </>
                    )}
                </div>
            </Card>

            <Card>
                <CardHeader title="By enquiry type" subtitle="Volume split by what was asked for" />
                <div className="px-2 pb-3 pt-4 sm:px-4">
                    {tooFine ? null : <TrendChart data={byType.data} series={byType.keys.map((k) => ({ key: k, color: typeColors[k] || typeColors.Other }))} height={260} />}
                    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                        {byType.keys.map((k) => <LegendSwatch key={k} color={typeColors[k] || typeColors.Other} label={k} />)}
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader title="When enquiries arrive" subtitle="Day of week × hour of day (local time)" />
                    <div className="p-5 pt-3"><Heatmap matrix={matrix} /></div>
                </Card>
                <Card>
                    <CardHeader title="Busiest days" />
                    <div className="p-5 pt-4"><BarList rows={byWeekday} empty="No enquiries in this period" /></div>
                </Card>
            </div>

            <Card>
                <CardHeader title="Lead aging" subtitle={`${formatNumber(openTotal)} open enquiries by age (all dates) · older leads are less likely to convert`} />
                <div className="px-2 pb-3 pt-4 sm:px-4">
                    {openTotal ? (
                        <>
                            <StackedBars data={aging} series={(["New", "Contacted", "In Progress"] as const).map((s) => ({ key: s, color: STATUS_STYLES[s].color }))} />
                            <div className="mt-2 flex justify-center gap-4">
                                {(["New", "Contacted", "In Progress"] as const).map((s) => <LegendSwatch key={s} color={STATUS_STYLES[s].color} label={s} />)}
                            </div>
                        </>
                    ) : (
                        <p className="py-10 text-center text-sm text-slate-500">No open enquiries.</p>
                    )}
                </div>
            </Card>
        </div>
    );
}

// ==================== FUNNEL ====================

function FunnelView({ current, previous }: ViewProps) {
    const s = useMemo(() => summarize(current), [current]);
    const ps = useMemo(() => (previous ? summarize(previous) : null), [previous]);
    const funnel = useMemo(() => buildFunnel(current), [current]);
    const response = useMemo(() => responseTimes(current), [current]);
    const conversion = useMemo(() => conversionTimes(current), [current]);
    const byType = useMemo(() => breakdown(current, getCategory, previous), [current, previous]);
    const statusRows = (["New", "Contacted", "In Progress", "Closed"] as const).map((st) => ({ key: st, value: s.byStatus[st], color: STATUS_STYLES[st].color, meta: formatPercent(s.total ? s.byStatus[st] / s.total : null, 0) }));

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <KpiCard label="Conversion rate" value={formatPercent(s.conversionRate)} hint={ps && ps.conversionRate !== null && s.conversionRate !== null ? `${((s.conversionRate - ps.conversionRate) * 100).toFixed(1)} pts vs prev.` : "Converted ÷ all enquiries"} />
                <KpiCard label="Win rate" value={formatPercent(s.winRate)} hint={`${s.converted} won · ${s.lost} lost (closed with outcome)`} />
                <KpiCard label="Median first response" value={formatDuration(response.median)} hint={response.count ? `mean ${formatDuration(response.average)} · ${response.count} measured` : "Logged when status leaves New"} />
                <KpiCard label="Avg time to convert" value={formatDuration(conversion.average)} hint={conversion.count ? `median ${formatDuration(conversion.median)}` : "No conversions recorded"} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader title="Enquiry funnel" subtitle="Each enquiry counted at the furthest stage it has reached" />
                    <div className="p-5 pt-4"><Funnel stages={funnel} /></div>
                </Card>
                <Card>
                    <CardHeader title="Current status" subtitle={`${formatNumber(s.total)} enquiries · ${formatPercent(s.lostRate)} lost`} />
                    <div className="p-5 pt-4">
                        <BarList rows={statusRows} />
                        {s.closed > s.converted + s.lost && (
                            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                {s.closed - s.converted - s.lost} closed enquiries have no outcome recorded and are not counted as converted or lost.
                            </p>
                        )}
                        {s.byStatus.New === s.total && s.total > 0 && (
                            <p className="mt-4 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800">
                                All enquiries are still New. Update statuses from the Enquiries list or an enquiry's page to start tracking the funnel.
                            </p>
                        )}
                    </div>
                </Card>
            </div>
            <Card>
                <CardHeader title="Conversion by enquiry type" />
                <div className="mt-3"><BreakdownTable rows={byType} dimensionLabel="Enquiry type" filterKey="category" showComparison={!!previous} /></div>
            </Card>
        </div>
    );
}

// ==================== DIMENSIONS ====================

function DimensionView({ current, previous, scoped, range, dimension, extra, team, hideCharts }: ViewProps & { dimension: DimensionKey; extra?: ReactNode; team?: boolean; hideCharts?: boolean }) {
    const dim = DIMENSIONS[dimension];
    const rows = useMemo(() => breakdown(current, dim.get, previous), [current, previous, dim]);
    // Colours follow the entity: assign from all-time ranking under the current filters.
    const keys = useMemo(() => topKeys(breakdown(scoped, dim.get), 5), [scoped, dim]);
    const colors = useMemo(() => colorMap(keys), [keys]);
    const g = autoGranularity(range);
    const trend = useMemo(() => {
        const present = keys.filter((k) => rows.some((r) => r.key === k));
        const hasOther = rows.some((r) => !keys.includes(r.key));
        const split = hasOther ? [...present, "Other"] : present;
        return { keys: split, data: buildTimeSeries(current, range, g === "hour" ? "day" : g, null, dim.get, split) };
    }, [current, range, g, dim, keys, rows]);

    const best = rows.filter((r) => r.total >= 5 && r.conversionRate !== null && r.converted > 0).sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0))[0];
    const filterKey = dimension === "status" ? "status" : dimension;

    return (
        <div className="space-y-4">
            {!hideCharts && (
                <div className="grid gap-4 lg:grid-cols-5">
                    <Card className="lg:col-span-2">
                        <CardHeader title={`Top ${dim.plural.toLowerCase()}`} subtitle={`${rows.length} ${rows.length === 1 ? dim.label.toLowerCase() : dim.plural.toLowerCase()} in this period${best ? ` · best conversion: ${best.key} (${formatPercent(best.conversionRate)})` : ""}`} />
                        <div className="p-5 pt-4">
                            <BarList rows={rows.slice(0, 8).map((r) => ({ key: r.key, value: r.total, meta: formatPercent(r.share, 0), color: colors[r.key] || colors.Other }))} />
                        </div>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardHeader title="Over time" subtitle={`Top ${keys.length} ${dim.plural.toLowerCase()}, others grouped`} />
                        <div className="px-2 pb-3 pt-4 sm:px-4">
                            <TrendChart data={trend.data} series={trend.keys.map((k) => ({ key: k, color: colors[k] || colors.Other }))} height={250} />
                            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                                {trend.keys.map((k) => <LegendSwatch key={k} color={colors[k] || colors.Other} label={k} />)}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
            {extra}
            <Card>
                <CardHeader
                    title={`${dim.label} performance`}
                    subtitle={team
                        ? "Counselor = assigned staff member, or the person the visitor asked to meet when unassigned. Click a row to see their enquiries."
                        : "Click a row to see those enquiries"}
                />
                <div className="mt-3">
                    <BreakdownTable rows={rows} dimensionLabel={dim.label} filterKey={filterKey} showComparison={!!previous} showResponse={team} showFollowUps={team} limit={15} />
                </div>
            </Card>
        </div>
    );
}

/** Applicant profile from the newer form fields; hidden until such data exists. */
function ProfileBreakdowns({ current }: { current: Enquiry[] }) {
    const countries = useMemo(() => breakdown(current.filter((e) => e.preferredCountry), DIMENSIONS.country.get), [current]);
    const qualifications = useMemo(() => breakdown(current.filter((e) => e.qualification), DIMENSIONS.qualification.get), [current]);
    if (!countries.length && !qualifications.length) return null;
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {countries.length > 0 && (
                <Card>
                    <CardHeader title="Overseas: preferred countries" subtitle={`${countries.reduce((s, r) => s + r.total, 0)} overseas enquiries with a country`} />
                    <div className="p-5 pt-4"><BarList rows={countries.map((r) => ({ key: r.key, value: r.total, meta: `${r.converted} conv.` }))} /></div>
                </Card>
            )}
            {qualifications.length > 0 && (
                <Card>
                    <CardHeader title="Applicant qualification" subtitle={`${qualifications.reduce((s, r) => s + r.total, 0)} enquiries that shared it`} />
                    <div className="p-5 pt-4"><BarList rows={qualifications.slice(0, 8).map((r) => ({ key: r.key, value: r.total, meta: formatPercent(r.conversionRate, 0) + " conv." }))} /></div>
                </Card>
            )}
        </div>
    );
}

function SourceDetails({ current }: { current: Enquiry[] }) {
    const campaigns = useMemo(() => breakdown(current.filter((e) => e.utm?.source || e.referrer), DIMENSIONS.campaign.get), [current]);
    const groups = useMemo(() => {
        return ["Newspaper", "Friends", "Teacher", "Other"]
            .map((src) => {
                const list = current.filter((e) => getSource(e) === src);
                return { src, rows: breakdown(list, (e) => getSourceDetail(e) || "Not specified").slice(0, 6) };
            })
            .filter((g) => g.rows.length);
    }, [current]);
    if (!groups.length && !campaigns.length) return null;
    const titles: Record<string, string> = { Newspaper: "Newspapers", Friends: "Referring friends", Teacher: "Referring teachers", Other: "Other sources (as typed)" };
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {campaigns.length > 0 && (
                <Card>
                    <CardHeader title="Tracked campaigns" subtitle="From UTM links / referring sites" />
                    <div className="p-5 pt-4"><BarList rows={campaigns.slice(0, 6).map((r) => ({ key: r.key, value: r.total, meta: `${r.converted} conv.` }))} /></div>
                </Card>
            )}
            {groups.map((g) => (
                <Card key={g.src}>
                    <CardHeader title={titles[g.src]} />
                    <div className="p-5 pt-4"><BarList rows={g.rows.map((r) => ({ key: r.key, value: r.total }))} /></div>
                </Card>
            ))}
        </div>
    );
}

// ==================== COMPARE ====================

const COMPARABLE: DimensionKey[] = ["source", "category", "program", "college", "owner"];

function CompareView({ current, previous, range, options }: ViewProps & { options: Record<string, string[]> }) {
    const [dimension, setDimension] = useState<DimensionKey>("source");
    const values = options[dimension] || [];
    const ranked = useMemo(() => breakdown(current, DIMENSIONS[dimension].get).map((r) => r.key), [current, dimension]);
    const [picked, setPicked] = useState<{ dim: DimensionKey; a: string; b: string } | null>(null);
    const a = picked?.dim === dimension ? picked.a : ranked[0] || values[0] || "";
    const b = picked?.dim === dimension ? picked.b : ranked[1] || values[1] || "";
    const get = DIMENSIONS[dimension].get;

    const sides = [a, b].map((v, i) => {
        const list = current.filter((e) => get(e) === v);
        const prev = previous?.filter((e) => get(e) === v) || null;
        return { value: v, color: CATEGORICAL[i], list, prev, s: summarize(list), ps: prev ? summarize(prev) : null, response: responseTimes(list) };
    });

    const g = autoGranularity(range) === "hour" ? "day" : autoGranularity(range);
    const series = useMemo(() => {
        const sa = buildTimeSeries(current.filter((e) => get(e) === a), range, g);
        const sb = buildTimeSeries(current.filter((e) => get(e) === b), range, g);
        return sa.map((p, i) => ({ label: p.label, A: p.current, B: sb[i]?.current ?? 0 }));
    }, [current, range, g, get, a, b]);

    const metrics: { label: string; value: (x: (typeof sides)[number]) => string; delta?: (x: (typeof sides)[number]) => number | null; invert?: boolean }[] = [
        { label: "Enquiries", value: (x) => formatNumber(x.s.total), delta: (x) => (x.ps ? percentChange(x.s.total, x.ps.total) : null) },
        { label: "Contacted", value: (x) => `${formatNumber(x.s.total - x.s.byStatus.New)} (${formatPercent(x.s.contactedRate, 0)})` },
        { label: "Open", value: (x) => formatNumber(x.s.open) },
        { label: "Converted", value: (x) => formatNumber(x.s.converted), delta: (x) => (x.ps ? percentChange(x.s.converted, x.ps.converted) : null) },
        { label: "Lost", value: (x) => formatNumber(x.s.lost) },
        { label: "Conversion rate", value: (x) => formatPercent(x.s.conversionRate) },
        { label: "Median first response", value: (x) => formatDuration(x.response.median) },
        { label: "Share of all enquiries", value: (x) => formatPercent(current.length ? x.s.total / current.length : null) },
    ];

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                    <Select label="Compare by" value={dimension} onChange={(e) => setDimension(e.target.value as DimensionKey)}>
                        {COMPARABLE.map((d) => <option key={d} value={d}>{DIMENSIONS[d].label}</option>)}
                    </Select>
                    {(["a", "b"] as const).map((side, i) => (
                        <Select key={side} label={i === 0 ? "A" : "B"} value={i === 0 ? a : b} onChange={(e) => setPicked({ dim: dimension, a: i === 0 ? e.target.value : a, b: i === 1 ? e.target.value : b })}>
                            {values.map((v) => <option key={v} value={v}>{v}</option>)}
                        </Select>
                    ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">Period-over-period comparisons (this month vs last month, this year vs last year…) are built into every view: pick the range above and the previous period is compared automatically.</p>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-violet-100 text-xs text-slate-500">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium">Metric</th>
                                {sides.map((x, i) => (
                                    <th key={i} className="px-4 py-3 text-right font-medium">
                                        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: x.color }} />{x.value || "—"}</span>
                                    </th>
                                ))}
                                <th className="px-5 py-3 text-right font-medium">Difference (A − B)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-50 tabular-nums">
                            {metrics.map((m) => {
                                const diff = m.label === "Enquiries" ? sides[0].s.total - sides[1].s.total
                                    : m.label === "Converted" ? sides[0].s.converted - sides[1].s.converted
                                        : m.label === "Conversion rate" && sides[0].s.conversionRate !== null && sides[1].s.conversionRate !== null
                                            ? (sides[0].s.conversionRate - sides[1].s.conversionRate) * 100 : null;
                                return (
                                    <tr key={m.label}>
                                        <td className="px-5 py-2.5 text-slate-600">{m.label}</td>
                                        {sides.map((x, i) => (
                                            <td key={i} className="px-4 py-2.5 text-right">
                                                <span className="font-semibold text-slate-900">{m.value(x)}</span>
                                                {m.delta && previous && <span className="ml-2"><Delta value={m.delta(x)} /></span>}
                                            </td>
                                        ))}
                                        <td className="px-5 py-2.5 text-right text-slate-700">
                                            {diff === null ? "—" : `${diff > 0 ? "+" : ""}${m.label === "Conversion rate" ? `${diff.toFixed(1)} pts` : formatNumber(diff)}`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {previous && <p className="border-t border-violet-100 px-5 py-2.5 text-xs text-slate-500">Arrows show change vs the previous period for each side.</p>}
            </Card>

            <Card>
                <CardHeader title="Volume over time" />
                <div className="px-2 pb-3 pt-4 sm:px-4">
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={series} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke={GRID} />
                            <XAxis dataKey="label" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} minTickGap={16} />
                            <YAxis stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ede9fe", fontSize: 12 }} />
                            <Line type="monotone" dataKey="A" name={a} stroke={CATEGORICAL[0]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey="B" name={b} stroke={CATEGORICAL[1]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-2 flex justify-center gap-5">
                        <LegendItem color={CATEGORICAL[0]} label={a || "A"} />
                        <LegendItem color={CATEGORICAL[1]} label={b || "B"} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
