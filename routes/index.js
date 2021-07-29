
const express = require('express');
const router = express.Router();

//  importing subroutes
const machineRoutes = require('./machineRoutes');
const sheetRoutes = require('./sheetRoutes');
const rowsRoutes  = require('./rowRoutes');
const colRoutes  = require('./columnRoutes');


router.use('/machine',machineRoutes);
router.use('/sheet',sheetRoutes);
router.use('/row',rowsRoutes);
router.use('/col',colRoutes);


module.exports = router;