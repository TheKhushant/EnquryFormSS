const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    college: { type: String, required: true },
    customCollege: { type: String },
    
    enquiryFor: { 
        type: String, 
        enum: ['Internship', 'Job', 'Course', 'Other'],
        required: true 
    },

    // Internship fields
    internshipDuration: String,
    internshipDomain: String,

    // Course fields
    courseName: String,

    // Job fields
    jobType: String,
    jobCategory: String,
    experience: String,

    // Whom to meet
    whomToMeet: String,

    status: {
        type: String,
        enum: ['New', 'Contacted', 'In Progress', 'Closed'],
        default: 'New'
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);