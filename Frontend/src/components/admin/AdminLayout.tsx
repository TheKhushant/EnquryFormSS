import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
    ArrowPathIcon, ArrowRightStartOnRectangleIcon, Bars3Icon, CalendarDaysIcon, ChartBarSquareIcon, ChatBubbleLeftRightIcon,
    DocumentChartBarIcon, HomeIcon, LightBulbIcon, MagnifyingGlassIcon, QueueListIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEnquiryData } from "../../context/enquiryData";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { FILTER_KEYS } from "../../hooks/useDashboardFilters";
import { followUpStats, formatRelative, getCategory, getStatus, matchesSearch } from "../../lib/analytics";
import { setAdminSession } from "../../lib/auth";
import DataGate from "./DataGate";
import { PageSkeleton, StatusBadge } from "./ui";
import { cx } from "../../lib/cx";

const NAV = [
    { to: "/dashboard", label: "Overview", icon: HomeIcon, end: true },
    { to: "/dashboard/enquiries", label: "Enquiries", icon: QueueListIcon },
    { to: "/dashboard/follow-ups", label: "Follow-ups", icon: CalendarDaysIcon, badge: "followups" as const },
    { to: "/dashboard/analytics", label: "Analytics", icon: ChartBarSquareIcon },
    { to: "/dashboard/insights", label: "Insights", icon: LightBulbIcon },
    { to: "/dashboard/reports", label: "Reports", icon: DocumentChartBarIcon },
    { to: "/dashboard/chat-leads", label: "Chat Leads", icon: ChatBubbleLeftRightIcon },
];

// Filters that carry across pages when navigating (page-specific params don't).
const SHARED_PARAMS = ["range", "from", "to", ...FILTER_KEYS];

export default function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { enquiries, live, lastUpdated, reload, status } = useEnquiryData();
    const [refreshing, setRefreshing] = useState(false);

    const sharedSearch = useMemo(() => {
        const next = new URLSearchParams();
        SHARED_PARAMS.forEach((k) => params.get(k) && next.set(k, params.get(k)!));
        const s = next.toString();
        return s ? `?${s}` : "";
    }, [params]);

    const attention = useMemo(() => {
        const s = followUpStats(enquiries);
        return s.overdue + s.today;
    }, [enquiries]);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile drawer on navigation
    useEffect(() => setMenuOpen(false), [location.pathname]);

    const refresh = async () => {
        setRefreshing(true);
        await reload();
        setRefreshing(false);
    };

    const logout = () => {
        setAdminSession(false);
        navigate("/admin-login", { replace: true });
    };

    const sidebar = (
        <nav aria-label="Dashboard" className="flex h-full flex-col">
            <Link to="/dashboard" className="flex items-center gap-3 px-5 py-5">
                <img src="/ssgrp.png" alt="" className="h-9 w-9 object-contain" />
                <div className="leading-tight">
                    <p className="text-sm font-bold text-slate-900">SS Group</p>
                    <p className="text-xs text-slate-500">Enquiry CRM</p>
                </div>
            </Link>
            <ul className="flex-1 space-y-0.5 px-3">
                {NAV.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={{ pathname: item.to, search: sharedSearch }}
                            end={item.end}
                            className={({ isActive }) =>
                                cx(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                                    isActive ? "bg-violet-600 text-white shadow-sm" : "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge === "followups" && attention > 0 && (
                                        <span
                                            className={cx("rounded-full px-1.5 py-0.5 text-[11px] font-semibold", isActive ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700")}
                                            title={`${attention} follow-ups due today or overdue`}
                                        >
                                            {attention}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="border-t border-violet-100 p-3">
                <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" aria-hidden />
                    Log out
                </button>
            </div>
        </nav>
    );

    return (
        <div className="min-h-screen bg-[#f7f5fd] text-slate-800">
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />

            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-violet-100 bg-white lg:block print:hidden">{sidebar}</aside>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden print:hidden">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} aria-hidden />
                    <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
                        <button type="button" onClick={() => setMenuOpen(false)} className="absolute right-3 top-5 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        {sidebar}
                    </aside>
                </div>
            )}

            <div className="lg:pl-60">
                <header className="sticky top-0 z-20 border-b border-violet-100 bg-white/85 backdrop-blur print:hidden">
                    <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
                        <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-violet-50 lg:hidden" aria-label="Open menu">
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <GlobalSearch />
                        <div className="ml-auto flex items-center gap-3">
                            <span
                                className="hidden items-center gap-1.5 text-xs text-slate-500 sm:inline-flex"
                                title={live ? "Receiving new enquiries in real time" : "Live updates disconnected — use refresh"}
                            >
                                <span className={cx("h-2 w-2 rounded-full", live ? "bg-emerald-500" : "bg-slate-300")} aria-hidden />
                                {live ? "Live" : "Offline"}
                                {lastUpdated && <span className="hidden md:inline">· updated {formatRelative(lastUpdated)}</span>}
                            </span>
                            <button
                                type="button"
                                onClick={refresh}
                                disabled={refreshing || status === "loading"}
                                className="rounded-lg p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
                                aria-label="Refresh data"
                                title="Refresh data"
                            >
                                <ArrowPathIcon className={cx("h-5 w-5", refreshing && "animate-spin")} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">
                    <Suspense fallback={<PageSkeleton />}>
                        <DataGate>
                            <Outlet />
                        </DataGate>
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

function GlobalSearch() {
    const { enquiries } = useEnquiryData();
    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const query = useDebouncedValue(value, 200);
    const ref = useRef<HTMLDivElement>(null);

    const results = useMemo(() => (query.trim().length < 2 ? [] : enquiries.filter((e) => matchesSearch(e, query)).slice(0, 6)), [enquiries, query]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const showAll = () => {
        setOpen(false);
        navigate(`/dashboard/enquiries?q=${encodeURIComponent(value.trim())}&range=all`);
    };

    return (
        <div ref={ref} className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
                type="search"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && value.trim()) showAll();
                    if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search name, mobile, email, college…"
                aria-label="Search enquiries"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
            {open && query.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-xl">
                    {results.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-slate-500">No enquiries match “{query}”.</p>
                    ) : (
                        <ul>
                            {results.map((e) => (
                                <li key={e._id}>
                                    <Link
                                        to={`/dashboard/enquiries/${e._id}`}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-violet-50"
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-slate-900">{e.name}</span>
                                            <span className="block truncate text-xs text-slate-500">{e.mobile} · {getCategory(e)}</span>
                                        </span>
                                        <StatusBadge status={getStatus(e)} outcome={e.outcome} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    <button type="button" onClick={showAll} className="block w-full border-t border-violet-100 px-4 py-2.5 text-left text-sm font-medium text-violet-700 hover:bg-violet-50">
                        See all results in Enquiries →
                    </button>
                </div>
            )}
        </div>
    );
}
