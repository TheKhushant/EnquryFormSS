const ChatLead = require("../models/ChatLead");

const saveLead = async (req, res) => {
  try {
    const { name, mobile, interest } = req.body;

    const lead = await ChatLead.create({
      name,
      mobile,
      interest,
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await ChatLead.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveLead,
  getLeads,
};