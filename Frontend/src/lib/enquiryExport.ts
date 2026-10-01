import type { Enquiry } from "../../components/site/types";
import { formatDateTime, getCategory, getCollege, getOwner, getPriority, getProgram, getSource, getSourceDetail, getStatus } from "./analytics";
import type { CsvColumn } from "./csv";

const nextFollowUp = (e: Enquiry) =>
    (e.followUps || [])
        .filter((f) => !f.completedAt)
        .map((f) => f.dueAt)
        .sort()[0] || "";

export const ENQUIRY_CSV_COLUMNS: CsvColumn<Enquiry>[] = [
    { header: "Enquiry ID", value: (e) => e._id },
    { header: "Created", value: (e) => formatDateTime(e.createdAt) },
    { header: "Name", value: (e) => e.name },
    { header: "Mobile", value: (e) => e.mobile },
    { header: "Email", value: (e) => e.email },
    { header: "College", value: getCollege },
    { header: "Enquiry For", value: getCategory },
    { header: "Course / Domain / Role", value: (e) => (getProgram(e) === "Not specified" ? "" : getProgram(e)) },
    { header: "Internship Duration", value: (e) => e.internshipDuration || "" },
    { header: "Job Type", value: (e) => e.jobType || "" },
    { header: "Experience", value: (e) => e.experience || "" },
    { header: "Whom To Meet", value: (e) => e.whomToMeet || "" },
    { header: "Assigned To", value: (e) => e.assignedTo || "" },
    { header: "Counselor (effective)", value: getOwner },
    { header: "Source", value: getSource },
    { header: "Source Detail", value: getSourceDetail },
    { header: "Status", value: getStatus },
    { header: "Outcome", value: (e) => e.outcome || "" },
    { header: "Priority", value: getPriority },
    { header: "First Contacted", value: (e) => (e.firstContactedAt ? formatDateTime(e.firstContactedAt) : "") },
    { header: "Closed", value: (e) => (e.closedAt ? formatDateTime(e.closedAt) : "") },
    { header: "Next Follow-up", value: (e) => (nextFollowUp(e) ? formatDateTime(nextFollowUp(e)) : "") },
    { header: "Notes", value: (e) => (e.notes || []).map((n) => n.text).join(" | ") },
];
