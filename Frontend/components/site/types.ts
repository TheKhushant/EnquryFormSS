export type EnquiryStatus = "New" | "Contacted" | "In Progress" | "Closed";
export type EnquiryPriority = "Low" | "Medium" | "High";
export type EnquiryOutcome = "" | "Converted" | "Not Converted";

export interface EnquiryNote {
    _id: string;
    text: string;
    author?: string;
    createdAt: string;
}

export interface EnquiryFollowUp {
    _id: string;
    dueAt: string;
    note?: string;
    completedAt?: string | null;
    result?: string;
    createdAt: string;
}

export interface EnquiryActivity {
    _id: string;
    type: "status" | "priority" | "assigned" | "outcome" | "note" | "followup_scheduled" | "followup_completed";
    message: string;
    from?: string;
    to?: string;
    at: string;
}

export interface Enquiry {
    reference: string;
    _id: string;
    name: string;
    mobile: string;
    email: string;
    college: string;
    customCollege?: string;
    enquiryFor: string;
    createdAt: string;
    updatedAt?: string;
    internshipDuration?: string;
    internshipDomain?: string;
    courseName?: string;
    jobType?: string;
    jobCategory?: string;
    experience?: string;
    whomToMeet?: string;
    referenceName?: string | null;
    referenceOther?: string | null;
    referenceNewspaperOther?: string | null;

    // Enquiry form v2 (optional: older records don't have them)
    qualification?: string;
    passingYear?: number | null;
    preferredCountry?: string;
    message?: string;
    contactMethod?: "" | "Phone" | "WhatsApp" | "Email";
    contactTime?: "" | "Morning" | "Afternoon" | "Evening" | "Anytime";
    consentAt?: string | null;
    utm?: { source?: string; medium?: string; campaign?: string; term?: string; content?: string };
    referrer?: string;

    // CRM fields (optional: older records and older API versions omit them)
    status?: EnquiryStatus;
    priority?: EnquiryPriority;
    assignedTo?: string;
    outcome?: EnquiryOutcome;
    firstContactedAt?: string | null;
    closedAt?: string | null;
    notes?: EnquiryNote[];
    followUps?: EnquiryFollowUp[];
    activity?: EnquiryActivity[];
}

export interface ChatLead {
    _id: string;
    name: string;
    mobile: string;
    interest: string;
    createdAt: string;
}
