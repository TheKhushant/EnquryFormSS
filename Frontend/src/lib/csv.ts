export interface CsvColumn<T> {
    header: string;
    value: (row: T) => string | number | null | undefined;
}

// Cells starting with these characters are interpreted as formulas by
// Excel/Sheets; prefix them so user-submitted text can't inject formulas.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

const escapeCell = (raw: string | number | null | undefined) => {
    if (raw === null || raw === undefined) return "";
    let value = String(raw);
    if (typeof raw === "string" && FORMULA_PREFIX.test(value)) value = `'${value}`;
    return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
};

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]) {
    const lines = [columns.map((c) => escapeCell(c.header)).join(",")];
    for (const row of rows) lines.push(columns.map((c) => escapeCell(c.value(row))).join(","));
    return lines.join("\r\n");
}

/** Downloads CSV with a UTF-8 BOM so Excel opens non-ASCII names correctly. */
export function downloadCsv(filename: string, csv: string) {
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export const fileStamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
