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


// create new sheet 
router.post('/create',async(req,res)=>{

  try{

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

  }catch(e)
  {
      res.send(e);
  }


});


// update sheet name only
router.patch("/update",async(req,res)=>{

  try{

   const sheetId = req.body.sheetId;
   const topic = req.body.sheetTopic;
   const sheet = await sheetModel.findByIdAndUpdate(
                    sheetId,
                  {
                    sheetTopic:topic
                  },{
                      new:true
                  }
                  );
    res.send(sheet);

  }catch(e)
  {
      res.send(e);
  }

});


// select all sheets associated with machineId
router.get('/selectAll/:machineId',async(req,res)=>{
 
   const machineId = req.params.machineId;
   const sheets = await  sheetSchemaModel.
   findOne({machineId:machineId});

   res.send(sheets);


});

// delete sheet
router.delete('/delete',async(req,res)=>{

try{

const sheetId = req.body.sheetId;
const machineId = req.body.machineId;

const sheetTemp = await sheetModel.
findByIdAndDelete(sheetId);

const temp = await sheetSchemaModel.
findOneAndUpdate({machineId:machineId} );    

temp.sheetSet.pull({sheetId:sheetId});
temp.save();
    
res.send("success fully deleted");

}catch(e)
{
   res.send(e);
}

});




module.exports = router;

