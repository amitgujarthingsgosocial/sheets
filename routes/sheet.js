const express = require("express");
const router = express.Router();
const httpErrors = require('http-errors');

// require sheet model 
const sheetModel = require('./../models/sheetSchema');
const sheetStoreModel = require("./../models/sheetStoreSchema");


// create  sheet   
router.post('/create', async(req, res) => {

    try {

        const sheetFormat = {
            name: req.body.name,
            headings: req.body.headings,
            rows: req.body.rows
        }

        const temp = new sheetStoreModel(sheetFormat);
        const savedSheet = await temp.save();

        const sheetId = savedSheet._id;

        const Check = await sheetModel.findOne({
            orgId: req.body.orgId
        });

        // when first time organisation created we stored
        if (Check == null) {
            const tem = new sheetModel({
                orgId: req.body.orgId,
                sheets: [sheetId]
            });
            const result = await tem.save();
            console.log(result);
        } else { // next time we update 

            const tem = await sheetModel.findOneAndUpdate({
                orgId: req.body.orgId,
            }, {
                $push: { sheets: [sheetId] }
            });
            console.log(tem);

        }

        res.status(200).json({ "status": 200, "message": "Sheet Created Successfully" });

    } catch (e) {

        res.send(e);
        console.log(e);

    }

});

// update sheet
router.patch('/update', async(req, res) => {

    try {
        const sheetFormat = {
            name: req.body.name,
            headings: req.body.headings,
            rows: req.body.rows
        }
        const temp = await sheetStoreModel.
        findByIdAndUpdate(req.body.storeId, sheetFormat);
        res.json({ "status": 200, "message": "Sheet Updated SuccessFully" });

    } catch (e) {
        console.log(e);
        res.send(e);
    }

});

// delete sheet 
router.delete("/delete", async(req, res) => {

    try {

        const id = req.body.storeId;
        const tempStore = await sheetStoreModel.
        findByIdAndDelete(req.body.storeId);

        const tempSheet1 = await sheetModel.findOne({ orgId: req.body.orgId });


        var filtered = tempSheet1.sheets.filter(function(value, index, arr) {
            return value != id;
        });

        const tem11 = await sheetModel.findOneAndUpdate({
            orgId: req.body.orgId
        }, { sheets: filtered }, { new: true });

        res.send(team11);

    } catch (e) {
        console.log(e);
        res.send(e);
    }

});


// select All sheets of oraganisation
router.get("/getAll/:orgId", async(req, res) => {

    const orgId = req.params.orgId;
    const temp = await sheetModel.
    findOne({ orgId: orgId })
        .lean().
    populate('sheets').exec((err, docs) => {
        return res.json(docs);
    });





});


// module export
module.exports = router;