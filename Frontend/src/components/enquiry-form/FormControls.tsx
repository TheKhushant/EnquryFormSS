import { useId, useMemo, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { CheckIcon, ChevronDownIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { cx } from "../../lib/cx";
import { COUNTRY_CODES } from "../../data/enquiryOptions";

const controlBase =
    "block w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-4 disabled:bg-slate-50";
const controlState = (error?: string) =>
    error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-violet-200 focus:border-violet-500 focus:ring-violet-100";

// ==================== FIELD WRAPPER ====================

interface FieldProps {
    id: string;
    label: ReactNode;
    required?: boolean;
    optional?: boolean;
    hint?: ReactNode;
    error?: string;
    children: ReactNode;
    className?: string;
}

export function Field({ id, label, required, optional, hint, error, children, className }: FieldProps) {
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-slate-800">
                {label}
                {required && <span className="text-rose-500" aria-hidden>*</span>}
                {optional && <span className="text-xs font-normal text-slate-400">(optional)</span>}
            </label>
            {children}
            <FieldMessage id={id} hint={hint} error={error} />
        </div>
    );
}

function FieldMessage({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
    if (error) {
        return (
            <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1 text-sm text-rose-600">
                <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {error}
            </p>
        );
    }
    return hint ? <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p> : null;
}

const describedBy = (id: string, error?: string, hint?: ReactNode) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

// ==================== INPUTS ====================

type InputProps = InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string; hint?: ReactNode };

export function TextInput({ id, error, hint, className, ...props }: InputProps) {
    return (
        <input
            id={id}
            name={id}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy(id, error, hint)}
            {...props}
            className={cx(controlBase, controlState(error), className)}
        />
    );
}

export function TextArea({ id, error, hint, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; error?: string; hint?: ReactNode }) {
    return (
        <textarea
            id={id}
            name={id}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy(id, error, hint)}
            {...props}
            className={cx(controlBase, controlState(error), "min-h-[110px] resize-y", className)}
        />
    );
}

