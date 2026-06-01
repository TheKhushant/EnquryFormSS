const express = require("express");
const router = express.Router();
const {
  saveLead,
  getLeads,
} = require("../controllers/chatLeadController");
// const { saveLead } = require("../controllers/chatLeadController");

router.post("/", saveLead);
router.get("/", getLeads);


module.exports = router;