import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowTrendingDownIcon, ArrowTrendingUpIcon, ExclamationTriangleIcon, InformationCircleIcon, LightBulbIcon,
} from "@heroicons/react/24/outline";
import { useFilteredEnquiries } from "../hooks/useDashboardFilters";
import FilterBar from "../components/admin/FilterBar";
import { Card, CardHeader, EmptyState, PageHeader } from "../components/admin/ui";
import { cx } from "../lib/cx";
import { generateInsights, isOpen, type Insight, type InsightTone } from "../lib/analytics";

const TONE: Record<InsightTone, { icon: typeof LightBulbIcon; cls: string; label: string }> = {
    positive: { icon: ArrowTrendingUpIcon, cls: "bg-emerald-50 text-emerald-700", label: "Positive" },
    negative: { icon: ArrowTrendingDownIcon, cls: "bg-rose-50 text-rose-700", label: "Needs action" },
    warning: { icon: ExclamationTriangleIcon, cls: "bg-amber-50 text-amber-700", label: "Warning" },
    neutral: { icon: InformationCircleIcon, cls: "bg-violet-50 text-violet-700", label: "Observation" },
};

export default function InsightsPage() {
    const { current, previous, scoped, prevRange, range, options, filters } = useFilteredEnquiries();
    const [now] = useState(() => new Date());
    const insights = useMemo(
        () => generateInsights(current, previous, scoped.filter(isOpen), prevRange?.label ?? null, now),
        [current, previous, scoped, prevRange, now],
    );
    const attention = insights.filter((i) => i.tone === "warning" || i.tone === "negative");
    const observations = insights.filter((i) => i.tone === "positive" || i.tone === "neutral");

    // Keep the shared filters when following an insight's link.
    const withFilters = (link: string) => {
        const [path, query = ""] = link.split("?");
        const next = new URLSearchParams(filters.params);
        next.delete("tab");
        new URLSearchParams(query).forEach((v, k) => next.set(k, v));
        return `${path}?${next.toString()}`;
    };

    return (
        <>
            <PageHeader
                title="Insights"
                description="Rule-based observations calculated from your enquiry data — no estimates or AI guesses."
            />
            <FilterBar options={options} range={range} prevRange={prevRange} />

            {insights.length === 0 ? (
                <Card><EmptyState icon={LightBulbIcon} title="Not enough data yet" description="Insights appear once there are at least a few enquiries in the selected period." /></Card>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    <InsightList title="Needs attention" subtitle="Operational items across all dates" items={attention} empty="Nothing needs attention right now." withFilters={withFilters} />
                    <InsightList title="Observations" subtitle={`For ${range.label.toLowerCase()}${prevRange ? `, compared with the ${prevRange.label}` : ""}`} items={observations} empty="Not enough data in this period for observations." withFilters={withFilters} />
                </div>
            )}

            <p className="mt-4 text-xs text-slate-500">
                How these are calculated: comparisons use the same filters over the previous period; “best converting” only considers groups with at least 5 enquiries;
                conversion counts enquiries closed with the outcome “Converted”.
            </p>
        </>
    );
}

function InsightList({ title, subtitle, items, empty, withFilters }: { title: string; subtitle: string; items: Insight[]; empty: string; withFilters: (l: string) => string }) {
    return (
        <Card>
            <CardHeader title={title} subtitle={subtitle} />
            {items.length === 0 ? (
                <p className="px-5 py-8 text-sm text-slate-500">{empty}</p>
            ) : (
                <ul className="mt-3 divide-y divide-violet-50 border-t border-violet-100">
                    {items.map((i) => {
                        const t = TONE[i.tone];
                        const content = (
                            <div className="flex gap-3 px-5 py-3.5">
                                <span className={cx("h-fit rounded-lg p-1.5", t.cls)} title={t.label}>
                                    <t.icon className="h-4 w-4" aria-hidden />
                                    <span className="sr-only">{t.label}</span>
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">{i.title}</p>
                                    <p className="mt-0.5 text-sm text-slate-600">{i.detail}</p>
                                </div>
                            </div>
                        );
                        return (
                            <li key={i.id}>
                                {i.link ? <Link to={withFilters(i.link)} className="block hover:bg-violet-50/50">{content}</Link> : content}
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}