export function SelectInput({ id, error, hint, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { id: string; error?: string; hint?: ReactNode }) {
    return (
        <div className="relative">
            <select
                id={id}
                name={id}
                aria-invalid={!!error || undefined}
                aria-describedby={describedBy(id, error, hint)}
                {...props}
                className={cx(controlBase, controlState(error), "appearance-none pr-10", !props.value && "text-slate-400", className)}
            >
                {children}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
        </div>
    );
}

// ==================== CHOICE GROUP (radio cards) ====================

export interface Choice {
    value: string;
    label?: string;
    hint?: string;
}

/** Radio group rendered as tappable cards; uses real radio inputs for keyboard and screen readers. */
export function ChoiceGroup({
    name, legend, choices, value, onChange, error, required, optional, columns = "grid-cols-2 sm:grid-cols-3", hint, size = "md",
}: {
    name: string;
    legend: ReactNode;
    choices: Choice[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    optional?: boolean;
    columns?: string;
    hint?: ReactNode;
    size?: "sm" | "md";
}) {
    return (
        <fieldset aria-describedby={describedBy(name, error, hint)} aria-invalid={!!error || undefined} id={name}>
            <legend className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-slate-800">
                {legend}
                {required && <span className="text-rose-500" aria-hidden>*</span>}
                {optional && <span className="text-xs font-normal text-slate-400">(optional)</span>}
            </legend>
            <div className={cx("grid gap-2", columns)}>
                {choices.map((c) => {
                    const checked = value === c.value;
                    return (
                        <label
                            key={c.value}
                            className={cx(
                                "relative flex cursor-pointer items-center gap-2 rounded-xl border bg-white text-left transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-violet-200",
                                size === "sm" ? "px-3 py-2" : "px-3.5 py-2.5",
                                checked ? "border-violet-500 bg-violet-50 text-violet-900" : error ? "border-rose-300 hover:border-violet-300" : "border-violet-200 hover:border-violet-300 hover:bg-violet-50/40",
                            )}
                        >
                            <input type="radio" name={name} value={c.value} checked={checked} onChange={() => onChange(c.value)} className="sr-only" />
                            <span
                                className={cx("grid h-4 w-4 shrink-0 place-items-center rounded-full border", checked ? "border-violet-600 bg-violet-600" : "border-slate-300 bg-white")}
                                aria-hidden
                            >
                                {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-medium leading-tight">{c.label ?? c.value}</span>
                                {c.hint && <span className="mt-0.5 block text-xs leading-tight text-slate-500">{c.hint}</span>}
                            </span>
                        </label>
                    );
                })}
            </div>
            <FieldMessage id={name} hint={hint} error={error} />
        </fieldset>
    );
}

// ==================== CHECKBOX ====================

export function Checkbox({ id, checked, onChange, children, error }: { id: string; checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string }) {
    return (
        <div>
            <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
                <span className="relative mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
                    <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        aria-invalid={!!error || undefined}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={cx("peer h-5 w-5 cursor-pointer appearance-none rounded-md border bg-white checked:border-violet-600 checked:bg-violet-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200", error ? "border-rose-400" : "border-slate-300")}
                    />
                    <CheckIcon className="pointer-events-none absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100" aria-hidden />
                </span>
                <span className="text-sm text-slate-700">{children}</span>
            </label>
            <FieldMessage id={id} error={error} />
        </div>
    );
}

// ==================== PHONE ====================

export function PhoneInput({ id, countryCode, onCountryCode, value, onChange, onBlur, error, hint }: {
    id: string;
    onBlur?: () => void;
    countryCode: string;
    onCountryCode: (code: string) => void;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    hint?: ReactNode;
}) {
    const country = COUNTRY_CODES.find((c) => c.code === countryCode);
    return (
        <div className={cx("flex rounded-xl border bg-white transition-shadow focus-within:ring-4", error ? "border-rose-400 focus-within:ring-rose-100" : "border-violet-200 focus-within:border-violet-500 focus-within:ring-violet-100")}>
            {/* Compact "+91" label; the native select (full country names) sits invisibly on top of it. */}
            <div className="relative flex shrink-0 items-center gap-1 rounded-l-xl border-r border-violet-100 pl-3 pr-2 text-base text-slate-800 focus-within:bg-violet-50">
                <span aria-hidden>+{countryCode}</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-400" aria-hidden />
                <select
                    aria-label={`Country code, currently ${country?.label ?? ""} +${countryCode}`}
                    value={countryCode}
                    onChange={(e) => onCountryCode(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                    {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label} (+{c.code})</option>)}
                </select>
            </div>
            <input
                id={id}
                name={id}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={value}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value.replace(/[^\d\s()+-]/g, ""))}
                placeholder={country?.code === "91" ? "98765 43210" : "Mobile number"}
                maxLength={country?.code === "91" ? 14 : 20}
                aria-invalid={!!error || undefined}
                aria-describedby={describedBy(id, error, hint)}
                className="min-w-0 flex-1 rounded-r-xl bg-transparent px-3 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
        </div>
    );
}

// ==================== SEARCHABLE COLLEGE PICKER ====================

/**
 * Accessible combobox: type to filter the known colleges, pick with mouse or
 * arrow keys + Enter. Anything typed that isn't in the list is accepted as a
 * custom college (stored as college "Other" + customCollege, as before).
 */
export function CollegeCombobox({ id, options, value, onChange, onBlur, error, hint }: {
    id: string;
    onBlur?: () => void;
    options: string[];
    value: string;
    onChange: (v: string) => void;
    error?: string;
    hint?: ReactNode;
}) {
    const listId = useId();
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);

    const matches = useMemo(() => {
        const q = value.trim().toLowerCase();
        if (!q || options.some((o) => o.toLowerCase() === q)) return options;
        const words = q.split(/\s+/);
        return options.filter((o) => words.every((w) => o.toLowerCase().includes(w)));
    }, [options, value]);

    const isKnown = options.some((o) => o.toLowerCase() === value.trim().toLowerCase());

    const choose = (option: string) => {
        onChange(option);
        setOpen(false);
        setActive(-1);
    };

    const move = (delta: number) => {
        setOpen(true);
        setActive((a) => {
            const next = Math.max(0, Math.min(matches.length - 1, a + delta));
            listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
            return next;
        });
    };

    return (
        <div className="relative">
            <input
                id={id}
                name={id}
                type="text"
                role="combobox"
                aria-expanded={open && matches.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
                aria-invalid={!!error || undefined}
                aria-describedby={describedBy(id, error, hint)}
                autoComplete="off"
                value={value}
                placeholder="Search or type your college name"
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                    setActive(-1);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                    setTimeout(() => setOpen(false), 120);
                    onBlur?.();
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
                    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
                    else if (e.key === "Enter" && open && active >= 0) { e.preventDefault(); choose(matches[active]); }
                    else if (e.key === "Escape") setOpen(false);
                }}
                className={cx(controlBase, controlState(error), "pr-10")}
            />
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-slate-400" aria-hidden />
            {open && matches.length > 0 && (
                <ul
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    className="absolute z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-violet-100 bg-white py-1 shadow-xl"
                >
                    {matches.map((o, i) => (
                        <li
                            key={o}
                            id={`${listId}-${i}`}
                            role="option"
                            aria-selected={o === value}
                            onMouseDown={(e) => { e.preventDefault(); choose(o); }}
                            onMouseEnter={() => setActive(i)}
                            className={cx("flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm", i === active ? "bg-violet-50 text-violet-900" : "text-slate-700")}
                        >
                            {o}
                            {o === value && <CheckIcon className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />}
                        </li>
                    ))}
                </ul>
            )}
            {!error && value.trim() && !isKnown && (
                <p className="mt-1.5 text-xs text-violet-700">Not in our list — we'll save “{value.trim()}” as your college.</p>
            )}
        </div>
    );
}
