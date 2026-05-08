const express = require('express');
const router = express.Router();
const { addEnquiry, getEnquiries } = require('../controllers/enquiryControllers');

router.post('/', addEnquiry);
router.get('/', getEnquiries);

module.exports = router;