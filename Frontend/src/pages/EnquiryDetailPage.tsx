import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowLeftIcon, BellAlertIcon, ChatBubbleLeftEllipsisIcon, CheckCircleIcon, CheckIcon, ClockIcon, EnvelopeIcon,
    FlagIcon, PhoneIcon, PlusIcon, TrashIcon, UserCircleIcon, XCircleIcon,
} from "@heroicons/react/24/outline";
import type { Enquiry, EnquiryActivity, EnquiryStatus } from "../../components/site/types";
import { useEnquiryData } from "../context/enquiryData";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import { Button, Card, CardHeader, EmptyState, PageSkeleton, PriorityBadge, Select, StatusBadge, Tabs, Tag } from "../components/admin/ui";
import { cx } from "../lib/cx";
import { enquiryApi, getErrorMessage, type EnquiryUpdate } from "../lib/api";
import {
    addDays, ageInDays, followUpState, formatDateTime, formatDuration, formatRelative, getCategory, getCollege, getOwner,
    getPriority, getProgram, getSource, getSourceDetail, getStatus, normalizeMobile, NOT_SPECIFIED, PRIORITIES, STATUSES,
    startOfDay, toDate, uniqueValues,
} from "../lib/analytics";

type Tab = "followups" | "notes" | "activity";

const toLocalInput = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EnquiryDetailPage() {
    const { id = "" } = useParams();
    const { enquiries, upsert, removeEnquiries } = useEnquiryData();
    const cached = enquiries.find((e) => e._id === id);
    const [fetched, setFetched] = useState<Enquiry | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Not in the cached list (e.g. deep link to an old record): fetch it directly.
    useEffect(() => {
        if (cached) return;
        let cancelled = false;
        enquiryApi.get(id)
            .then((e) => !cancelled && setFetched(e))
            .catch((e) => !cancelled && setLoadError(getErrorMessage(e, "Enquiry not found")));
        return () => {
            cancelled = true;
        };
    }, [id, cached]);

    const enquiry = cached || (fetched?._id === id ? fetched : null);
    if (!enquiry) {
        if (loadError) {
            return (
                <Card className="mx-auto max-w-lg">
                    <EmptyState title="Enquiry not found" description={loadError} action={<Link to="/dashboard/enquiries"><Button>Back to enquiries</Button></Link>} />
                </Card>
            );
        }
        return <PageSkeleton />;
    }

    return <EnquiryDetail key={enquiry._id} enquiry={enquiry} all={enquiries} onChange={upsert} onDeleted={(eid) => removeEnquiries([eid])} />;
}

