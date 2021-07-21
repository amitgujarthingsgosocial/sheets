const express = require("express");
const router = express.Router();
const httpErrors = require('http-errors');

// require sheet model 
const sheetModel =
require('../Models1/sheet');
const sheetSchema = require("../Models1/sheetSchema");
const sheetSchemaModel =
require('../Models1/sheetSchema');
const colsModel = 
require('./../Models1/columnSchema');
const rowsModel =
require('./../Models1/rowsSchema');



router.post('/create',async(req,res)=>{

   const machineId = req.body.machineId;
   const topic = req.body.topic;

  const sheetFormat = {
      machineId:machineId ,
      sheetTopic:topic
  }

  const sheet = await sheetModel.
  create(sheetFormat);
  
  const sheetSetFormat ={
      sheetId:sheet._id,
      Topic:sheet.sheetTopic
  }

  const sheetSet = await sheetSchemaModel.
  findOne({machineId:machineId});

  if(sheetSet == null )
  {
   
    const temp = await sheetSchemaModel.create({
   
    machineId:machineId,
    sheetSet :[{
      sheetId:sheet._id,
      sheetTopic:topic
         }]

    });

   const resFormat = {
      sheetId:sheet._id,
      sheetTopic:topic,
      machineId:machineId
   }; 
      res.status(200).send(resFormat);

  }else{

   const temp = await sheetSchemaModel.findOne({
       machineId:machineId
   });

   temp.sheetSet.push({
      sheetId:sheet._id,
      sheetTopic:topic
    });
    
   temp.save();
   
   const resFormat = {
      sheetId:sheet._id,
      sheetTopic:topic,
      machineId:machineId
   }; 
    
    res.status(200).send(resFormat);

  } 









});



module.exports = router;

