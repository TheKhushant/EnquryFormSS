import { COLLEGES, COUNTRY_CODES } from "../data/enquiryOptions";

export interface EnquiryFormState {
    // Step 1 — about you
    name: string;
    countryCode: string;
    mobile: string;
    email: string;
    college: string;
    qualification: string;
    passingYear: string;
    // Step 2 — enquiry
    enquiryFor: string;
    internshipDuration: string;
    internshipDomain: string;
    courseName: string;
    jobType: string;
    jobCategory: string;
    experience: string;
    preferredCountry: string;
    preferredCountryOther: string;
    message: string;
    // Step 3 — contact & visit
    reference: string;
    referenceName: string;
    referenceOther: string;
    referenceNewspaperOther: string;
    whomToMeet: string;
    otherName: string;
    contactMethod: string;
    contactTime: string;
    consent: boolean;
    /** Honeypot: hidden from people, filled in by naive bots. */
    website: string;
}

export const EMPTY_FORM: EnquiryFormState = {
    name: "", countryCode: "91", mobile: "", email: "", college: "", qualification: "", passingYear: "",
    enquiryFor: "", internshipDuration: "", internshipDomain: "", courseName: "", jobType: "", jobCategory: "", experience: "",
    preferredCountry: "", preferredCountryOther: "", message: "",
    reference: "", referenceName: "", referenceOther: "", referenceNewspaperOther: "",
    whomToMeet: "", otherName: "", contactMethod: "", contactTime: "", consent: false, website: "",
};

export type FieldErrors = Partial<Record<keyof EnquiryFormState, string>>;

export const STEPS = [
    { title: "About you", description: "Who should we get back to?" },
    { title: "Your enquiry", description: "Tell us what you're looking for" },
    { title: "Contact & visit", description: "How you found us and how to reach you" },
] as const;

