import { useMemo } from "react";
import toast from "react-hot-toast";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";
import type { Enquiry } from "../../components/site/types";
import { useFilteredEnquiries } from "../hooks/useDashboardFilters";
import FilterBar from "../components/admin/FilterBar";
import { Button, Card, EmptyState, PageHeader } from "../components/admin/ui";
import { cx } from "../lib/cx";
import {
    addDays, breakdown, buildFunnel, buildTimeSeries, DIMENSIONS, flattenFollowUps, formatDate, formatDateTime, formatDuration,
    formatPercent, getCategory, getOwner, getStatus, inRange, type BreakdownRow, type DimensionKey,
} from "../lib/analytics";
import { downloadCsv, fileStamp, toCsv, type CsvColumn } from "../lib/csv";
import { ENQUIRY_CSV_COLUMNS } from "../lib/enquiryExport";

interface Report {
    id: string;
    title: string;
    description: string;
    rows: unknown[];
    columns: CsvColumn<never>[];
}

const breakdownColumns = (label: string, team = false): CsvColumn<BreakdownRow>[] => [
    { header: label, value: (r) => r.key },
    { header: "Enquiries", value: (r) => r.total },
    { header: "Share", value: (r) => formatPercent(r.share) },
    { header: "Previous period", value: (r) => r.previous ?? "" },
    { header: "Change", value: (r) => (r.change === null ? "" : formatPercent(r.change)) },
    { header: "Contacted", value: (r) => r.contacted },
    { header: "Open", value: (r) => r.open },
    { header: "Converted", value: (r) => r.converted },
    { header: "Lost", value: (r) => r.lost },
    { header: "Conversion rate", value: (r) => formatPercent(r.conversionRate) },
    ...(team
        ? [
            { header: "Median first response", value: (r: BreakdownRow) => formatDuration(r.medianResponseMs) },
            { header: "Pending follow-ups", value: (r: BreakdownRow) => r.pendingFollowUps },
            { header: "Overdue follow-ups", value: (r: BreakdownRow) => r.overdueFollowUps },
        ]
        : []),
];

const REPORT_DIMENSIONS: { id: string; dim: DimensionKey; title: string; description: string; team?: boolean }[] = [
    { id: "source", dim: "source", title: "Source report", description: "Enquiries and conversion by reference source" },
    { id: "category", dim: "category", title: "Enquiry type report", description: "Demand and conversion by enquiry type" },
    { id: "program", dim: "program", title: "Course / domain report", description: "Specific courses, internship domains and job roles" },
    { id: "college", dim: "college", title: "College report", description: "Enquiries and conversion by college" },
    { id: "owner", dim: "owner", title: "Counselor report", description: "Workload, response time and follow-ups per counselor", team: true },
];

