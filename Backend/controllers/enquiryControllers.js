const Enquiry = require('../models/Enquiry');
;
const addEnquiry = async (req, res) => {
  console.log("ENQUIRY API HIT");
  console.log(req.body)
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
            referenceOther,
            referenceNewspaperOther, // ADD THIS

        } = req.body;

        // Strong sanitization
        const finalReference = reference && reference.trim() !== "" ? reference.trim() : null;
        const finalReferenceName =
          reference === "Newspaper" &&
          referenceName === "Other" &&
          referenceNewspaperOther
              ? referenceNewspaperOther.trim()
              : referenceName && referenceName.trim() !== ""
              ? referenceName.trim()
              : null;
        const finalReferenceOther = referenceOther && referenceOther.trim() !== "" ? referenceOther.trim() : null;

        const finalReferenceNewspaperOther =
          referenceNewspaperOther &&
          referenceNewspaperOther.trim() !== ""
              ? referenceNewspaperOther.trim()
              : null;

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
            referenceNewspaperOther: finalReferenceNewspaperOther,
        });

        await newEnquiry.save();
        const mongoose = require("mongoose");
        console.log("DATABASE:", mongoose.connection.name);
        console.log("ENQUIRY SAVED");
        console.log(newEnquiry._id);

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

const removeDuplicateEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    const seen = new Set();
    const idsToDelete = [];

    enquiries.forEach((enq) => {
      const date = new Date(enq.createdAt).toISOString().split("T")[0];

      const key = `${enq.mobile}_${date}`;

      if (seen.has(key)) {
        idsToDelete.push(enq._id);
      } else {
        seen.add(key);
      }
    });

    const result = await Enquiry.deleteMany({
      _id: { $in: idsToDelete },
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} duplicate enquiries removed`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getDuplicateEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    const groups = {};

    enquiries.forEach((enq) => {
      const date = new Date(enq.createdAt)
        .toISOString()
        .split("T")[0];

      const key = `${enq.mobile}_${date}`;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(enq);
    });

    const duplicates = Object.values(groups)
      .filter(group => group.length > 1)
      .map(group => ({
        mobile: group[0].mobile,
        date: new Date(group[0].createdAt)
          .toISOString()
          .split("T")[0],
        count: group.length,
        entries: group
      }));

    res.json({
      success: true,
      data: duplicates
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const deleteDuplicateEnquiries = async (req, res) => {
        try {
            const { ids } = req.body;

            if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: "Ids required"
            });
            }

            await Enquiry.deleteMany({
            _id: { $in: ids }
            });

            res.json({
            success: true,
            message: `${ids.length} duplicate enquiries deleted`
            });

        } catch (error) {
            res.status(500).json({
            success: false,
            message: error.message
            });
        }
    };

module.exports = { addEnquiry, getEnquiries, deleteEnquiry, removeDuplicateEnquiries, getDuplicateEnquiries, deleteDuplicateEnquiries };