/** Which fields live on which step (used to jump back to a step with errors). */
export const STEP_FIELDS: (keyof EnquiryFormState)[][] = [
    ["name", "mobile", "email", "college", "qualification", "passingYear"],
    ["enquiryFor", "internshipDuration", "internshipDomain", "courseName", "jobType", "jobCategory", "experience", "preferredCountry", "preferredCountryOther", "message"],
    ["reference", "referenceName", "referenceOther", "referenceNewspaperOther", "whomToMeet", "otherName", "contactMethod", "contactTime", "consent"],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LETTERS_RE = /\p{L}.*\p{L}/u;

/**
 * Digits of the national number; tolerates pasted "+91 98765-43210", "0091…" or a
 * trunk "0". The country code is only stripped when it's clearly a prefix, so a
 * genuine Indian number starting with 91 (e.g. 91234 56780) is left intact.
 */
export function nationalDigits(mobile: string, countryCode: string) {
    const raw = mobile.trim();
    let digits = raw.replace(/\D/g, "");
    if (raw.startsWith("+") || raw.startsWith("00")) {
        digits = digits.replace(/^00/, "");
        if (digits.startsWith(countryCode)) digits = digits.slice(countryCode.length);
    } else if (countryCode === "91" && digits.length === 12 && digits.startsWith("91")) {
        digits = digits.slice(2);
    }
    if (countryCode === "91") {
        if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    } else {
        digits = digits.replace(/^0+/, "");
    }
    return digits;
}

export function validateMobile(mobile: string, countryCode: string): string | null {
    const digits = nationalDigits(mobile, countryCode);
    if (!digits) return "Mobile number is required";
    if (countryCode === "91") {
        if (digits.length !== 10) return "Enter a 10-digit mobile number";
        if (!/^[6-9]/.test(digits)) return "Indian mobile numbers start with 6, 7, 8 or 9";
        return null;
    }
    return digits.length >= 6 && digits.length <= 14 ? null : "Enter a valid mobile number";
}

export function validateStep(step: number, s: EnquiryFormState): FieldErrors {
    const e: FieldErrors = {};
    if (step === 0) {
        const name = s.name.trim();
        if (!name) e.name = "Full name is required";
        else if (/\d/.test(name)) e.name = "Name should not contain numbers";
        else if (name.length < 2 || !LETTERS_RE.test(name)) e.name = "Please enter your full name";

        const mobileError = validateMobile(s.mobile, s.countryCode);
        if (mobileError) e.mobile = mobileError;

        if (!s.email.trim()) e.email = "Email is required";
        else if (!EMAIL_RE.test(s.email.trim())) e.email = "Enter a valid email address, e.g. name@example.com";

        if (!s.college.trim()) e.college = "Select your college, or type its name";

        if (s.passingYear) {
            const y = Number(s.passingYear);
            const max = new Date().getFullYear() + 6;
            if (!/^\d{4}$/.test(s.passingYear) || y < 1970 || y > max) e.passingYear = `Enter a year between 1970 and ${max}`;
        }
    }
    if (step === 1) {
        if (!s.enquiryFor) e.enquiryFor = "Choose what your enquiry is about";
        if (s.enquiryFor === "Internship" && !s.internshipDomain) e.internshipDomain = "Choose an internship domain";
        if (s.enquiryFor === "Course" && !s.courseName) e.courseName = "Choose a course";
        if (s.enquiryFor === "Job" && !s.jobType) e.jobType = "Choose a job type";
        if (s.enquiryFor === "Overseas") {
            if (!s.preferredCountry) e.preferredCountry = "Choose a country";
            else if (s.preferredCountry === "Other" && s.preferredCountryOther.trim().length < 2) e.preferredCountryOther = "Enter the country";
        }
        if (s.enquiryFor === "Other" && s.message.trim().length < 10) e.message = "Please describe your enquiry (at least 10 characters)";
        if (s.message.length > 1000) e.message = "Please keep it under 1000 characters";
    }
    if (step === 2) {
        if (!s.reference) e.reference = "Let us know how you heard about us";
        if ((s.reference === "Friends" || s.reference === "Teacher") && s.referenceName.trim().length < 2) {
            e.referenceName = s.reference === "Friends" ? "Enter your friend's name" : "Enter your teacher's name";
        }
        if (s.reference === "Newspaper") {
            if (!s.referenceName) e.referenceName = "Select the newspaper";
            else if (s.referenceName === "Other" && s.referenceNewspaperOther.trim().length < 2) e.referenceNewspaperOther = "Enter the newspaper name";
        }
        if (s.reference === "Other" && s.referenceOther.trim().length < 2) e.referenceOther = "Please tell us where";
        if (!s.consent) e.consent = "Please agree so our team can contact you about this enquiry";
    }
    return e;
}

/** Stored mobile format: 10 digits for India (as before), "+<code> <digits>" otherwise. */
export function formatMobileForStorage(mobile: string, countryCode: string) {
    const digits = nationalDigits(mobile, countryCode);
    return countryCode === "91" ? digits : `+${countryCode} ${digits}`;
}

export const countryFor = (code: string) => COUNTRY_CODES.find((c) => c.code === code);

/** Maps the form to the existing API payload, sending only fields relevant to the chosen enquiry type. */
export function buildPayload(s: EnquiryFormState, tracking: { utm: Record<string, string>; referrer: string }, elapsedMs: number) {
    const known = COLLEGES.find((c) => c.toLowerCase() === s.college.trim().toLowerCase());
    const type = s.enquiryFor;
    const ref = s.reference;
    const trim = (v: string) => v.trim();

    return {
        name: trim(s.name).replace(/\s+/g, " "),
        mobile: formatMobileForStorage(s.mobile, s.countryCode),
        email: trim(s.email).toLowerCase(),
        college: known || "Other",
        customCollege: known ? "" : trim(s.college),
        qualification: s.qualification,
        passingYear: s.passingYear ? Number(s.passingYear) : undefined,

        enquiryFor: type,
        internshipDuration: type === "Internship" ? s.internshipDuration : "",
        internshipDomain: type === "Internship" ? s.internshipDomain : "",
        courseName: type === "Course" ? s.courseName : "",
        jobType: type === "Job" ? s.jobType : "",
        jobCategory: type === "Job" ? s.jobCategory : "",
        experience: type === "Job" ? s.experience : "",
        preferredCountry: type === "Overseas" ? (s.preferredCountry === "Other" ? trim(s.preferredCountryOther) : s.preferredCountry) : "",
        message: trim(s.message),

        whomToMeet: s.whomToMeet === "Other" ? trim(s.otherName) || "Other" : s.whomToMeet,
        reference: ref,
        referenceName: ref === "Friends" || ref === "Teacher" || ref === "Newspaper" ? trim(s.referenceName) : "",
        referenceOther: ref === "Other" ? trim(s.referenceOther) : "",
        referenceNewspaperOther: ref === "Newspaper" && s.referenceName === "Other" ? trim(s.referenceNewspaperOther) : "",
        contactMethod: s.contactMethod,
        contactTime: s.contactTime,
        consent: s.consent,

        utm: tracking.utm,
        referrer: tracking.referrer,
        _hp: s.website,
        _t: elapsedMs,
    };
}
