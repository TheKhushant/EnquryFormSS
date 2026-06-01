const Enquiry = require('../models/Enquiry');

const addEnquiry = async (req, res) => {
    try {
        const {
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
            whomToMeet,
            reference,
            referenceName,
            referenceOther,
        } = req.body;

        // Strong sanitization
        const finalReference = reference && reference.trim() !== "" ? reference.trim() : null;
        const finalReferenceName = referenceName && referenceName.trim() !== "" ? referenceName.trim() : null;
        const finalReferenceOther = referenceOther && referenceOther.trim() !== "" ? referenceOther.trim() : null;

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
            whomToMeet,
            reference: finalReference,
            referenceName: finalReferenceName,
            referenceOther: finalReferenceOther,
        });

        await newEnquiry.save();

        if (global.io) {
            global.io.emit("new-enquiry", newEnquiry);
        }

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully!",
            data: newEnquiry
        });

    } catch (error) {
        console.error("=== Enquiry Save Error ===", error);

        // Send clear error to frontend
        res.status(500).json({
            success: false,
            message: error.message || "Failed to save enquiry",
            errorType: error.name,
            details: error.errors ? Object.keys(error.errors) : null
        });
    }
};

const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: enquiries
        });
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addEnquiry, getEnquiries, deleteEnquiry };