import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Enquiry } from "../../components/site/types";
import { useEnquiryData } from "../context/enquiryData";
import {
    DIMENSIONS, createdAt, filterByRange, getPriority, getStatus, isConverted, isLost, isOpen,
    matchesSearch, previousRange, resolveRange, uniqueValues, RANGE_OPTIONS, type RangeKey,
} from "../lib/analytics";

/** Dimension filters stored in the URL so any dashboard view can be bookmarked or shared. */
export const FILTER_KEYS = ["status", "source", "category", "program", "college", "owner", "priority", "outcome"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

export const OUTCOME_FILTERS = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed (any)" },
    { value: "converted", label: "Converted" },
    { value: "not_converted", label: "Not converted" },
];

export const DEFAULT_RANGE: RangeKey = "30d";

export function useDashboardFilters() {
    const [params, setParams] = useSearchParams();

    const rangeParam = params.get("range") as RangeKey | null;
    const range: RangeKey = rangeParam && RANGE_OPTIONS.some((o) => o.value === rangeParam) ? rangeParam : DEFAULT_RANGE;
    const from = params.get("from");
    const to = params.get("to");
    const q = params.get("q") || "";

    const values = useMemo(() => {
        const v = {} as Record<FilterKey, string>;
        FILTER_KEYS.forEach((k) => (v[k] = params.get(k) || ""));
        return v;
    }, [params]);

    const update = useCallback(
        (changes: Record<string, string | null>) => {
            setParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
                    // Any filter change invalidates the current table page.
                    if (!("page" in changes)) next.delete("page");
                    return next;
                },
                { replace: true },
            );
        },
        [setParams],
    );

    const activeCount = FILTER_KEYS.filter((k) => values[k]).length + (q ? 1 : 0);

    const clear = useCallback(() => {
        update(Object.fromEntries([...FILTER_KEYS, "q"].map((k) => [k, null])));
    }, [update]);

    return { params, range, from, to, q, values, update, clear, activeCount };
}

export function applyDimensionFilters(enquiries: Enquiry[], values: Record<FilterKey, string>, q: string) {
    return enquiries.filter((e) => {
        if (values.status && getStatus(e) !== values.status) return false;
        if (values.priority && getPriority(e) !== values.priority) return false;
        if (values.source && DIMENSIONS.source.get(e) !== values.source) return false;
        if (values.category && DIMENSIONS.category.get(e) !== values.category) return false;
        if (values.program && DIMENSIONS.program.get(e) !== values.program) return false;
        if (values.college && DIMENSIONS.college.get(e) !== values.college) return false;
        if (values.owner && DIMENSIONS.owner.get(e) !== values.owner) return false;
        switch (values.outcome) {
            case "open": if (!isOpen(e)) return false; break;
            case "closed": if (isOpen(e)) return false; break;
            case "converted": if (!isConverted(e)) return false; break;
            case "not_converted": if (!isLost(e)) return false; break;
        }
        return matchesSearch(e, q);
    });
}

/**
 * The filtered data every analytics page works from.
 * - `current`: enquiries in the selected date range matching all filters
 * - `previous`: the same filters over the comparison window (null for "All time")
 * - `scoped`: filters applied but no date limit — for operational views such as
 *   overdue follow-ups, where an old enquiry still needs attention today.
 */
export function useFilteredEnquiries() {
    const data = useEnquiryData();
    const filters = useDashboardFilters();
    const { enquiries } = data;
    const { range: rangeKey, from, to, values, q } = filters;

    const earliest = useMemo(() => {
        let min: Date | null = null;
        for (const e of enquiries) {
            const d = createdAt(e);
            if (d && (!min || d < min)) min = d;
        }
        return min;
    }, [enquiries]);

    const range = useMemo(() => resolveRange(rangeKey, from, to, earliest), [rangeKey, from, to, earliest]);
    const prevRange = useMemo(() => previousRange(rangeKey, range), [rangeKey, range]);

    const scoped = useMemo(() => applyDimensionFilters(enquiries, values, q), [enquiries, values, q]);
    const current = useMemo(() => filterByRange(scoped, range), [scoped, range]);
    const previous = useMemo(() => (prevRange ? filterByRange(scoped, prevRange) : null), [scoped, prevRange]);

    const options = useMemo(
        () => ({
            status: ["New", "Contacted", "In Progress", "Closed"],
            priority: ["High", "Medium", "Low"],
            source: uniqueValues(enquiries, DIMENSIONS.source.get),
            category: uniqueValues(enquiries, DIMENSIONS.category.get),
            program: uniqueValues(enquiries, DIMENSIONS.program.get),
            college: uniqueValues(enquiries, DIMENSIONS.college.get),
            owner: uniqueValues(enquiries, DIMENSIONS.owner.get),
        }),
        [enquiries],
    );

    return { ...data, filters, range, prevRange, scoped, current, previous, options };
}
