
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// importing models
const sheetModel = require('./../models/sheetSchema');
const sheetSetModel = require('./../models/sheetSetSchema');

const ToId = mongoose.Types.ObjectId;

// get all sheets associated with machine id

// alternative
router.get('/:machineId',async(req,res)=>{

  try{

   const machineId  = req.params.machineId ;

   const response = await sheetSetModel.aggregate([

{ $match :{machineId : machineId } },
{ $lookup :{
    from: 'sheets',
    localField: '_id',
    foreignField: 'sheetId',
    as: 'Data'
} },
{ $unwind:'$Data'},

  { $replaceRoot :{ newRoot :{
       $mergeObjects:["$Data","$$ROOT"  ]
   }} }
   ,

   { $project:{"sheetSetId":"$_id" ,
         "sheetId":"$Data._id", 
         "sheetTopic":"$Data.sheetTopic",_id:0,
         "machineId":"$machineId",
         "parentSheetId":"$Data.parentSheetId"
    } }
      
   ]);

   res.send( response);

  }catch(e)
  {
      console.log(e);
      res.send(e);
  }


});


// module exports
module.exports = router;