import type { ButtonHTMLAttributes, ComponentType, ReactNode, SelectHTMLAttributes, SVGProps } from "react";
import { ArrowDownRightIcon, ArrowPathIcon, ArrowUpRightIcon, ExclamationTriangleIcon, InboxIcon } from "@heroicons/react/24/outline";
import type { EnquiryOutcome, EnquiryStatus } from "../../../components/site/types";
import { PRIORITY_STYLES, STATUS_STYLES } from "../../lib/theme";
import { formatPercent } from "../../lib/analytics";
import { cx } from "../../lib/cx";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;


// ==================== LAYOUT ====================

export function Card({ children, className, as: Tag = "section" }: { children: ReactNode; className?: string; as?: "section" | "div" }) {
    return (
        <Tag className={cx("min-w-0 rounded-2xl border border-violet-100 bg-white shadow-[0_1px_2px_rgba(76,29,149,0.04),0_4px_16px_-8px_rgba(76,29,149,0.10)]", className)}>
            {children}
        </Tag>
    );
}

export function CardHeader({ title, subtitle, action, className }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; className?: string }) {
    return (
        <div className={cx("flex flex-wrap items-start justify-between gap-3 px-5 pt-5", className)}>
            <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
                {subtitle && <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p>}
            </div>
            {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
    );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
    return (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

// ==================== CONTROLS ====================

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
const BUTTON_STYLES: Record<ButtonVariant, string> = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-sm",
    secondary: "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
};

export function Button({
    variant = "secondary", size = "md", icon: IconCmp, children, className, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: "sm" | "md"; icon?: Icon }) {
    return (
        <button
            type="button"
            {...props}
            className={cx(
                "inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
                size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
                BUTTON_STYLES[variant],
                className,
            )}
        >
            {IconCmp && <IconCmp className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />}
            {children}
        </button>
    );
}

export function Select({ label, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
    const select = (
        <select
            {...props}
            className={cx(
                "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200",
                // Full width unless the caller sets its own width (no tailwind-merge here).
                !/(^|\s)w-/.test(className || "") && "w-full",
                className,
            )}
        >
            {children}
        </select>
    );
    if (!label) return select;
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
            {select}
        </label>
    );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
    return (
        <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl bg-violet-50/70 p-1 [scrollbar-width:none]">
            {tabs.map((t) => (
                <button
                    key={t.value}
                    role="tab"
                    type="button"
                    aria-selected={value === t.value}
                    onClick={() => onChange(t.value)}
                    className={cx(
                        "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                        value === t.value ? "bg-white text-violet-700 shadow-sm" : "text-slate-600 hover:text-slate-900",
                    )}
                >
                    {t.label}
                    {t.count !== undefined && (
                        <span className={cx("ml-1.5 rounded-full px-1.5 py-0.5 text-[11px]", value === t.value ? "bg-violet-100" : "bg-white/70")}>{t.count}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

// ==================== BADGES & INDICATORS ====================

export function StatusBadge({ status, outcome }: { status: EnquiryStatus; outcome?: EnquiryOutcome }) {
    const s = STATUS_STYLES[status] || STATUS_STYLES.New;
    return (
        <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", s.badge)}>
            <span className={cx("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
            {status}
            {status === "Closed" && outcome && (
                <span className={outcome === "Converted" ? "text-emerald-700" : "text-rose-700"}>· {outcome === "Converted" ? "Won" : "Lost"}</span>
            )}
        </span>
    );
}

export function PriorityBadge({ priority }: { priority: string }) {
    return (
        <span className={cx("inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium)}>
            {priority}
        </span>
    );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
    return <span className={cx("inline-flex max-w-full items-center truncate rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700", className)}>{children}</span>;
}

/**
 * Trend indicator. `invert` flips the colour semantics for metrics where a
 * decrease is good (e.g. response time, overdue count).
 */
export function Delta({ value, invert = false, suffix, className }: { value: number | null; invert?: boolean; suffix?: string; className?: string }) {
    if (value === null || !isFinite(value)) return <span className={cx("text-xs text-slate-400", className)}>No comparison</span>;
    const flat = Math.abs(value) < 0.005;
    const good = flat ? null : (value > 0) !== invert;
    const IconCmp = value > 0 ? ArrowUpRightIcon : ArrowDownRightIcon;
    return (
        <span className={cx("inline-flex items-center gap-0.5 text-xs font-semibold", flat ? "text-slate-500" : good ? "text-emerald-600" : "text-rose-600", className)}>
            {!flat && <IconCmp className="h-3.5 w-3.5" aria-hidden />}
            {flat ? "No change" : formatPercent(Math.abs(value))}
            {suffix && <span className="ml-1 font-normal text-slate-500">{suffix}</span>}
        </span>
    );
}

export function Meter({ value, color = "#7c3aed", label }: { value: number; color?: string; label?: string }) {
    return (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-violet-50" role="meter" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
            <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
        </div>
    );
}

// ==================== STATES ====================

export function Skeleton({ className }: { className?: string }) {
    return <div className={cx("animate-pulse rounded-lg bg-violet-100/60", className)} aria-hidden />;
}

export function PageSkeleton() {
    return (
        <div className="space-y-5" aria-busy="true" aria-label="Loading">
            <Skeleton className="h-8 w-56" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
                <Skeleton className="h-80 lg:col-span-2" />
                <Skeleton className="h-80" />
            </div>
        </div>
    );
}

export function EmptyState({ title, description, action, icon: IconCmp = InboxIcon, compact }: { title: string; description?: ReactNode; action?: ReactNode; icon?: Icon; compact?: boolean }) {
    return (
        <div className={cx("flex flex-col items-center justify-center text-center", compact ? "px-4 py-8" : "px-6 py-14")}>
            <div className="mb-3 rounded-2xl bg-violet-50 p-3 text-violet-500">
                <IconCmp className="h-6 w-6" aria-hidden />
            </div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <Card className="mx-auto max-w-lg">
            <EmptyState
                icon={ExclamationTriangleIcon}
                title="Couldn't load data"
                description={message}
                action={onRetry && <Button icon={ArrowPathIcon} onClick={onRetry}>Try again</Button>}
            />
        </Card>
    );
}
