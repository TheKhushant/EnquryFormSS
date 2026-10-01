import type { Enquiry, EnquiryFollowUp, EnquiryStatus } from "../../components/site/types";

// =====================================================================
// Field accessors
// Every analytic goes through these so missing/legacy values are handled
// in exactly one place. All dates are bucketed in the viewer's local time.
// =====================================================================

export const STATUSES: EnquiryStatus[] = ["New", "Contacted", "In Progress", "Closed"];
export const PRIORITIES = ["High", "Medium", "Low"] as const;
export const NOT_SPECIFIED = "Not specified";

export const getStatus = (e: Enquiry): EnquiryStatus => e.status || "New";
export const getPriority = (e: Enquiry) => e.priority || "Medium";
export const isOpen = (e: Enquiry) => getStatus(e) !== "Closed";
export const isConverted = (e: Enquiry) => getStatus(e) === "Closed" && e.outcome === "Converted";
export const isLost = (e: Enquiry) => getStatus(e) === "Closed" && e.outcome === "Not Converted";

export const getSource = (e: Enquiry) => e.reference?.trim() || NOT_SPECIFIED;

/** Friend/teacher name, newspaper title or free-text "other" source. */
export const getSourceDetail = (e: Enquiry) => {
    switch (e.reference) {
        case "Friends":
        case "Teacher":
        case "Newspaper":
            return (e.referenceName === "Other" ? e.referenceNewspaperOther : e.referenceName)?.trim() || "";
        case "Other":
            return e.referenceOther?.trim() || "";
        default:
            return "";
    }
};

export const getCategory = (e: Enquiry) => e.enquiryFor?.trim() || "Other";

/** The specific course / internship domain / job role, depending on the category. */
export const getProgram = (e: Enquiry) =>
    e.courseName?.trim() || e.internshipDomain?.trim() || e.jobCategory?.trim() || NOT_SPECIFIED;

export const getCollege = (e: Enquiry) =>
    e.college === "Other" ? e.customCollege?.trim() || "Other" : e.college?.trim() || NOT_SPECIFIED;

/** Explicit assignment wins; otherwise the person the visitor asked to meet. */
export const getOwner = (e: Enquiry) => e.assignedTo?.trim() || e.whomToMeet?.trim() || "Unassigned";

export const normalizeMobile = (mobile: string) => (mobile || "").replace(/\D/g, "").slice(-10);

export const toDate = (value?: string | null) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
};

export const createdAt = (e: Enquiry) => toDate(e.createdAt);

// =====================================================================
// Dimensions
// =====================================================================

export type DimensionKey = "source" | "category" | "program" | "college" | "owner" | "status" | "priority";

export const DIMENSIONS: Record<DimensionKey, { label: string; plural: string; get: (e: Enquiry) => string }> = {
    source: { label: "Source", plural: "Sources", get: getSource },
    category: { label: "Enquiry type", plural: "Enquiry types", get: getCategory },
    program: { label: "Course / domain", plural: "Courses & domains", get: getProgram },
    college: { label: "College", plural: "Colleges", get: getCollege },
    owner: { label: "Counselor", plural: "Counselors", get: getOwner },
    status: { label: "Status", plural: "Statuses", get: getStatus },
    priority: { label: "Priority", plural: "Priorities", get: getPriority },
};

export const uniqueValues = (enquiries: Enquiry[], get: (e: Enquiry) => string) =>
    Array.from(new Set(enquiries.map(get).filter(Boolean))).sort((a, b) => a.localeCompare(b));

// =====================================================================
// Date ranges
// Ranges are [start, end) — end is exclusive.
// =====================================================================

export type RangeKey =
    | "today" | "yesterday" | "7d" | "30d" | "90d"
    | "this_month" | "last_month" | "this_year" | "last_year" | "all" | "custom";

export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "this_month", label: "This month" },
    { value: "last_month", label: "Previous month" },
    { value: "this_year", label: "This year" },
    { value: "last_year", label: "Previous year" },
    { value: "all", label: "All time" },
    { value: "custom", label: "Custom range" },
];

export interface DateRange {
    start: Date;
    end: Date;
    label: string;
}

