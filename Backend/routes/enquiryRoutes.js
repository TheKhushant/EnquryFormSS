const express = require('express');
const router = express.Router();
// const { addEnquiry, getEnquiries } = require('../controllers/enquiryControllers');

const {
  addEnquiry,
  getEnquiries,
  deleteEnquiry,
} = require('../controllers/enquiryControllers');

router.post('/', addEnquiry);
router.get('/', getEnquiries);
router.delete('/:id', deleteEnquiry);

module.exports = router;