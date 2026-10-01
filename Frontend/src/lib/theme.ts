import type { EnquiryStatus } from "../../components/site/types";

/** Brand accent used for single-series charts. */
export const BRAND = "#7c3aed";
export const PREVIOUS = "#94a3b8";
export const GRID = "#ece8f6";
export const AXIS = "#64748b";

/**
 * Categorical palette in a fixed, CVD-validated order (dataviz reference
 * palette, light mode). Slot 8 is reserved for the neutral "Other" bucket so a
 * ninth series is never given a generated hue.
 */
export const CATEGORICAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7"];
export const OTHER_COLOR = "#9ca3af";
export const MAX_SERIES = CATEGORICAL.length;

/** Colour follows the entity: assign from a stable, ordered key list. */
export function colorMap(keys: string[]) {
    const map: Record<string, string> = {};
    keys.forEach((k, i) => (map[k] = i < CATEGORICAL.length ? CATEGORICAL[i] : OTHER_COLOR));
    map.Other = OTHER_COLOR;
    return map;
}

/** Ordinal ramp for funnel stages (light → dark, lightest still ≥ 2:1 on white). */
export const FUNNEL_RAMP = ["#a78bfa", "#8b5cf6", "#7c3aed", "#5b21b6"];

/** Sequential ramp for heatmaps (near-zero recedes toward the surface). */
export const HEAT_RAMP = ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6"];

export const STATUS_STYLES: Record<EnquiryStatus, { dot: string; badge: string; color: string }> = {
    New: { dot: "bg-sky-500", badge: "bg-sky-50 text-sky-700 ring-sky-200", color: "#0ea5e9" },
    Contacted: { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-800 ring-amber-200", color: "#f59e0b" },
    "In Progress": { dot: "bg-violet-500", badge: "bg-violet-50 text-violet-700 ring-violet-200", color: "#8b5cf6" },
    Closed: { dot: "bg-slate-400", badge: "bg-slate-100 text-slate-700 ring-slate-200", color: "#94a3b8" },
};

export const PRIORITY_STYLES: Record<string, string> = {
    High: "bg-rose-50 text-rose-700 ring-rose-200",
    Medium: "bg-slate-50 text-slate-600 ring-slate-200",
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};
