const express = require('express');
const router = express.Router();
module.exports = router;

const language_R = require('./language_R');
router.use('/LG',[],language_R);

