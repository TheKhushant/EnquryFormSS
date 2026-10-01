import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/site/Layout";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, CheckIcon, ExclamationTriangleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../lib/api";
import { cx } from "../lib/cx";
import { captureAttribution } from "../lib/tracking";
import {
    buildPayload, countryFor, EMPTY_FORM, nationalDigits, STEP_FIELDS, STEPS, validateStep,
    type EnquiryFormState, type FieldErrors,
} from "../lib/enquiryForm";
import {
    COLLEGES, CONTACT_METHODS, CONTACT_TIMES, COURSES, ENQUIRY_TYPES, INTERNSHIP_DOMAINS, INTERNSHIP_DURATIONS, JOB_ROLES,
    NEWSPAPERS, OVERSEAS_COUNTRIES, PEOPLE_TO_MEET, QUALIFICATIONS, REFERENCES,
} from "../data/enquiryOptions";
import { Checkbox, ChoiceGroup, CollegeCombobox, Field, PhoneInput, SelectInput, TextArea, TextInput } from "../components/enquiry-form/FormControls";

type FormKey = keyof EnquiryFormState;

interface SubmitResult {
    reference?: string;
    repeat: boolean;
    name: string;
    contactMethod: string;
}

export default function EnquiryForm() {
    const [form, setForm] = useState<EnquiryFormState>(EMPTY_FORM);
    const [step, setStep] = useState(0);
    const [attempted, setAttempted] = useState([false, false, false]);
    const [touched, setTouched] = useState<Set<FormKey>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slowServer, setSlowServer] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [result, setResult] = useState<SubmitResult | null>(null);
    const [startedAt, setStartedAt] = useState(() => Date.now());
    const [tracking] = useState(captureAttribution);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const firstRender = useRef(true);

    const set = <K extends FormKey>(key: K, value: EnquiryFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setSubmitError(null);
    };
    const touch = (key: FormKey) => setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));

    // Errors show for fields the user has left, or for the whole step after "Continue".
    const errors = useMemo<FieldErrors>(() => {
        const all = validateStep(step, form);
        if (attempted[step]) return all;
        return Object.fromEntries(Object.entries(all).filter(([k]) => touched.has(k as FormKey))) as FieldErrors;
    }, [form, step, attempted, touched]);

    // Move focus to the step heading on step change so screen readers announce it.
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        headingRef.current?.focus({ preventScroll: true });
        headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step, result]);

    const focusFirstError = (errs: FieldErrors, stepIndex: number) => {
        const first = STEP_FIELDS[stepIndex].find((f) => errs[f]);
        if (!first) return;
        requestAnimationFrame(() => {
            const el = document.getElementById(first);
            const target = el?.matches("fieldset") ? el.querySelector<HTMLElement>("input") : el;
            target?.focus({ preventScroll: true });
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    };

    const goNext = () => {
        const errs = validateStep(step, form);
        setAttempted((a) => a.map((v, i) => (i === step ? true : v)));
        if (Object.keys(errs).length) return focusFirstError(errs, step);
        setStep((s) => s + 1);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (step < STEPS.length - 1) return goNext();
        if (isSubmitting) return;

        // Re-validate every step; jump back to the first one with a problem.
        for (let i = 0; i < STEPS.length; i++) {
            const errs = validateStep(i, form);
            if (Object.keys(errs).length) {
                setAttempted((a) => a.map((v, j) => (j <= i ? true : v)));
                setStep(i);
                return focusFirstError(errs, i);
            }
        }

        setIsSubmitting(true);
        setSubmitError(null);
        // Free hosting can take a while to wake up: say so rather than look frozen.
        const slowTimer = setTimeout(() => setSlowServer(true), 6000);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/enquiries`, buildPayload(form, tracking, Date.now() - startedAt), { timeout: 70000 });
            setResult({
                reference: response.data?.data?.reference,
                repeat: !!response.data?.repeat,
                name: form.name.trim().split(/\s+/)[0],
                contactMethod: form.contactMethod,
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.message) setSubmitError(err.response.data.message);
                else if (err.code === "ECONNABORTED") setSubmitError("The server is taking too long to respond. Please try again.");
                else setSubmitError("We couldn't reach our server. Check your internet connection and try again.");
            } else {
                setSubmitError("Something went wrong. Please try again.");
            }
        } finally {
            clearTimeout(slowTimer);
            setSlowServer(false);
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setStep(0);
        setAttempted([false, false, false]);
        setTouched(new Set());
        setResult(null);
        setSubmitError(null);
        setStartedAt(Date.now());
    };

    const bind = (key: FormKey) => ({
        id: key,
        value: form[key] as string,
        error: errors[key],
        onBlur: () => touch(key),
    });

    return (
        <Layout>
            <div className="min-h-screen bg-[#f3efff] px-4 py-8 sm:py-12">
                <div className="mx-auto max-w-2xl">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <SuccessScreen key="success" result={result} onReset={resetForm} headingRef={headingRef} />
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="mb-6 text-center">
                                    <h1 className="text-3xl font-bold tracking-tight text-violet-950 sm:text-4xl">Enquiry Form</h1>
                                    <p className="mt-2 text-violet-700">Takes about 2 minutes · fields marked <span className="text-rose-500">*</span> are required</p>
                                </div>

                                <Stepper step={step} onStepClick={(i) => i < step && setStep(i)} />

                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="relative rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_10px_40px_-12px_rgba(109,40,217,0.25)] sm:p-8"
                                >
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Step {step + 1} of {STEPS.length}</p>
                                        <h2 ref={headingRef} tabIndex={-1} className="mt-1 scroll-mt-24 text-xl font-semibold text-slate-900 focus:outline-none">{STEPS[step].title}</h2>
                                        <p className="text-sm text-slate-500">{STEPS[step].description}</p>
                                    </div>

                                    {/* Honeypot: invisible to people and assistive tech; naive bots fill it in. */}
                                    <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
                                        <label htmlFor="website">Website</label>
                                        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
                                    </div>

                                    <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="space-y-5">
                                        {step === 0 && (
                                            <>
                                                <Field id="name" label="Full name" required error={errors.name}>
                                                    <TextInput {...bind("name")} onChange={(e) => set("name", e.target.value)} autoComplete="name" placeholder="e.g. Priya Sharma" maxLength={80} />
                                                </Field>
                                                <div className="grid gap-5 sm:grid-cols-2">
                                                    <Field id="mobile" label="Mobile number" required error={errors.mobile} hint="We'll call or WhatsApp you on this number">
                                                        <PhoneInput
                                                            id="mobile"
                                                            countryCode={form.countryCode}
                                                            onCountryCode={(c) => set("countryCode", c)}
                                                            value={form.mobile}
                                                            onChange={(v) => set("mobile", v)}
                                                            onBlur={() => touch("mobile")}
                                                            error={errors.mobile}
                                                            hint="We'll call or WhatsApp you on this number"
                                                        />
                                                    </Field>
                                                    <Field id="email" label="Email" required error={errors.email}>
                                                        <TextInput {...bind("email")} onChange={(e) => set("email", e.target.value)} type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" maxLength={120} />
                                                    </Field>
                                                </div>
                                                <Field id="college" label="College / University" required error={errors.college} hint="Start typing to search. Not listed? Just type the full name.">
                                                    <CollegeCombobox
                                                        id="college"
                                                        options={COLLEGES}
                                                        value={form.college}
                                                        onChange={(v) => set("college", v)}
                                                        onBlur={() => touch("college")}
                                                        error={errors.college}
                                                        hint="Start typing to search. Not listed? Just type the full name."
                                                    />
                                                </Field>
                                                <div className="grid gap-5 sm:grid-cols-2">
                                                    <Field id="qualification" label="Highest / current qualification" optional>
                                                        <SelectInput {...bind("qualification")} onChange={(e) => set("qualification", e.target.value)}>
                                                            <option value="">Select qualification</option>
                                                            {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                                                        </SelectInput>
                                                    </Field>
                                                    <Field id="passingYear" label="Passing year" optional error={errors.passingYear} hint="Completed or expected">
                                                        <TextInput {...bind("passingYear")} onChange={(e) => set("passingYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                            inputMode="numeric" placeholder={String(new Date().getFullYear())} hint="Completed or expected" />
                                                    </Field>
                                                </div>
                                            </>
                                        )}

                                        {step === 1 && (
                                            <>
                                                <ChoiceGroup
                                                    name="enquiryFor"
                                                    legend="What is your enquiry about?"
                                                    required
                                                    choices={ENQUIRY_TYPES}
                                                    value={form.enquiryFor}
                                                    onChange={(v) => set("enquiryFor", v)}
                                                    error={errors.enquiryFor}
                                                    columns="grid-cols-2 sm:grid-cols-3"
                                                />

                                                {form.enquiryFor === "Internship" && (
                                                    <DetailPanel title="Internship details">
                                                        <Field id="internshipDomain" label="Domain" required error={errors.internshipDomain}>
                                                            <SelectInput {...bind("internshipDomain")} onChange={(e) => set("internshipDomain", e.target.value)}>
                                                                <option value="">Select domain</option>
                                                                {INTERNSHIP_DOMAINS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                                                            </SelectInput>
                                                        </Field>
                                                        <ChoiceGroup name="internshipDuration" legend="Preferred duration" optional size="sm" columns="grid-cols-3"
                                                            choices={INTERNSHIP_DURATIONS.map((d) => ({ value: d }))} value={form.internshipDuration} onChange={(v) => set("internshipDuration", v)} />
                                                    </DetailPanel>
                                                )}

                                                {form.enquiryFor === "Course" && (
                                                    <DetailPanel title="Course details">
                                                        <ChoiceGroup name="courseName" legend="Which course?" required columns="grid-cols-1 sm:grid-cols-2"
                                                            choices={COURSES} value={form.courseName} onChange={(v) => set("courseName", v)} error={errors.courseName} />
                                                    </DetailPanel>
                                                )}

                                                {form.enquiryFor === "Job" && (
                                                    <DetailPanel title="Job details">
                                                        <ChoiceGroup name="jobType" legend="Job type" required columns="grid-cols-2" size="sm"
                                                            choices={[{ value: "Tech" }, { value: "Non-Tech" }]} value={form.jobType} error={errors.jobType}
                                                            onChange={(v) => setForm((p) => ({ ...p, jobType: v, jobCategory: "" }))} />
                                                        {form.jobType && (
                                                            <Field id="jobCategory" label="Job role" optional>
                                                                <SelectInput {...bind("jobCategory")} onChange={(e) => set("jobCategory", e.target.value)}>
                                                                    <option value="">Select role</option>
                                                                    {JOB_ROLES[form.jobType].map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                                                </SelectInput>
                                                            </Field>
                                                        )}
                                                        <ChoiceGroup name="experience" legend="Experience" optional columns="grid-cols-2" size="sm"
                                                            choices={[{ value: "Fresher" }, { value: "Experienced" }]} value={form.experience} onChange={(v) => set("experience", v)} />
                                                    </DetailPanel>
                                                )}

                                                {form.enquiryFor === "Overseas" && (
                                                    <DetailPanel title="Overseas details">
                                                        <ChoiceGroup name="preferredCountry" legend="Which country are you planning for?" required columns="grid-cols-2 sm:grid-cols-3" size="sm"
                                                            choices={OVERSEAS_COUNTRIES.map((c) => ({ value: c }))} value={form.preferredCountry} onChange={(v) => set("preferredCountry", v)} error={errors.preferredCountry} />
                                                        {form.preferredCountry === "Other" && (
                                                            <Field id="preferredCountryOther" label="Country" required error={errors.preferredCountryOther}>
                                                                <TextInput {...bind("preferredCountryOther")} onChange={(e) => set("preferredCountryOther", e.target.value)} maxLength={60} placeholder="e.g. Canada" autoComplete="country-name" />
                                                            </Field>
                                                        )}
                                                    </DetailPanel>
                                                )}

                                                <Field
                                                    id="message"
                                                    label={form.enquiryFor === "Other" ? "Describe your enquiry" : "Anything else we should know?"}
                                                    required={form.enquiryFor === "Other"}
                                                    optional={form.enquiryFor !== "Other"}
                                                    error={errors.message}
                                                    hint={`${form.message.length}/1000`}
                                                >
                                                    <TextArea {...bind("message")} onChange={(e) => set("message", e.target.value.slice(0, 1000))} rows={4}
                                                        hint={`${form.message.length}/1000`} placeholder="e.g. preferred batch timing, questions about fees or eligibility…" />
                                                </Field>
                                            </>
                                        )}

                                        {step === 2 && (
                                            <>
                                                <ChoiceGroup
                                                    name="reference"
                                                    legend="How did you hear about us?"
                                                    required
                                                    size="sm"
                                                    columns="grid-cols-2 sm:grid-cols-3"
                                                    choices={REFERENCES.map((r) => ({ value: r }))}
                                                    value={form.reference}
                                                    onChange={(v) => setForm((p) => ({ ...p, reference: v, referenceName: "", referenceOther: "", referenceNewspaperOther: "" }))}
                                                    error={errors.reference}
                                                />
                                                {(form.reference === "Friends" || form.reference === "Teacher") && (
                                                    <Field id="referenceName" label={form.reference === "Friends" ? "Friend's name" : "Teacher's name"} required error={errors.referenceName}>
                                                        <TextInput {...bind("referenceName")} onChange={(e) => set("referenceName", e.target.value)} maxLength={80} />
                                                    </Field>
                                                )}
                                                {form.reference === "Newspaper" && (
                                                    <div className="grid gap-5 sm:grid-cols-2">
                                                        <Field id="referenceName" label="Newspaper" required error={errors.referenceName}>
                                                            <SelectInput {...bind("referenceName")} onChange={(e) => set("referenceName", e.target.value)}>
                                                                <option value="">Select newspaper</option>
                                                                {NEWSPAPERS.map((g) => (
                                                                    <optgroup key={g.group} label={g.group}>
                                                                        {g.options.map((n) => <option key={n} value={n}>{n}</option>)}
                                                                    </optgroup>
                                                                ))}
                                                                <option value="Other">Other newspaper</option>
                                                            </SelectInput>
                                                        </Field>
                                                        {form.referenceName === "Other" && (
                                                            <Field id="referenceNewspaperOther" label="Newspaper name" required error={errors.referenceNewspaperOther}>
                                                                <TextInput {...bind("referenceNewspaperOther")} onChange={(e) => set("referenceNewspaperOther", e.target.value)} maxLength={80} />
                                                            </Field>
                                                        )}
                                                    </div>
                                                )}
                                                {form.reference === "Other" && (
                                                    <Field id="referenceOther" label="Where did you hear about us?" required error={errors.referenceOther}>
                                                        <TextInput {...bind("referenceOther")} onChange={(e) => set("referenceOther", e.target.value)} maxLength={120} placeholder="e.g. college notice board" />
                                                    </Field>
                                                )}

                                                <ChoiceGroup
                                                    name="whomToMeet"
                                                    legend="Whom would you like to meet?"
                                                    optional
                                                    size="sm"
                                                    columns="grid-cols-1 sm:grid-cols-2"
                                                    choices={PEOPLE_TO_MEET.map((p) => ({ value: p }))}
                                                    value={form.whomToMeet}
                                                    onChange={(v) => set("whomToMeet", v)}
                                                />
                                                {form.whomToMeet === "Other" && (
                                                    <Field id="otherName" label="Person's name" optional>
                                                        <TextInput {...bind("otherName")} onChange={(e) => set("otherName", e.target.value)} maxLength={80} />
                                                    </Field>
                                                )}

                                                <div className="grid gap-5 sm:grid-cols-2">
                                                    <ChoiceGroup name="contactMethod" legend="Preferred way to contact you" optional size="sm" columns="grid-cols-1"
                                                        choices={CONTACT_METHODS} value={form.contactMethod} onChange={(v) => set("contactMethod", v)} />
                                                    <ChoiceGroup name="contactTime" legend="Best time to reach you" optional size="sm" columns="grid-cols-2"
                                                        choices={CONTACT_TIMES} value={form.contactTime} onChange={(v) => set("contactTime", v)} />
                                                </div>

                                                <Review form={form} onEdit={setStep} />

                                                <Checkbox id="consent" checked={form.consent} onChange={(v) => set("consent", v)} error={errors.consent}>
                                                    I agree to be contacted by SS Group about this enquiry by phone, WhatsApp or email. <span className="text-rose-500" aria-hidden>*</span>
                                                </Checkbox>
                                            </>
                                        )}
                                    </motion.div>

                                    {submitError && (
                                        <div role="alert" className="mt-6 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                                            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                                            <div>
                                                <p className="font-medium">Your enquiry was not submitted.</p>
                                                <p>{submitError} Your answers are still here.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-violet-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                        {step > 0 ? (
                                            <button type="button" onClick={() => setStep((s) => s - 1)} disabled={isSubmitting}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:opacity-50">
                                                <ArrowLeftIcon className="h-4 w-4" aria-hidden /> Back
                                            </button>
                                        ) : <span className="hidden sm:block" />}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            aria-busy={isSubmitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-80 sm:min-w-[200px]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                                                    Submitting…
                                                </>
                                            ) : step < STEPS.length - 1 ? (
                                                <>Continue <ArrowRightIcon className="h-4 w-4" aria-hidden /></>
                                            ) : (
                                                "Submit enquiry"
                                            )}
                                        </button>
                                    </div>
                                    {slowServer && <p className="mt-3 text-center text-sm text-slate-500" aria-live="polite">Still working — the first submission can take up to a minute while our server wakes up.</p>}
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
}

// ==================== PIECES ====================

function Stepper({ step, onStepClick }: { step: number; onStepClick: (i: number) => void }) {
    return (
        <nav aria-label="Form progress" className="mb-5">
            <ol className="flex items-center gap-2">
                {STEPS.map((s, i) => {
                    const done = i < step;
                    const current = i === step;
                    return (
                        <li key={s.title} className={cx("flex items-center gap-2", i < STEPS.length - 1 && "flex-1")}>
                            <button
                                type="button"
                                onClick={() => onStepClick(i)}
                                disabled={!done}
                                aria-current={current ? "step" : undefined}
                                aria-label={`Step ${i + 1}: ${s.title}${done ? " (completed, go back)" : current ? " (current)" : ""}`}
                                className="flex shrink-0 items-center gap-2 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-default"
                            >
                                <span className={cx(
                                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors",
                                    done ? "bg-violet-600 text-white" : current ? "bg-white text-violet-700 ring-2 ring-violet-600" : "bg-white text-slate-400 ring-1 ring-violet-200",
                                )}>
                                    {done ? <CheckIcon className="h-4 w-4" aria-hidden /> : i + 1}
                                </span>
                                <span className={cx("hidden whitespace-nowrap text-sm font-medium sm:inline", current ? "text-violet-900" : done ? "text-violet-700" : "text-slate-400")}>{s.title}</span>
                            </button>
                            {i < STEPS.length - 1 && <span className={cx("h-0.5 flex-1 rounded-full", done ? "bg-violet-500" : "bg-violet-200")} aria-hidden />}
                        </li>
                    );
                })}
            </ol>
            <p className="mt-2 text-center text-sm font-medium text-violet-800 sm:hidden">{STEPS[step].title}</p>
        </nav>
    );
}

function DetailPanel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
            <p className="text-sm font-semibold text-violet-900">{title}</p>
            {children}
        </motion.div>
    );
}

function Review({ form, onEdit }: { form: EnquiryFormState; onEdit: (step: number) => void }) {
    const country = countryFor(form.countryCode);
    const detail =
        form.enquiryFor === "Internship" ? [INTERNSHIP_DOMAINS.find((d) => d.value === form.internshipDomain)?.label, form.internshipDuration].filter(Boolean).join(" · ")
            : form.enquiryFor === "Course" ? COURSES.find((c) => c.value === form.courseName)?.label
                : form.enquiryFor === "Job" ? [form.jobType, form.jobCategory, form.experience].filter(Boolean).join(" · ")
                    : form.enquiryFor === "Overseas" ? (form.preferredCountry === "Other" ? form.preferredCountryOther : form.preferredCountry)
                        : "";
    const rows: { label: string; value: string; step: number }[] = [
        { label: "Name", value: form.name.trim(), step: 0 },
        { label: "Mobile", value: `+${country?.code} ${nationalDigits(form.mobile, form.countryCode)}`, step: 0 },
        { label: "Email", value: form.email.trim(), step: 0 },
        { label: "College", value: form.college.trim(), step: 0 },
        { label: "Enquiry", value: [form.enquiryFor, detail].filter(Boolean).join(" — "), step: 1 },
    ];
    return (
        <section aria-labelledby="review-heading" className="rounded-2xl border border-violet-100 bg-slate-50/60 p-4">
            <h3 id="review-heading" className="mb-2 text-sm font-semibold text-slate-900">Review your details</h3>
            <dl className="divide-y divide-violet-100/70 text-sm">
                {rows.map((r) => (
                    <div key={r.label} className="flex items-start justify-between gap-3 py-2">
                        <dt className="w-20 shrink-0 text-slate-500">{r.label}</dt>
                        <dd className="min-w-0 flex-1 break-words font-medium text-slate-800">{r.value || "—"}</dd>
                        <button type="button" onClick={() => onEdit(r.step)} className="shrink-0 rounded-md p-1 text-violet-600 hover:bg-violet-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400" aria-label={`Edit ${r.label.toLowerCase()}`}>
                            <PencilSquareIcon className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function SuccessScreen({ result, onReset, headingRef }: { result: SubmitResult; onReset: () => void; headingRef: RefObject<HTMLHeadingElement | null> }) {
    const via = result.contactMethod === "WhatsApp" ? "on WhatsApp" : result.contactMethod === "Email" ? "by email" : "by phone";
    return (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-violet-100 bg-white p-6 text-center shadow-[0_10px_40px_-12px_rgba(109,40,217,0.25)] sm:p-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 140, damping: 14 }}
                className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-50">
                <CheckCircleIcon className="h-12 w-12 text-emerald-500" aria-hidden />
            </motion.div>
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-violet-950 focus:outline-none">Thank you{result.name ? `, ${result.name}` : ""}!</h1>
            <p className="mt-2 text-lg text-slate-700" role="status">Your enquiry has been submitted successfully.</p>
            <p className="mt-1 text-slate-500">Our team will contact you soon {via}.</p>

            {result.reference && (
                <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-violet-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-violet-600">Your reference</p>
                    <p className="mt-0.5 font-mono text-2xl font-bold tracking-wider text-violet-950">{result.reference}</p>
                    <p className="mt-1 text-xs text-slate-500">Mention this if you contact us or visit the office.</p>
                </div>
            )}

            {result.repeat && (
                <p className="mx-auto mt-5 max-w-md rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-800">
                    This contact information appears to have an existing enquiry with us. Our team may already be assisting you — this enquiry has been added as well.
                </p>
            )}

            <button
                type="button"
                onClick={onReset}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-300/50 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 sm:w-auto"
            >
                Submit another enquiry
            </button>
        </motion.div>
    );
}