const DAY = 86_400_000;
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes());
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate(), d.getHours(), d.getMinutes());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

/** Parses a `YYYY-MM-DD` value as a *local* date (new Date("2026-01-01") would be UTC). */
export const parseDateInput = (value?: string | null) => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
};

export const toDateInput = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function resolveRange(key: RangeKey, from: string | null, to: string | null, earliest: Date | null, now = new Date()): DateRange {
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);
    const label = RANGE_OPTIONS.find((o) => o.value === key)?.label || "";

    switch (key) {
        case "today": return { start: today, end: tomorrow, label };
        case "yesterday": return { start: addDays(today, -1), end: today, label };
        case "7d": return { start: addDays(today, -6), end: tomorrow, label };
        case "30d": return { start: addDays(today, -29), end: tomorrow, label };
        case "90d": return { start: addDays(today, -89), end: tomorrow, label };
        case "this_month": return { start: startOfMonth(now), end: tomorrow, label };
        case "last_month": return { start: startOfMonth(addMonths(startOfMonth(now), -1)), end: startOfMonth(now), label };
        case "this_year": return { start: new Date(now.getFullYear(), 0, 1), end: tomorrow, label };
        case "last_year": return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear(), 0, 1), label };
        case "custom": {
            const s = parseDateInput(from) || addDays(today, -29);
            const e = parseDateInput(to) || today;
            const [a, b] = s <= e ? [s, e] : [e, s];
            return { start: a, end: addDays(b, 1), label: `${formatDate(a)} – ${formatDate(b)}` };
        }
        case "all":
        default:
            return { start: earliest ? startOfDay(earliest) : addDays(today, -29), end: tomorrow, label: "All time" };
    }
}

/**
 * The comparison window for a range. Calendar "to date" ranges compare with the
 * same elapsed span of the previous month/year (1–2 Oct vs 1–2 Sep), so a
 * partial month is never compared with a full one. Everything else compares
 * with the equal-length window immediately before it.
 */
export function previousRange(key: RangeKey, range: DateRange): DateRange | null {
    if (key === "all") return null;
    if (key === "this_month" || key === "last_month") {
        return { start: addMonths(range.start, -1), end: addMonths(range.end, -1), label: "previous month" };
    }
    if (key === "this_year" || key === "last_year") {
        return {
            start: new Date(range.start.getFullYear() - 1, range.start.getMonth(), range.start.getDate()),
            end: new Date(range.end.getFullYear() - 1, range.end.getMonth(), range.end.getDate()),
            label: "previous year",
        };
    }
    const days = Math.round((range.end.getTime() - range.start.getTime()) / DAY);
    return { start: addDays(range.start, -days), end: range.start, label: `previous ${days} day${days === 1 ? "" : "s"}` };
}

export const inRange = (d: Date | null, range: DateRange) => !!d && d >= range.start && d < range.end;

export const filterByRange = (enquiries: Enquiry[], range: DateRange) =>
    enquiries.filter((e) => inRange(createdAt(e), range));

// =====================================================================
// Time series
// =====================================================================

export type Granularity = "hour" | "day" | "week" | "month";

export const autoGranularity = (range: DateRange): Granularity => {
    const days = (range.end.getTime() - range.start.getTime()) / DAY;
    if (days <= 2) return "hour";
    if (days <= 92) return "day";
    if (days <= 400) return "week";
    return "month";
};

const bucketStart = (d: Date, g: Granularity) => {
    switch (g) {
        case "hour": return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
        case "day": return startOfDay(d);
        case "week": {
            const s = startOfDay(d);
            const diff = (s.getDay() + 6) % 7; // weeks start on Monday
            return addDays(s, -diff);
        }
        case "month": return startOfMonth(d);
    }
};

const nextBucket = (d: Date, g: Granularity) => {
    switch (g) {
        case "hour": return new Date(d.getTime() + 3_600_000);
        case "day": return addDays(d, 1);
        case "week": return addDays(d, 7);
        case "month": return addMonths(d, 1);
    }
};