export default function ReportsPage() {
    const { current, previous, scoped, range, prevRange, options, filters } = useFilteredEnquiries();
    const selected = filters.params.get("report") || "register";

    const reports = useMemo<Report[]>(() => {
        const list: Report[] = [
            { id: "register", title: "Enquiry register", description: "Every enquiry with all fields", rows: current, columns: ENQUIRY_CSV_COLUMNS as CsvColumn<never>[] },
        ];
        const daily = buildTimeSeries(current, range, "day");
        const dailyCols: CsvColumn<(typeof daily)[number]>[] = [
            { header: "Date", value: (p) => formatDate(new Date(p.key)) },
            { header: "Enquiries", value: (p) => p.current },
            { header: "Of which converted", value: (p) => p.converted },
        ];
        list.push({ id: "daily", title: "Date-wise report", description: "Enquiries received per day", rows: [...daily].reverse(), columns: dailyCols as CsvColumn<never>[] });

        for (const r of REPORT_DIMENSIONS) {
            list.push({ id: r.id, title: r.title, description: r.description, rows: breakdown(current, DIMENSIONS[r.dim].get, previous), columns: breakdownColumns(DIMENSIONS[r.dim].label, r.team) as CsvColumn<never>[] });
        }

        const funnel = buildFunnel(current);
        const funnelCols: CsvColumn<(typeof funnel)[number]>[] = [
            { header: "Stage", value: (f) => f.stage },
            { header: "Enquiries", value: (f) => f.count },
            { header: "% of received", value: (f) => formatPercent(f.ofTotal) },
            { header: "% of previous stage", value: (f) => formatPercent(f.fromPrevious) },
            { header: "Dropped from previous stage", value: (f) => f.dropOff ?? "" },
        ];
        list.push({ id: "conversion", title: "Conversion report", description: "Funnel stages, conversion and drop-off", rows: funnel, columns: funnelCols as CsvColumn<never>[] });

        // Follow-ups due within the selected range (operational, so based on due date).
        const followUps = flattenFollowUps(scoped).filter((i) => inRange(i.due, range));
        const fuCols: CsvColumn<(typeof followUps)[number]>[] = [
            { header: "Due", value: (i) => formatDateTime(i.due) },
            { header: "State", value: (i) => i.state },
            { header: "Name", value: (i) => i.enquiry.name },
            { header: "Mobile", value: (i) => i.enquiry.mobile },
            { header: "Enquiry for", value: (i) => getCategory(i.enquiry) },
            { header: "Counselor", value: (i) => getOwner(i.enquiry) },
            { header: "Status", value: (i) => getStatus(i.enquiry) },
            { header: "Note", value: (i) => i.followUp.note || "" },
            { header: "Completed", value: (i) => (i.followUp.completedAt ? formatDateTime(i.followUp.completedAt) : "") },
            { header: "On time", value: (i) => (i.completedOnTime === null ? "" : i.completedOnTime ? "Yes" : "No") },
            { header: "Result", value: (i) => i.followUp.result || "" },
        ];
        list.push({ id: "followups", title: "Follow-up report", description: "Follow-ups due in the selected period", rows: followUps, columns: fuCols as CsvColumn<never>[] });
        return list;
    }, [current, previous, scoped, range]);

    const report = reports.find((r) => r.id === selected) || reports[0];
    const columns = report.columns as CsvColumn<unknown>[];
    const periodLabel = `${formatDate(range.start)} – ${formatDate(addDays(range.end, -1))}`;

    const exportCsv = () => {
        downloadCsv(`${report.id}-report-${fileStamp()}`, toCsv(report.rows, columns));
        toast.success(`${report.title} exported`);
    };

    return (
        <>
            <PageHeader
                title="Reports"
                description="Filtered, date-wise reports ready to export or print"
                actions={
                    <>
                        <Button icon={PrinterIcon} onClick={() => window.print()} disabled={!report.rows.length}>Print</Button>
                        <Button variant="primary" icon={ArrowDownTrayIcon} onClick={exportCsv} disabled={!report.rows.length}>Export CSV</Button>
                    </>
                }
            />
            <FilterBar options={options} range={range} prevRange={prevRange} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <nav aria-label="Reports" className="min-w-0 print:hidden">
                    <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                        {reports.map((r) => (
                            <li key={r.id} className="shrink-0">
                                <button
                                    type="button"
                                    onClick={() => filters.update({ report: r.id })}
                                    className={cx(
                                        "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                                        r.id === report.id ? "bg-violet-600 text-white shadow-sm" : "bg-white text-slate-700 ring-1 ring-inset ring-violet-100 hover:bg-violet-50",
                                    )}
                                    aria-current={r.id === report.id ? "page" : undefined}
                                >
                                    <span className="block whitespace-nowrap text-sm font-medium">{r.title}</span>
                                    <span className={cx("hidden text-xs lg:block", r.id === report.id ? "text-violet-100" : "text-slate-500")}>{r.description}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Card className="min-w-0 overflow-hidden print:border-0 print:shadow-none">
                    <div className="border-b border-violet-100 px-5 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">{report.title}</h2>
                        <p className="text-sm text-slate-500">
                            {periodLabel} · {report.rows.length} row{report.rows.length === 1 ? "" : "s"}
                            {filters.activeCount > 0 && ` · ${filters.activeCount} filter${filters.activeCount === 1 ? "" : "s"} applied`}
                        </p>
                        <p className="hidden text-xs text-slate-500 print:block">SS Group · Enquiry CRM · generated {formatDateTime(new Date())}</p>
                    </div>
                    {report.rows.length === 0 ? (
                        <EmptyState title="No data for this report" description="Widen the date range or clear filters." />
                    ) : (
                        <div className="max-h-[65vh] overflow-auto print:max-h-none print:overflow-visible">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-[#faf8ff] text-xs text-slate-500 shadow-[0_1px_0_#ede9fe]">
                                    <tr>{columns.map((c) => <th key={c.header} scope="col" className="whitespace-nowrap px-3 py-2.5 text-left font-medium first:pl-5">{c.header}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-violet-50">
                                    {report.rows.map((row, i) => (
                                        <tr key={(row as Enquiry)._id || i} className="align-top text-slate-700">
                                            {columns.map((c) => (
                                                <td key={c.header} className="max-w-[280px] px-3 py-2 tabular-nums first:pl-5">
                                                    <span className="line-clamp-3 print:line-clamp-none">{c.value(row) ?? ""}</span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}
