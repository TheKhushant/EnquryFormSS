import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Enquiry = {
    id: number;
    date: string;
    name: string;
    mobile: string;
    email: string;
    college: string;
    customCollege?: string;
    enquiryFor: string;
    internshipDuration?: string;
    internshipDomain?: string;
    jobType?: string;
    jobCategory?: string;
    experience?: string;
    courseName?: string;
    whomToMeet: string;
};

type EnquiryContextType = {
    enquiries: Enquiry[];
    addEnquiry: (newEnquiry: Omit<Enquiry, "id" | "date">) => void;
};

const EnquiryContext = createContext<EnquiryContextType | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

    // Load from localStorage on start
    useEffect(() => {
        const saved = localStorage.getItem("enquiries");
        if (saved) {
            setEnquiries(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage whenever enquiries change
    useEffect(() => {
        localStorage.setItem("enquiries", JSON.stringify(enquiries));
    }, [enquiries]);

    // const addEnquiry = (data: Omit<Enquiry, "id" | "date">) => {
    //     const newEnquiry: Enquiry = {
    //         ...data,
    //         id: Date.now(),
    //         date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    //     };

    //     setEnquiries(prev => [newEnquiry, ...prev]); // Add to top
    // };

    const addEnquiry = async (data: Omit<Enquiry, "id" | "date">) => {
        try {
            const res = await fetch("http://localhost:5000/api/enquiries", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            
            if (result.success) {
                // Optionally refresh enquiries list
                console.log('Enquiry saved to DB');
            }
        } catch (error) {
            console.error('Failed to submit enquiry:', error);
            alert('Failed to submit enquiry. Please try again.');
        }
    };

    return (
        <EnquiryContext.Provider value={{ enquiries, addEnquiry }}>
            {children}
        </EnquiryContext.Provider>
    );
}

export const useEnquiries = () => {
    const context = useContext(EnquiryContext);
    if (!context) throw new Error("useEnquiries must be used within EnquiryProvider");
    return context;
};