export const bucketLabel = (d: Date, g: Granularity) => {
    switch (g) {
        case "hour": return d.toLocaleTimeString("en-IN", { hour: "numeric", hour12: true });
        case "day": return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        case "week": return `Wk of ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
        case "month": return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    }
};

export interface SeriesPoint {
    key: number;
    label: string;
    current: number;
    previous: number | null;
    converted: number;
    [series: string]: number | string | null;
}

/**
 * Buckets enquiries over the range. When `prev` is supplied, each previous
 * enquiry is shifted forward by the gap between the two windows so bucket N of
 * the previous period lines up with bucket N of the current one.
 */
export function buildTimeSeries(
    current: Enquiry[],
    range: DateRange,
    granularity: Granularity,
    prev?: { enquiries: Enquiry[]; range: DateRange } | null,
    splitBy?: (e: Enquiry) => string,
    splitKeys: string[] = [],
): SeriesPoint[] {
    const buckets = new Map<number, SeriesPoint>();
    const order: number[] = [];
    for (let b = bucketStart(range.start, granularity); b < range.end; b = nextBucket(b, granularity)) {
        const point: SeriesPoint = { key: b.getTime(), label: bucketLabel(b, granularity), current: 0, previous: prev ? 0 : null, converted: 0 };
        splitKeys.forEach((k) => (point[k] = 0));
        buckets.set(b.getTime(), point);
        order.push(b.getTime());
    }

    for (const e of current) {
        const d = createdAt(e);
        if (!d || !inRange(d, range)) continue;
        const point = buckets.get(bucketStart(d, granularity).getTime());
        if (!point) continue;
        point.current += 1;
        if (isConverted(e)) point.converted += 1;
        if (splitBy) {
            const k = splitBy(e);
            const key = splitKeys.includes(k) ? k : "Other";
            point[key] = ((point[key] as number) || 0) + 1;
        }
    }

    if (prev) {
        const monthShift = (range.start.getFullYear() - prev.range.start.getFullYear()) * 12 + range.start.getMonth() - prev.range.start.getMonth();
        const msShift = range.start.getTime() - prev.range.start.getTime();
        for (const e of prev.enquiries) {
            const d = createdAt(e);
            if (!d || !inRange(d, prev.range)) continue;
            const shifted = granularity === "month" ? addMonths(d, monthShift) : new Date(d.getTime() + msShift);
            const point = buckets.get(bucketStart(shifted, granularity).getTime());
            if (point) point.previous = (point.previous || 0) + 1;
        }
    }

    return order.map((k) => buckets.get(k)!);
}

// =====================================================================
// Funnel
// =====================================================================

export const FUNNEL_STAGES = ["Received", "Contacted", "In Progress", "Converted"] as const;

/** Index into FUNNEL_STAGES of the furthest stage an enquiry has reached. */
export function furthestStage(e: Enquiry): number {
    if (isConverted(e)) return 3;
    const status = getStatus(e);
    if (status !== "Closed") return STATUSES.indexOf(status);
    // Closed but not converted: use status history to see how far it got.
    // Closing implies someone acted on it, so it counts as contacted at minimum.
    const reachedInProgress = (e.activity || []).some((a) => a.type === "status" && a.to === "In Progress");
    return reachedInProgress ? 2 : 1;
}

export function buildFunnel(enquiries: Enquiry[]) {
    const counts = [0, 0, 0, 0];
    for (const e of enquiries) {
        const stage = furthestStage(e);
        for (let i = 0; i <= stage; i++) counts[i] += 1;
    }
    return FUNNEL_STAGES.map((stage, i) => ({
        stage,
        count: counts[i],
        ofTotal: rate(counts[i], counts[0]),
        fromPrevious: i === 0 ? null : rate(counts[i], counts[i - 1]),
        dropOff: i === 0 ? null : counts[i - 1] - counts[i],
    }));
}

// =====================================================================
// Core metrics
// =====================================================================

export const rate = (part: number, whole: number) => (whole > 0 ? part / whole : null);

export const percentChange = (current: number, previous: number) =>
    previous > 0 ? (current - previous) / previous : null;

const median = (values: number[]) => {
    if (!values.length) return null;
    const s = [...values].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};
const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);

export function responseTimes(enquiries: Enquiry[]) {
    const values: number[] = [];
    for (const e of enquiries) {
        const c = createdAt(e);
        const f = toDate(e.firstContactedAt);
        if (c && f && f >= c) values.push(f.getTime() - c.getTime());
    }
    return { count: values.length, average: mean(values), median: median(values) };
}

export function conversionTimes(enquiries: Enquiry[]) {
    const values: number[] = [];
    for (const e of enquiries) {
        if (!isConverted(e)) continue;
        const c = createdAt(e);
        const f = toDate(e.closedAt);
        if (c && f && f >= c) values.push(f.getTime() - c.getTime());
    }
    return { count: values.length, average: mean(values), median: median(values) };
}

export interface Summary {
    total: number;
    uniqueContacts: number;
    byStatus: Record<EnquiryStatus, number>;
    open: number;
    converted: number;
    lost: number;
    closed: number;
    conversionRate: number | null;
    winRate: number | null;
    lostRate: number | null;
    contactedRate: number | null;
}

export function summarize(enquiries: Enquiry[]): Summary {
    const byStatus: Record<EnquiryStatus, number> = { New: 0, Contacted: 0, "In Progress": 0, Closed: 0 };
    let converted = 0;
    let lost = 0;
    const contacts = new Set<string>();
    for (const e of enquiries) {
        byStatus[getStatus(e)] += 1;
        if (isConverted(e)) converted += 1;
        if (isLost(e)) lost += 1;
        contacts.add(normalizeMobile(e.mobile) || e._id);
    }
    const total = enquiries.length;
    const closed = byStatus.Closed;
    return {
        total,
        uniqueContacts: contacts.size,
        byStatus,
        open: total - closed,
        converted,
        lost,
        closed,
        conversionRate: rate(converted, total),
        winRate: rate(converted, converted + lost),
        lostRate: rate(lost, total),
        contactedRate: rate(total - byStatus.New, total),
    };
}

// =====================================================================
// Breakdown by dimension
// =====================================================================

export interface BreakdownRow {
    key: string;
    total: number;
    share: number;
    open: number;
    contacted: number;
    converted: number;
    lost: number;
    conversionRate: number | null;
    previous: number | null;
    change: number | null;
    medianResponseMs: number | null;
    pendingFollowUps: number;
    overdueFollowUps: number;
}

export function breakdown(
    enquiries: Enquiry[],
    get: (e: Enquiry) => string,
    previous?: Enquiry[] | null,
    now = new Date(),
): BreakdownRow[] {
    const groups = new Map<string, Enquiry[]>();
    for (const e of enquiries) {
        const k = get(e);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k)!.push(e);
    }
    const prevCounts = new Map<string, number>();
    previous?.forEach((e) => prevCounts.set(get(e), (prevCounts.get(get(e)) || 0) + 1));

    const total = enquiries.length;
    return Array.from(groups.entries())
        .map(([key, list]) => {
            const s = summarize(list);
            const prev = previous ? prevCounts.get(key) || 0 : null;
            const fu = followUpStats(list, now);
            return {
                key,
                total: list.length,
                share: total ? list.length / total : 0,
                open: s.open,
                contacted: list.length - s.byStatus.New,
                converted: s.converted,
                lost: s.lost,
                conversionRate: s.conversionRate,
                previous: prev,
                change: prev === null ? null : percentChange(list.length, prev),
                medianResponseMs: responseTimes(list).median,
                pendingFollowUps: fu.pending,
                overdueFollowUps: fu.overdue,
            };
        })
        .sort((a, b) => b.total - a.total || a.key.localeCompare(b.key));
}

/** Keeps the top N keys and folds the rest into "Other" (never invent a 9th colour). */
export function topKeys(rows: { key: string }[], n: number) {
    return rows.slice(0, n).map((r) => r.key);
}

// =====================================================================
// Follow-ups
// =====================================================================

export type FollowUpState = "overdue" | "today" | "upcoming" | "completed";

export interface FollowUpItem {
    enquiry: Enquiry;
    followUp: EnquiryFollowUp;
    due: Date;
    state: FollowUpState;
    completedOnTime: boolean | null;
}

export function followUpState(f: EnquiryFollowUp, now = new Date()): FollowUpState {
    if (f.completedAt) return "completed";
    // Day-level: anything due today (even earlier today) is "today", not overdue.
    const due = toDate(f.dueAt)!;
    const today = startOfDay(now);
    if (due < today) return "overdue";
    if (due < addDays(today, 1)) return "today";
    return "upcoming";
}

export function flattenFollowUps(enquiries: Enquiry[], now = new Date()): FollowUpItem[] {
    const items: FollowUpItem[] = [];
    for (const enquiry of enquiries) {
        for (const followUp of enquiry.followUps || []) {
            const due = toDate(followUp.dueAt);
            if (!due) continue;
            const completed = toDate(followUp.completedAt);
            items.push({
                enquiry,
                followUp,
                due,
                state: followUpState(followUp, now),
                completedOnTime: completed ? completed < addDays(startOfDay(due), 1) : null,
            });
        }
    }
    return items.sort((a, b) => a.due.getTime() - b.due.getTime());
}

export function followUpStats(enquiries: Enquiry[], now = new Date()) {
    const items = flattenFollowUps(enquiries, now);
    const completed = items.filter((i) => i.state === "completed");
    const overdue = items.filter((i) => i.state === "overdue").length;
    const today = items.filter((i) => i.state === "today").length;
    const upcoming = items.filter((i) => i.state === "upcoming").length;
    // Completion is measured against follow-ups that have fallen due.
    const due = completed.length + overdue;
    const withFollowUp = enquiries.filter((e) => (e.followUps || []).length > 0);
    return {
        total: items.length,
        completed: completed.length,
        pending: overdue + today + upcoming,
        overdue,
        today,
        upcoming,
        completionRate: rate(completed.length, due),
        onTimeRate: rate(completed.filter((i) => i.completedOnTime).length, completed.length),
        enquiriesWithFollowUp: withFollowUp.length,
        followUpConversionRate: rate(withFollowUp.filter(isConverted).length, withFollowUp.length),
    };
}

// =====================================================================
// Lead aging & time patterns
// =====================================================================

export const AGING_BUCKETS = [
    { label: "< 1 day", max: 1 },
    { label: "1–3 days", max: 3 },
    { label: "3–7 days", max: 7 },
    { label: "1–2 weeks", max: 14 },
    { label: "2–4 weeks", max: 30 },
    { label: "30+ days", max: Infinity },
];

export const ageInDays = (e: Enquiry, now = new Date()) => {
    const c = createdAt(e);
    return c ? (now.getTime() - c.getTime()) / DAY : 0;
};

export function leadAging(enquiries: Enquiry[], now = new Date()) {
    const open = enquiries.filter(isOpen);
    return AGING_BUCKETS.map((b, i) => {
        const min = i === 0 ? -Infinity : AGING_BUCKETS[i - 1].max;
        const list = open.filter((e) => {
            const age = ageInDays(e, now);
            return age >= min && age < b.max;
        });
        return {
            label: b.label,
            total: list.length,
            New: list.filter((e) => getStatus(e) === "New").length,
            Contacted: list.filter((e) => getStatus(e) === "Contacted").length,
            "In Progress": list.filter((e) => getStatus(e) === "In Progress").length,
        };
    });
}

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** 7 × 24 matrix (Monday first) of enquiry counts by local weekday and hour. */
export function weekdayHourMatrix(enquiries: Enquiry[]) {
    const matrix = WEEKDAYS.map(() => new Array(24).fill(0) as number[]);
    for (const e of enquiries) {
        const d = createdAt(e);
        if (!d) continue;
        matrix[(d.getDay() + 6) % 7][d.getHours()] += 1;
    }
    return matrix;
}

// =====================================================================
// Smart insights (rule-based, computed from real data only)
// =====================================================================

export type InsightTone = "positive" | "negative" | "warning" | "neutral";

export interface Insight {
    id: string;
    tone: InsightTone;
    title: string;
    detail: string;
    link?: string;
}

const MIN_SAMPLE = 5;

export function generateInsights(
    current: Enquiry[],
    previous: Enquiry[] | null,
    allOpenScope: Enquiry[],
    prevLabel: string | null,
    now = new Date(),
): Insight[] {
    const insights: Insight[] = [];
    const s = summarize(current);

    if (previous && prevLabel) {
        const change = percentChange(current.length, previous.length);
        if (change !== null && Math.abs(change) >= 0.1) {
            insights.push({
                id: "volume",
                tone: change > 0 ? "positive" : "negative",
                title: `Enquiries ${change > 0 ? "up" : "down"} ${formatPercent(Math.abs(change))} vs ${prevLabel}`,
                detail: `${current.length} enquiries in this period compared with ${previous.length} in the ${prevLabel}.`,
                link: "/dashboard/analytics",
            });
        } else if (previous.length === 0 && current.length > 0) {
            insights.push({
                id: "volume",
                tone: "positive",
                title: `${current.length} enquiries, up from none`,
                detail: `There were no enquiries in the ${prevLabel}.`,
            });
        }

        const prevSummary = summarize(previous);
        if (s.conversionRate !== null && prevSummary.conversionRate !== null && s.converted + prevSummary.converted >= MIN_SAMPLE) {
            const diff = s.conversionRate - prevSummary.conversionRate;
            if (Math.abs(diff) >= 0.02) {
                insights.push({
                    id: "conversion",
                    tone: diff > 0 ? "positive" : "negative",
                    title: `Conversion rate ${diff > 0 ? "improved" : "fell"} by ${(Math.abs(diff) * 100).toFixed(1)} pts`,
                    detail: `${formatPercent(s.conversionRate)} now vs ${formatPercent(prevSummary.conversionRate)} in the ${prevLabel}.`,
                    link: "/dashboard/analytics?tab=funnel",
                });
            }
        }
    }

    if (current.length >= MIN_SAMPLE) {
        const sources = breakdown(current, getSource).filter((r) => r.key !== NOT_SPECIFIED);
        if (sources[0]) {
            insights.push({
                id: "top-source",
                tone: "neutral",
                title: `${sources[0].key} is the largest source`,
                detail: `${sources[0].total} enquiries (${formatPercent(sources[0].share)} of the total).`,
                link: "/dashboard/analytics?tab=sources",
            });
        }
        const convertingSources = sources.filter((r) => r.total >= MIN_SAMPLE && r.converted > 0);
        if (convertingSources.length >= 2) {
            const best = [...convertingSources].sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0))[0];
            insights.push({
                id: "best-source",
                tone: "positive",
                title: `${best.key} converts best`,
                detail: `${formatPercent(best.conversionRate)} of ${best.total} ${best.key} enquiries converted (sources with ≥ ${MIN_SAMPLE} enquiries).`,
                link: "/dashboard/analytics?tab=sources",
            });
        }

        const categories = breakdown(current, getCategory);
        if (categories[0]) {
            insights.push({
                id: "top-category",
                tone: "neutral",
                title: `Most demand: ${categories[0].key}`,
                detail: `${categories[0].total} enquiries (${formatPercent(categories[0].share)}).`,
                link: "/dashboard/analytics?tab=programs",
            });
        }
        const programs = breakdown(current, getProgram).filter((r) => r.key !== NOT_SPECIFIED);
        if (programs[0] && programs[0].total >= 2) {
            insights.push({
                id: "top-program",
                tone: "neutral",
                title: `Most requested course/domain: ${programs[0].key}`,
                detail: `${programs[0].total} enquiries mention it.`,
                link: "/dashboard/analytics?tab=programs",
            });
        }

        const owners = breakdown(current, getOwner).filter((r) => r.key !== "Unassigned");
        if (owners[0]) {
            insights.push({
                id: "top-owner",
                tone: "neutral",
                title: `${owners[0].key} handles the most enquiries`,
                detail: `${owners[0].total} enquiries (${formatPercent(owners[0].share)}).`,
                link: "/dashboard/analytics?tab=team",
            });
        }

        const matrix = weekdayHourMatrix(current);
        const byDay = WEEKDAYS.map((day, i) => ({ day, count: matrix[i].reduce((a, b) => a + b, 0) }));
        const peak = [...byDay].sort((a, b) => b.count - a.count)[0];
        if (peak.count > 0) {
            const dayName = WEEKDAY_NAMES[WEEKDAYS.indexOf(peak.day)];
            insights.push({
                id: "peak-day",
                tone: "neutral",
                title: `${dayName} is the busiest day`,
                detail: `${peak.count} enquiries (${formatPercent(peak.count / current.length)}) arrived on ${dayName}s.`,
                link: "/dashboard/analytics?tab=trends",
            });
        }
    }

    const staleNew = allOpenScope.filter((e) => getStatus(e) === "New" && ageInDays(e, now) >= 2 && ageInDays(e, now) < 30);
    if (staleNew.length) {
        insights.push({
            id: "stale-new",
            tone: "warning",
            title: `${staleNew.length} recent enquir${staleNew.length === 1 ? "y has" : "ies have"} not been contacted for 2+ days`,
            detail: "Received in the last 30 days and still marked New. Contact them or update their status.",
            link: "/dashboard/enquiries?status=New&sort=createdAt&dir=asc",
        });
    }

    const aging = allOpenScope.filter((e) => ageInDays(e, now) >= 30);
    if (aging.length) {
        insights.push({
            id: "aging",
            tone: "warning",
            title: `${aging.length} open enquir${aging.length === 1 ? "y is" : "ies are"} older than 30 days`,
            detail: "Consider closing them with an outcome so conversion figures stay accurate.",
            link: "/dashboard/enquiries?outcome=open&sort=createdAt&dir=asc",
        });
    }

    const fu = followUpStats(allOpenScope, now);
    if (fu.overdue) {
        insights.push({
            id: "overdue",
            tone: "negative",
            title: `${fu.overdue} follow-up${fu.overdue === 1 ? " is" : "s are"} overdue`,
            detail: "Open the follow-up queue to complete or reschedule them.",
            link: "/dashboard/follow-ups",
        });
    }

    const duplicates = current.length - s.uniqueContacts;
    if (duplicates > 0) {
        insights.push({
            id: "duplicates",
            tone: "neutral",
            title: `${duplicates} repeat enquir${duplicates === 1 ? "y" : "ies"} from existing contacts`,
            detail: `${s.uniqueContacts} unique mobile numbers across ${current.length} enquiries.`,
            link: "/dashboard/enquiries",
        });
    }

    return insights;
}

// =====================================================================
// Search
// =====================================================================

export function matchesSearch(e: Enquiry, query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const digits = q.replace(/\D/g, "");
    if (digits.length >= 3 && normalizeMobile(e.mobile).includes(digits)) return true;
    return [
        e.name, e.email, e._id, getCollege(e), getProgram(e), getCategory(e), getSource(e), getSourceDetail(e), getOwner(e),
    ].some((v) => v?.toLowerCase().includes(q));
}

// =====================================================================
// Formatting
// =====================================================================

export const formatNumber = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n.toLocaleString("en-IN"));

export const formatPercent = (n: number | null | undefined, digits = 1) => {
    if (n === null || n === undefined || !isFinite(n)) return "—";
    const v = n * 100;
    return `${Number.isInteger(v) ? v : v.toFixed(digits)}%`;
};

export const formatDuration = (ms: number | null | undefined) => {
    if (ms === null || ms === undefined) return "—";
    const minutes = ms / 60_000;
    if (minutes < 60) return `${Math.max(1, Math.round(minutes))}m`;
    const hours = minutes / 60;
    if (hours < 48) return `${hours.toFixed(hours < 10 ? 1 : 0)}h`;
    return `${(hours / 24).toFixed(1)}d`;
};

export const formatDate = (d: Date | string | null | undefined) => {
    const date = typeof d === "string" ? toDate(d) : d;
    return date ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
};

export const formatDateTime = (d: Date | string | null | undefined) => {
    const date = typeof d === "string" ? toDate(d) : d;
    return date
        ? date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })
        : "—";
};

export const formatRelative = (d: Date | string | null | undefined, now = new Date()) => {
    const date = typeof d === "string" ? toDate(d) : d;
    if (!date) return "—";
    const diff = date.getTime() - now.getTime();
    const abs = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (abs < 3_600_000) return rtf.format(Math.round(diff / 60_000), "minute");
    if (abs < DAY) return rtf.format(Math.round(diff / 3_600_000), "hour");
    if (abs < 30 * DAY) return rtf.format(Math.round(diff / DAY), "day");
    return formatDate(date);
};
