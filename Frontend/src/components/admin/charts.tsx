import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { Link } from "react-router-dom";
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { formatNumber, formatPercent, WEEKDAYS } from "../../lib/analytics";
import { AXIS, BRAND, FUNNEL_RAMP, GRID, HEAT_RAMP, PREVIOUS } from "../../lib/theme";
import { Card, Delta } from "./ui";
import { cx } from "../../lib/cx";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// ==================== KPI ====================

export function KpiCard({
    label, value, delta, deltaSuffix, invertDelta, hint, icon: IconCmp, to, tone,
}: {
    label: string;
    value: ReactNode;
    delta?: number | null;
    deltaSuffix?: string;
    invertDelta?: boolean;
    hint?: ReactNode;
    icon?: Icon;
    to?: string;
    tone?: "default" | "alert";
}) {
    const body = (
        <>
            <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-medium text-slate-500">{label}</p>
                {IconCmp && (
                    <span className={cx("rounded-lg p-1.5", tone === "alert" ? "bg-rose-50 text-rose-600" : "bg-violet-50 text-violet-600")}>
                        <IconCmp className="h-4 w-4" aria-hidden />
                    </span>
                )}
            </div>
            <p className={cx("mt-2 text-[28px] font-bold leading-none tracking-tight tabular-nums", tone === "alert" ? "text-rose-600" : "text-slate-900")}>{value}</p>
            <div className="mt-2 flex min-h-[18px] flex-wrap items-center gap-x-2 text-xs text-slate-500">
                {delta !== undefined && <Delta value={delta} invert={invertDelta} suffix={deltaSuffix} />}
                {hint && <span>{hint}</span>}
            </div>
        </>
    );
    return (
        <Card as="div" className={cx("p-4 sm:p-5", to && "transition-shadow hover:shadow-md")}>
            {to ? <Link to={to} className="block focus-visible:outline-none">{body}</Link> : body}
        </Card>
    );
}

// ==================== TOOLTIP ====================

interface TooltipEntry {
    name?: string | number;
    value?: number | string | (number | string)[];
    color?: string;
    dataKey?: string | number;
    payload?: Record<string, unknown>;
}

function ChartTooltip({ active, payload, label, labels }: { active?: boolean; payload?: readonly TooltipEntry[]; label?: string | number; labels?: Record<string, string> }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="min-w-[160px] rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-xs shadow-lg">
            {label !== undefined && <p className="mb-1.5 font-semibold text-slate-900">{label}</p>}
            {payload.filter((p) => p.value !== null && p.value !== undefined).map((p) => (
                <div key={String(p.dataKey)} className="flex items-center justify-between gap-4 py-0.5">
                    <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden />
                        {labels?.[String(p.dataKey)] || p.name}
                    </span>
                    <span className="font-semibold tabular-nums text-slate-900">{formatNumber(Number(p.value))}</span>
                </div>
            ))}
        </div>
    );
}

const axisProps = { stroke: AXIS, fontSize: 12, tickLine: false, axisLine: false } as const;

// ==================== TREND ====================

export function TrendChart({
    data, showPrevious, height = 280, series,
}: {
    data: Record<string, unknown>[];
    showPrevious?: boolean;
    height?: number;
    /** Stacked series ({key,color}); when omitted, plots a single "current" series. */
    series?: { key: string; color: string }[];
}) {
    if (series?.length) {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} margin={{ top: 8, right: 8, left: -6, bottom: 0 }} barCategoryGap="20%">
                    <CartesianGrid vertical={false} stroke={GRID} />
                    <XAxis dataKey="label" {...axisProps} minTickGap={16} />
                    <YAxis {...axisProps} allowDecimals={false} width={44} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f5f3ff" }} />
                    {series.map((s, i) => (
                        <Bar key={s.key} dataKey={s.key} name={s.key} stackId="a" fill={s.color} stroke="#fff" strokeWidth={1}
                            radius={i === series.length - 1 ? [4, 4, 0, 0] : 0} maxBarSize={36} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        );
    }
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
                <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={BRAND} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="label" {...axisProps} minTickGap={16} />
                <YAxis {...axisProps} allowDecimals={false} width={44} />
                <Tooltip content={<ChartTooltip labels={{ current: "This period", previous: "Previous period" }} />} cursor={{ stroke: "#c4b5fd", strokeDasharray: "4 4" }} />
                {showPrevious && (
                    <Line type="monotone" dataKey="previous" stroke={PREVIOUS} strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                )}
                <Area type="monotone" dataKey="current" stroke={BRAND} strokeWidth={2} fill="url(#trendFill)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <span className="inline-block h-0 w-4 border-t-2" style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid" }} aria-hidden />
            {label}
        </span>
    );
}

