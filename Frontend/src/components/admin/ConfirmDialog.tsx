import { useEffect, useRef, type ReactNode } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message?: ReactNode;
    confirmLabel?: string;
    tone?: "danger" | "primary";
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    children?: ReactNode;
}

/** Accessible replacement for window.confirm (native <dialog>: focus trap + Esc). */
export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", tone = "danger", busy, onConfirm, onCancel, children }: ConfirmDialogProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            onCancel={(e) => {
                e.preventDefault();
                if (!busy) onCancel();
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-slate-900/40 backdrop:backdrop-blur-[2px]"
        >
            <div className="p-5">
                <div className="flex gap-3">
                    {tone === "danger" && (
                        <div className="h-fit rounded-xl bg-rose-50 p-2 text-rose-600">
                            <ExclamationTriangleIcon className="h-5 w-5" aria-hidden />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                        {message && <div className="mt-1 text-sm text-slate-600">{message}</div>}
                        {children}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 rounded-b-2xl bg-slate-50 px-5 py-3">
                <Button onClick={onCancel} disabled={busy}>Cancel</Button>
                <Button variant={tone} onClick={onConfirm} disabled={busy} autoFocus>
                    {busy ? "Working…" : confirmLabel}
                </Button>
            </div>
        </dialog>
    );
}
