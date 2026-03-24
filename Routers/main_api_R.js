const express = require('express');
const router = express.Router();
module.exports = router;

const language_R = require('./language_R');
router.use('/LG',[],language_R);
const level_R = require('./level_R');
router.use('/LV',[],level_R);
const topics_R = require('./topics_R');
router.use('/T',[],topics_R);