export function LegendSwatch({ color, label }: { color: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} aria-hidden />
            {label}
        </span>
    );
}

// ==================== BAR LIST (ranking) ====================

export interface BarListRow {
    key: string;
    value: number;
    label?: ReactNode;
    meta?: ReactNode;
    href?: string;
    color?: string;
}

/** Horizontal ranked bars in HTML: crisp labels, accessible, cheap to render. */
export function BarList({ rows, color = BRAND, max, empty = "No data in this period", format = formatNumber }: {
    rows: BarListRow[];
    color?: string;
    max?: number;
    empty?: string;
    format?: (n: number) => string;
}) {
    if (!rows.length) return <p className="py-8 text-center text-sm text-slate-500">{empty}</p>;
    const top = max ?? Math.max(...rows.map((r) => r.value), 1);
    return (
        <ul className="space-y-2.5">
            {rows.map((r) => {
                const inner = (
                    <>
                        <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                            <span className="min-w-0 truncate font-medium text-slate-700" title={r.key}>{r.label ?? r.key}</span>
                            <span className="shrink-0 tabular-nums text-slate-900">
                                <span className="font-semibold">{format(r.value)}</span>
                                {r.meta && <span className="ml-1.5 text-xs text-slate-500">{r.meta}</span>}
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-violet-50">
                            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${(r.value / top) * 100}%`, background: r.color || color }} />
                        </div>
                    </>
                );
                return (
                    <li key={r.key}>
                        {r.href ? <Link to={r.href} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 hover:opacity-80">{inner}</Link> : inner}
                    </li>
                );
            })}
        </ul>
    );
}

// ==================== DONUT ====================

export function Donut({ data, centerLabel = "Total", height = 200 }: { data: { name: string; value: number; color: string }[]; centerLabel?: string; height?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (!total) return <p className="py-8 text-center text-sm text-slate-500">No data in this period</p>;
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-[200px] shrink-0" style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius="64%" outerRadius="100%" paddingAngle={data.length > 1 ? 1.5 : 0} stroke="#fff" strokeWidth={2}>
                            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold tabular-nums text-slate-900">{formatNumber(total)}</span>
                    <span className="text-xs text-slate-500">{centerLabel}</span>
                </div>
            </div>
            <ul className="w-full min-w-0 space-y-1.5">
                {data.map((d) => (
                    <li key={d.name} className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: d.color }} aria-hidden />
                        <span className="min-w-0 flex-1 truncate text-slate-700" title={d.name}>{d.name}</span>
                        <span className="font-semibold tabular-nums text-slate-900">{d.value}</span>
                        <span className="w-12 text-right text-xs tabular-nums text-slate-500">{formatPercent(d.value / total, 0)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ==================== FUNNEL ====================

export function Funnel({ stages }: { stages: { stage: string; count: number; ofTotal: number | null; fromPrevious: number | null; dropOff: number | null }[] }) {
    const top = stages[0]?.count || 0;
    if (!top) return <p className="py-8 text-center text-sm text-slate-500">No enquiries in this period</p>;
    return (
        <ol className="space-y-3">
            {stages.map((s, i) => (
                <li key={s.stage}>
                    <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-medium text-slate-700">{s.stage}</span>
                        <span className="tabular-nums">
                            <span className="font-semibold text-slate-900">{formatNumber(s.count)}</span>
                            <span className="ml-1.5 text-xs text-slate-500">{formatPercent(s.ofTotal)}</span>
                        </span>
                    </div>
                    <div className="h-7 overflow-hidden rounded-lg bg-violet-50">
                        <div
                            className="h-full rounded-lg transition-[width] duration-500"
                            style={{ width: `${Math.max((s.count / top) * 100, s.count ? 1.5 : 0)}%`, background: FUNNEL_RAMP[i] || FUNNEL_RAMP[FUNNEL_RAMP.length - 1] }}
                        />
                    </div>
                    {i > 0 && s.dropOff !== null && (
                        <p className="mt-1 text-xs text-slate-500">
                            {formatPercent(s.fromPrevious)} of previous stage
                            {s.dropOff > 0 && <span className="text-rose-600"> · {formatNumber(s.dropOff)} dropped</span>}
                        </p>
                    )}
                </li>
            ))}
        </ol>
    );
}

// ==================== HEATMAP ====================

export function Heatmap({ matrix }: { matrix: number[][] }) {
    const [hover, setHover] = useState<{ d: number; h: number } | null>(null);
    const max = Math.max(1, ...matrix.flat());
    const total = matrix.flat().reduce((a, b) => a + b, 0);
    const color = (v: number) => (v === 0 ? "#faf9fe" : HEAT_RAMP[Math.min(HEAT_RAMP.length - 1, 1 + Math.floor((v / max) * (HEAT_RAMP.length - 2)))]);
    const hourLabel = (h: number) => `${h % 12 || 12}${h < 12 ? "a" : "p"}`;

    if (!total) return <p className="py-8 text-center text-sm text-slate-500">No enquiries in this period</p>;

    return (
        <div>
            <p className="mb-2 h-4 text-xs text-slate-600" aria-live="polite">
                {hover
                    ? <><span className="font-semibold">{WEEKDAYS[hover.d]} {hourLabel(hover.h)}–{hourLabel((hover.h + 1) % 24)}</span>: {matrix[hover.d][hover.h]} enquiries</>
                    : "Hover a cell for details"}
            </p>
            <div className="overflow-x-auto">
                <div className="grid min-w-[560px] gap-[2px]" style={{ gridTemplateColumns: "36px repeat(24, minmax(0, 1fr))" }}>
                    <span />
                    {Array.from({ length: 24 }, (_, h) => (
                        <span key={h} className="text-center text-[10px] text-slate-400">{h % 3 === 0 ? hourLabel(h) : ""}</span>
                    ))}
                    {matrix.map((row, d) => (
                        <div key={d} className="contents">
                            <span className="pr-1 text-right text-[11px] leading-5 text-slate-500">{WEEKDAYS[d]}</span>
                            {row.map((v, h) => (
                                <span
                                    key={h}
                                    onMouseEnter={() => setHover({ d, h })}
                                    onMouseLeave={() => setHover(null)}
                                    title={`${WEEKDAYS[d]} ${hourLabel(h)}: ${v}`}
                                    className={cx("h-5 rounded-[3px]", hover?.d === d && hover?.h === h && "ring-2 ring-violet-900")}
                                    style={{ background: color(v) }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-slate-500">
                Fewer
                {HEAT_RAMP.slice(1).map((c) => <span key={c} className="h-2.5 w-4 rounded-sm" style={{ background: c }} />)}
                More
            </div>
        </div>
    );
}

// ==================== STACKED BARS (categorical x-axis) ====================

export function StackedBars({ data, series, height = 240, xKey = "label" }: { data: Record<string, unknown>[]; series: { key: string; color: string }[]; height?: number; xKey?: string }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -6, bottom: 0 }} barCategoryGap="22%">
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey={xKey} {...axisProps} interval={0} fontSize={11} />
                <YAxis {...axisProps} allowDecimals={false} width={44} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f5f3ff" }} />
                {series.map((s, i) => (
                    <Bar key={s.key} dataKey={s.key} name={s.key} stackId="a" fill={s.color} stroke="#fff" strokeWidth={1}
                        radius={i === series.length - 1 ? [4, 4, 0, 0] : 0} maxBarSize={48} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
