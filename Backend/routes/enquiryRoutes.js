const express = require('express');
const router = express.Router();
// const { addEnquiry, getEnquiries } = require('../controllers/enquiryControllers');
const upload = require("../config/multer");
const {
  addEnquiry,
  getEnquiries,
  deleteEnquiry,
  getDuplicateEnquiries,
  deleteDuplicateEnquiries,
  removeDuplicateEnquiries
} = require('../controllers/enquiryControllers');

router.post(
    "/",
    upload.single("resume"),
    addEnquiry
);
router.get('/', getEnquiries);
router.delete('/:id', deleteEnquiry);
router.delete("/remove-duplicates", removeDuplicateEnquiries);
router.get("/duplicates", getDuplicateEnquiries);
router.post("/delete-duplicates", deleteDuplicateEnquiries);

module.exports = router;