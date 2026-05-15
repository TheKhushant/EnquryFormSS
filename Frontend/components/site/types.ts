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
    internshipDuration?: string;
    internshipDomain?: string;
    courseName?: string;
    jobType?: string;
    jobCategory?: string;
    experience?: string;
    whomToMeet?: string;
}