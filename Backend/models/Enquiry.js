const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    college: { type: String, required: true },
    customCollege: { type: String },

    enquiryFor: { 
        type: String, 
        enum: ['Internship', 'Job', 'Course', 'Hiring', 'Certificate/OfferLetter', 'Other'],
        required: true 
    },

    // Optional fields
    internshipDuration: String,
    internshipDomain: String,
    courseName: String,
    jobType: String,
    jobCategory: String,
    experience: String,
    whomToMeet: String,

    // ==================== REFERENCE FIELDS (Fixed) ====================
    reference: { 
        type: String,
        // enum: ['Instagram', 'Facebook', 'Ads', 'Friends', 'Teacher', 'Newspaper', 'Other', null, undefined, '']
        default: "",
    },
    
    referenceName: {
        type: String,
        default: "",
    },

    referenceOther: {
        type: String,
        default: "",
    },

    status: {
        type: String,
        enum: ['New', 'Contacted', 'In Progress', 'Closed'],
        default: 'New'
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Enquiry', enquirySchema);