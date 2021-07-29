

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// importing models
const rowModel = require('./../models/rowSchema');

const ToId = mongoose.Types.ObjectId;

// rows routes

// add row
router.post('',async(req,res)=>{

try{
    
 const colId = req.body.colId;
 const sheetId = req.body.sheetId;
 const yPosition = req.body.yPosition;
 const value =req.body.value;

 const temp = await rowModel.create({
     columnId:ToId(colId),
     sheetId:ToId(sheetId),
     value:value,
     yPosition:yPosition
 });

 res.send(temp);

}catch(e)
{
   console.log(e);
   res.send(e.message);
}

});

// update row
router.patch('/:rowId',async(req,res)=>{

try{
    

 const yPosition = req.body.yPosition;
 const value =req.body.value;
 const rowId = req.params.rowId;

 const temp = await rowModel.findOneAndUpdate({
     _id: rowId 
 },{
     value:value,
     yPosition:yPosition
 },{
   new:true
 });

 res.send(temp);

}catch(e)
{
   console.log(e);
   res.send(e.message);
}

});

// update row
router.delete('/:rowId',async(req,res)=>{

try{
    

 const rowId = req.params.rowId;


 const temp = await rowModel.findOneAndDelete({
     _id:rowId 
 });


 
res.status(200).json({ "status":200,"message":"row deleted successfully"});



}catch(e)
{
   console.log(e);
   res.send(e.message);
}

});


// module exports
module.exports = router; 