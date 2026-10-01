// Options for the public enquiry form. Values that already existed are kept
// byte-for-byte so stored enquiries and dashboard analytics stay continuous.

export const COLLEGES = [
    "Dr. Ambedkar College, Deekshabhoomi",
    "G H Raisoni College of Engineering",
    "Guru Nanak Institute of Engineering and Technology",
    "JD College of Engineering and Management",
    "Jhulelal Institute of Technology",
    "Karmaveer Dadasaheb Kannamwar College of Engineering",
    "Prerna College of Commerce and Science",
    "S. B. Jain Institute of Technology, Management and Research",
    "Shri Ramdeobaba College of Engineering and Management",
    "St. Vincent Pallotti College of Engineering and Technology",
    "Suryoday College of Engineering and Technology",
    "Tulsiramji Gaikwad-Patil College of Engineering and Technology",
    "Yeshwantrao Chavan College of Engineering",
];

export const ENQUIRY_TYPES = [
    { value: "Internship", hint: "Industry internship" },
    { value: "Job", hint: "Placement & openings" },
    { value: "Course", hint: "Training programs" },
    { value: "Skill Development", hint: "Short skill programs" },
    { value: "Certification", hint: "Certificates" },
    { value: "Overseas", hint: "Language & abroad" },
    { value: "Hiring", hint: "Hire our students" },
    { value: "Offer Letter", hint: "Offer letter query" },
    { value: "New Visitor", hint: "First visit" },
    { value: "Other", hint: "Something else" },
];

export const INTERNSHIP_DURATIONS = ["1 Month", "3 Months", "6 Months"];

export const INTERNSHIP_DOMAINS = [
    { value: "Fullstack", label: "Fullstack Development" },
    { value: "Data Analytics", label: "Data Analytics" },
    { value: "Cyber Security", label: "Cyber Security" },
    { value: "UI/UX", label: "UI/UX Design" },
    { value: "AI ML", label: "AI & Machine Learning" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Operation", label: "Operation" },
    { value: "HR Intern", label: "HR Intern" },
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "Other", label: "Other" },
];

export const COURSES = [
    { value: "Service Now", label: "Service Now" },
    { value: "Data Analytics", label: "Data Analytics" },
    { value: "DataBricks", label: "DataBricks" },
    { value: "AI ML", label: "AI & Machine Learning" },
];

export const JOB_ROLES: Record<string, { value: string; label: string }[]> = {
    Tech: [
        { value: "Fullstack Developer", label: "Fullstack Developer" },
        { value: "AI ML Engineer", label: "AI/ML Engineer" },
        { value: "Data Analyst", label: "Data Analyst" },
        { value: "Java Developer", label: "Java Developer" },
    ],
    "Non-Tech": [
        { value: "BPO / Calling", label: "BPO / Calling" },
        { value: "Service Now", label: "Service Now" },
        { value: "Electronics", label: "Electronics" },
    ],
};

/** Overseas = language training for working/studying abroad (see Overseas Training page). */
export const OVERSEAS_COUNTRIES = ["Germany", "Japan", "France", "Spain", "Not decided yet", "Other"];

export const QUALIFICATIONS = [
    "10th / SSC",
    "12th / HSC",
    "Diploma",
    "B.E. / B.Tech",
    "BCA / B.Sc (CS/IT)",
    "B.Com / BBA / BA",
    "B.Sc (Other)",
    "M.E. / M.Tech",
    "MCA / M.Sc",
    "MBA",
    "Other",
];

export const PEOPLE_TO_MEET = ["Dr. N. G. Alvi", "Mr. Allan Abraham", "Mrs. Manisha Mali", "Mr. Viraj Patle", "Other"];

/** Existing values first (unchanged), then common channels that were previously typed into "Other". */
export const REFERENCES = [
    "Instagram", "Facebook", "Ads", "Friends", "Teacher", "Newspaper",
    "Google Search", "WhatsApp", "YouTube", "LinkedIn", "Other",
];

export const NEWSPAPERS: { group: string; options: string[] }[] = [
    { group: "English Newspapers", options: ["The Hitavada", "The Times of India", "The Indian Express", "The Hindu", "The Economic Times"] },
    { group: "Marathi Newspapers (Regional)", options: ["Lokmat", "Sakal", "Maharashtra Times", "Tarun Bharat", "Deshonnati", "Punya Nagari", "Loksatta"] },
    { group: "Hindi Newspapers", options: ["Nava Bharat", "Dainik Bhaskar", "Dainik Jagran"] },
];

export const CONTACT_METHODS = [
    { value: "Phone", label: "Phone call" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Email", label: "Email" },
];

export const CONTACT_TIMES = [
    { value: "Morning", label: "Morning", hint: "9am – 12pm" },
    { value: "Afternoon", label: "Afternoon", hint: "12pm – 4pm" },
    { value: "Evening", label: "Evening", hint: "4pm – 8pm" },
    { value: "Anytime", label: "Anytime" },
];

export const COUNTRY_CODES = [
    { code: "91", label: "India", flag: "🇮🇳", digits: 10 },
    { code: "971", label: "UAE", flag: "🇦🇪" },
    { code: "966", label: "Saudi Arabia", flag: "🇸🇦" },
    { code: "974", label: "Qatar", flag: "🇶🇦" },
    { code: "968", label: "Oman", flag: "🇴🇲" },
    { code: "1", label: "USA / Canada", flag: "🇺🇸" },
    { code: "44", label: "UK", flag: "🇬🇧" },
    { code: "49", label: "Germany", flag: "🇩🇪" },
    { code: "61", label: "Australia", flag: "🇦🇺" },
    { code: "65", label: "Singapore", flag: "🇸🇬" },
];
