const express = require('express');
const router = express.Router();


// require sub routes
const sheet = require('./sheet');


// intialize routes
router.use('/sheet', sheet);


// module exports
module.exports = router;