function EnquiryDetail({ enquiry: e, all, onChange, onDeleted }: { enquiry: Enquiry; all: Enquiry[]; onChange: (e: Enquiry) => void; onDeleted: (id: string) => void }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("followups");
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [now] = useState(() => new Date());
    const status = getStatus(e);

    const run = async (action: () => Promise<Enquiry>, success: string) => {
        setSaving(true);
        try {
            onChange(await action());
            toast.success(success);
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err));
            return false;
        } finally {
            setSaving(false);
        }
    };

    const update = (updates: EnquiryUpdate, success: string) => run(() => enquiryApi.update(e._id, updates), success);

    const remove = async () => {
        setSaving(true);
        try {
            await enquiryApi.remove(e._id);
            onDeleted(e._id);
            toast.success("Enquiry deleted");
            navigate("/dashboard/enquiries", { replace: true });
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to delete enquiry"));
            setSaving(false);
        }
    };

    const history = useMemo(() => {
        const mobile = normalizeMobile(e.mobile);
        return all.filter((x) => x._id !== e._id && mobile && normalizeMobile(x.mobile) === mobile);
    }, [all, e]);

    const owners = useMemo(() => uniqueValues(all, getOwner).filter((o) => o !== "Unassigned"), [all]);
    const pendingFollowUps = (e.followUps || []).filter((f) => !f.completedAt);
    const created = toDate(e.createdAt);
    const firstContact = toDate(e.firstContactedAt);
    const digits = (e.mobile || "").replace(/\D/g, "");
    const waNumber = digits.length === 10 ? `91${digits}` : digits;

    return (
        <>
            <Link to="/dashboard/enquiries" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-violet-700">
                <ArrowLeftIcon className="h-4 w-4" /> Enquiries
            </Link>

            {/* Header */}
            <Card className="mb-4 p-5">
                <div className="flex flex-wrap items-start gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700" aria-hidden>
                        {e.name?.trim()?.[0]?.toUpperCase() || "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{e.name}</h1>
                            <StatusBadge status={status} outcome={e.outcome} />
                            <PriorityBadge priority={getPriority(e)} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            {getCategory(e)}{getProgram(e) !== NOT_SPECIFIED && ` · ${getProgram(e)}`} · received {formatRelative(e.createdAt, now)}
                            <span className="ml-2 font-mono text-xs text-slate-400">#{e._id.slice(-6)}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a href={`tel:${e.mobile}`}><Button icon={PhoneIcon}>Call</Button></a>
                        {waNumber && <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer"><Button icon={ChatBubbleLeftEllipsisIcon}>WhatsApp</Button></a>}
                        {e.email && <a href={`mailto:${e.email}`}><Button icon={EnvelopeIcon}>Email</Button></a>}
                        <Button variant="ghost" icon={TrashIcon} onClick={() => setConfirmDelete(true)} aria-label="Delete enquiry" className="hover:bg-rose-50 hover:text-rose-700" />
                    </div>
                </div>

                {/* Pipeline */}
                <div className="mt-5 border-t border-violet-100 pt-4">
                    <p className="mb-2 text-xs font-medium text-slate-500">Pipeline stage</p>
                    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {STATUSES.map((s, i) => {
                            const reached = STATUSES.indexOf(status) >= i;
                            const isCurrent = status === s;
                            return (
                                <li key={s}>
                                    <button
                                        type="button"
                                        disabled={saving || isCurrent}
                                        onClick={() => update({ status: s as EnquiryStatus }, `Status set to ${s}`)}
                                        className={cx(
                                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium ring-1 ring-inset transition-colors disabled:cursor-default",
                                            isCurrent ? "bg-violet-600 text-white ring-violet-600" : reached ? "bg-violet-50 text-violet-800 ring-violet-200 hover:bg-violet-100" : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50",
                                        )}
                                        aria-current={isCurrent ? "step" : undefined}
                                    >
                                        <span className={cx("grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px]", isCurrent ? "bg-white/25" : reached ? "bg-violet-200" : "bg-slate-100")}>
                                            {reached && !isCurrent ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                                        </span>
                                        {s}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                    {status === "Closed" ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-slate-600">Outcome:</span>
                            <Button size="sm" disabled={saving} onClick={() => update({ outcome: "Converted" }, "Marked as converted")}
                                className={cx(e.outcome === "Converted" && "!bg-emerald-600 !text-white !ring-emerald-600")} icon={CheckCircleIcon}>Converted</Button>
                            <Button size="sm" disabled={saving} onClick={() => update({ outcome: "Not Converted" }, "Marked as not converted")}
                                className={cx(e.outcome === "Not Converted" && "!bg-rose-600 !text-white !ring-rose-600")} icon={XCircleIcon}>Not converted</Button>
                            {!e.outcome && <span className="text-xs text-amber-700">Record an outcome so conversion analytics stay accurate.</span>}
                        </div>
                    ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" disabled={saving} icon={CheckCircleIcon} onClick={() => update({ outcome: "Converted" }, "Closed as converted")}>Close as converted</Button>
                            <Button size="sm" disabled={saving} icon={XCircleIcon} onClick={() => update({ outcome: "Not Converted" }, "Closed as not converted")}>Close as lost</Button>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {/* Details */}
                    <Card>
                        <CardHeader title="Enquiry details" />
                        <div className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2">
                            <Section title="Contact">
                                <Field label="Mobile" value={<a href={`tel:${e.mobile}`} className="text-violet-700 hover:underline">{e.mobile}</a>} />
                                <Field label="Email" value={e.email ? <a href={`mailto:${e.email}`} className="break-all text-violet-700 hover:underline">{e.email}</a> : "—"} />
                                <Field label="College" value={getCollege(e)} />
                            </Section>
                            <Section title="Requirement">
                                <Field label="Enquiry for" value={<Tag>{getCategory(e)}</Tag>} />
                                {e.courseName && <Field label="Course" value={e.courseName} />}
                                {e.internshipDomain && <Field label="Internship domain" value={e.internshipDomain} />}
                                {e.internshipDuration && <Field label="Duration" value={e.internshipDuration} />}
                                {e.jobType && <Field label="Job type" value={e.jobType} />}
                                {e.jobCategory && <Field label="Job role" value={e.jobCategory} />}
                                {e.experience && <Field label="Experience" value={e.experience} />}
                            </Section>
                            <Section title="Source">
                                <Field label="Heard via" value={getSource(e)} />
                                {getSourceDetail(e) && <Field label={e.reference === "Newspaper" ? "Newspaper" : e.reference === "Other" ? "Details" : "Referred by"} value={getSourceDetail(e)} />}
                            </Section>
                            <Section title="Ownership">
                                <Field label="Asked to meet" value={e.whomToMeet || "—"} />
                                <AssignField current={e.assignedTo || ""} owners={owners} disabled={saving}
                                    onSave={(v) => update({ assignedTo: v }, v ? `Assigned to ${v}` : "Assignment removed")} />
                                <div className="flex items-center justify-between gap-3 py-1 text-sm">
                                    <span className="text-slate-500">Priority</span>
                                    <Select value={getPriority(e)} disabled={saving} onChange={(ev) => update({ priority: ev.target.value as Enquiry["priority"] }, `Priority set to ${ev.target.value}`)} className="w-32 py-1.5" aria-label="Priority">
                                        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </Select>
                                </div>
                            </Section>
                        </div>
                    </Card>

                    {/* Work area */}
                    <Card>
                        <div className="p-3">
                            <Tabs<Tab>
                                value={tab}
                                onChange={setTab}
                                tabs={[
                                    { value: "followups", label: "Follow-ups", count: pendingFollowUps.length },
                                    { value: "notes", label: "Notes", count: (e.notes || []).length },
                                    { value: "activity", label: "Activity" },
                                ]}
                            />
                        </div>
                        <div className="px-5 pb-5">
                            {tab === "followups" && <FollowUps enquiry={e} now={now} saving={saving} run={run} />}
                            {tab === "notes" && <Notes enquiry={e} saving={saving} run={run} />}
                            {tab === "activity" && <Timeline enquiry={e} />}
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader title="Key dates" />
                        <dl className="space-y-0.5 p-5 pt-3">
                            <Field label="Received" value={formatDateTime(e.createdAt)} />
                            <Field label="Age" value={`${Math.floor(ageInDays(e, now))} days`} />
                            <Field label="First contacted" value={firstContact ? formatDateTime(firstContact) : "Not yet"} />
                            {firstContact && created && <Field label="Response time" value={formatDuration(firstContact.getTime() - created.getTime())} />}
                            {e.closedAt && <Field label="Closed" value={formatDateTime(e.closedAt)} />}
                            {e.closedAt && created && e.outcome === "Converted" && <Field label="Time to convert" value={formatDuration(toDate(e.closedAt)!.getTime() - created.getTime())} />}
                            {e.updatedAt && <Field label="Last updated" value={formatRelative(e.updatedAt, now)} />}
                        </dl>
                    </Card>
                    <Card>
                        <CardHeader title="Contact history" subtitle="Other enquiries from this mobile number" />
                        {history.length ? (
                            <ul className="mt-3 divide-y divide-violet-50 border-t border-violet-100">
                                {history.map((h) => (
                                    <li key={h._id}>
                                        <Link to={`/dashboard/enquiries/${h._id}`} className="flex items-center justify-between gap-2 px-5 py-2.5 hover:bg-violet-50/50">
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium text-slate-800">{getCategory(h)}</span>
                                                <span className="text-xs text-slate-500">{formatDateTime(h.createdAt)}</span>
                                            </span>
                                            <StatusBadge status={getStatus(h)} outcome={h.outcome} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-5 pb-5 pt-3 text-sm text-slate-500">This is their only enquiry.</p>
                        )}
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                open={confirmDelete}
                busy={saving}
                title="Delete this enquiry?"
                message={<>The enquiry from <strong>{e.name}</strong> and all its notes and follow-ups will be permanently deleted.</>}
                confirmLabel="Delete"
                onConfirm={remove}
                onCancel={() => setConfirmDelete(false)}
            />
        </>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-violet-600">{title}</h3>
            <dl className="space-y-0.5">{children}</dl>
        </div>
    );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-1 text-sm">
            <dt className="shrink-0 text-slate-500">{label}</dt>
            <dd className="min-w-0 text-right font-medium text-slate-800">{value}</dd>
        </div>
    );
}

function AssignField({ current, owners, disabled, onSave }: { current: string; owners: string[]; disabled: boolean; onSave: (v: string) => void }) {
    const [value, setValue] = useState(current);
    const [synced, setSynced] = useState(current);
    if (synced !== current) {
        setSynced(current);
        setValue(current);
    }
    const dirty = value.trim() !== current;
    return (
        <form
            className="flex items-center justify-between gap-3 py-1 text-sm"
            onSubmit={(ev) => {
                ev.preventDefault();
                if (dirty) onSave(value.trim());
            }}
        >
            <label htmlFor="assign" className="shrink-0 text-slate-500">Assigned to</label>
            <div className="flex min-w-0 gap-1.5">
                <input id="assign" list="owner-options" value={value} onChange={(ev) => setValue(ev.target.value)} placeholder="Unassigned"
                    className="w-40 min-w-0 rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                <datalist id="owner-options">{owners.map((o) => <option key={o} value={o} />)}</datalist>
                {dirty && <Button type="submit" size="sm" variant="primary" disabled={disabled}>Save</Button>}
            </div>
        </form>
    );
}

type Runner = (action: () => Promise<Enquiry>, success: string) => Promise<boolean>;

function FollowUps({ enquiry: e, now, saving, run }: { enquiry: Enquiry; now: Date; saving: boolean; run: Runner }) {
    const [dueAt, setDueAt] = useState(() => {
        const d = addDays(startOfDay(now), 1);
        d.setHours(10);
        return toLocalInput(d);
    });
    const [note, setNote] = useState("");
    const [completing, setCompleting] = useState<string | null>(null);
    const [result, setResult] = useState("");

    const items = [...(e.followUps || [])].sort((a, b) => {
        if (!!a.completedAt !== !!b.completedAt) return a.completedAt ? 1 : -1;
        return a.completedAt ? b.dueAt.localeCompare(a.dueAt) : a.dueAt.localeCompare(b.dueAt);
    });

    const schedule = async (ev: FormEvent) => {
        ev.preventDefault();
        const d = new Date(dueAt);
        if (isNaN(d.getTime())) return toast.error("Pick a valid date and time");
        if (await run(() => enquiryApi.addFollowUp(e._id, d.toISOString(), note.trim()), "Follow-up scheduled")) setNote("");
    };

    const STATE_STYLES = {
        overdue: { label: "Overdue", cls: "bg-rose-50 text-rose-700 ring-rose-200", icon: BellAlertIcon },
        today: { label: "Today", cls: "bg-amber-50 text-amber-800 ring-amber-200", icon: ClockIcon },
        upcoming: { label: "Upcoming", cls: "bg-sky-50 text-sky-700 ring-sky-200", icon: ClockIcon },
        completed: { label: "Done", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircleIcon },
    };

    return (
        <div className="space-y-4">
            <form onSubmit={schedule} className="grid gap-2 rounded-xl bg-violet-50/60 p-3 sm:grid-cols-[auto_1fr_auto]">
                <input type="datetime-local" value={dueAt} onChange={(ev) => setDueAt(ev.target.value)} required aria-label="Follow-up date and time"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                <input value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="What's the follow-up about? (optional)" aria-label="Follow-up note"
                    className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                <Button type="submit" variant="primary" icon={PlusIcon} disabled={saving}>Schedule</Button>
            </form>

            {items.length === 0 ? (
                <EmptyState compact icon={ClockIcon} title="No follow-ups yet" description="Schedule one so this enquiry shows up in the follow-up queue." />
            ) : (
                <ul className="space-y-2">
                    {items.map((f) => {
                        const state = followUpState(f, now);
                        const st = STATE_STYLES[state];
                        return (
                            <li key={f._id} className="rounded-xl border border-violet-100 p-3">
                                <div className="flex flex-wrap items-start gap-3">
                                    <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", st.cls)}>
                                        <st.icon className="h-3.5 w-3.5" aria-hidden />{st.label}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-900">{formatDateTime(f.dueAt)} <span className="font-normal text-slate-500">· {formatRelative(f.dueAt, now)}</span></p>
                                        {f.note && <p className="mt-0.5 text-sm text-slate-600">{f.note}</p>}
                                        {f.completedAt && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                Completed {formatDateTime(f.completedAt)}{f.result && <> — <span className="text-slate-700">{f.result}</span></>}
                                            </p>
                                        )}
                                    </div>
                                    {!f.completedAt && (
                                        <div className="flex gap-1">
                                            <Button size="sm" icon={CheckIcon} disabled={saving} onClick={() => { setCompleting(f._id); setResult(""); }}>Complete</Button>
                                            <Button size="sm" variant="ghost" icon={TrashIcon} disabled={saving} aria-label="Delete follow-up"
                                                onClick={() => run(() => enquiryApi.deleteFollowUp(e._id, f._id), "Follow-up removed")} />
                                        </div>
                                    )}
                                </div>
                                {completing === f._id && (
                                    <form
                                        className="mt-3 flex flex-col gap-2 sm:flex-row"
                                        onSubmit={async (ev) => {
                                            ev.preventDefault();
                                            if (await run(() => enquiryApi.completeFollowUp(e._id, f._id, result.trim()), "Follow-up completed")) setCompleting(null);
                                        }}
                                    >
                                        <input autoFocus value={result} onChange={(ev) => setResult(ev.target.value)} placeholder="Result, e.g. “Interested, will visit Monday”" aria-label="Follow-up result"
                                            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                                        <div className="flex gap-2">
                                            <Button type="submit" variant="primary" disabled={saving}>Mark done</Button>
                                            <Button onClick={() => setCompleting(null)}>Cancel</Button>
                                        </div>
                                    </form>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

function Notes({ enquiry: e, saving, run }: { enquiry: Enquiry; saving: boolean; run: Runner }) {
    const [text, setText] = useState("");
    const notes = [...(e.notes || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return (
        <div className="space-y-4">
            <form
                onSubmit={async (ev) => {
                    ev.preventDefault();
                    if (text.trim() && (await run(() => enquiryApi.addNote(e._id, text.trim()), "Note added"))) setText("");
                }}
                className="space-y-2"
            >
                <textarea value={text} onChange={(ev) => setText(ev.target.value)} rows={3} placeholder="Add a note about a call, a visit, fees discussed…" aria-label="New note"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200" />
                <div className="flex justify-end"><Button type="submit" variant="primary" disabled={saving || !text.trim()}>Add note</Button></div>
            </form>
            {notes.length === 0 ? (
                <EmptyState compact icon={ChatBubbleLeftEllipsisIcon} title="No notes yet" />
            ) : (
                <ul className="space-y-2">
                    {notes.map((n) => (
                        <li key={n._id} className="rounded-xl bg-violet-50/50 p-3">
                            <p className="whitespace-pre-wrap text-sm text-slate-800">{n.text}</p>
                            <p className="mt-1 text-xs text-slate-500">{n.author || "Admin"} · {formatDateTime(n.createdAt)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const ACTIVITY_ICONS: Record<EnquiryActivity["type"] | "created", typeof FlagIcon> = {
    created: PlusIcon,
    status: FlagIcon,
    priority: FlagIcon,
    assigned: UserCircleIcon,
    outcome: CheckCircleIcon,
    note: ChatBubbleLeftEllipsisIcon,
    followup_scheduled: ClockIcon,
    followup_completed: CheckIcon,
};

function Timeline({ enquiry: e }: { enquiry: Enquiry }) {
    const events = [
        ...(e.activity || []).map((a) => ({
            id: a._id,
            type: a.type,
            at: a.at,
            message: a.type === "followup_scheduled" && a.to ? `Follow-up scheduled for ${formatDateTime(a.to)}` : a.message,
        })),
        { id: "created", type: "created" as const, at: e.createdAt, message: `Enquiry received${e.reference ? ` via ${getSource(e)}` : ""}` },
    ].sort((a, b) => b.at.localeCompare(a.at));

    return (
        <ol className="relative ml-3 border-l border-violet-100">
            {events.map((ev) => {
                const IconCmp = ACTIVITY_ICONS[ev.type] || FlagIcon;
                return (
                    <li key={ev.id} className="mb-4 ml-5 last:mb-0">
                        <span className="absolute -left-3 grid h-6 w-6 place-items-center rounded-full bg-white text-violet-600 ring-2 ring-violet-100">
                            <IconCmp className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <p className="text-sm text-slate-800">{ev.message}</p>
                        <time className="text-xs text-slate-500">{formatDateTime(ev.at)}</time>
                    </li>
                );
            })}
            {events.length === 1 && (
                <li className="ml-5 text-xs text-slate-500">Status changes, assignments, notes and follow-ups will appear here.</li>
            )}
        </ol>
    );
}
