const Enquiry = require('../models/Enquiry');

const addEnquiry = async (req, res) => {
    try {
        const {
            name, mobile, email, college, customCollege, enquiryFor,
            internshipDuration, internshipDomain, courseName,
            jobType, jobCategory, experience, whomToMeet
        } = req.body;

        const newEnquiry = new Enquiry({
            name,
            mobile,
            email,
            college,
            customCollege,
            enquiryFor,
            internshipDuration,
            internshipDomain,
            courseName,
            jobType,
            jobCategory,
            experience,
            whomToMeet
        });

        await newEnquiry.save();

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully!",
            data: newEnquiry
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error while saving enquiry"
        });
    }
};

const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json({ success: true, data: enquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addEnquiry, getEnquiries };