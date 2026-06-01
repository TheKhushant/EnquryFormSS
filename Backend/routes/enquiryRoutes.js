const express = require('express');
const router = express.Router();
// const { addEnquiry, getEnquiries } = require('../controllers/enquiryControllers');

const {
  addEnquiry,
  getEnquiries,
  deleteEnquiry,
  getDuplicateEnquiries,
  deleteDuplicateEnquiries,
  removeDuplicateEnquiries
} = require('../controllers/enquiryControllers');

router.post('/', addEnquiry);
router.get('/', getEnquiries);
router.delete('/:id', deleteEnquiry);
router.delete("/remove-duplicates", removeDuplicateEnquiries);
router.get("/duplicates", getDuplicateEnquiries);
router.post("/delete-duplicates", deleteDuplicateEnquiries);

module.exports = router;