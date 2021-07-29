
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// importing models
const colModel = require('./../models/columnSchema');

const ToId = mongoose.Types.ObjectId;



// column routes

// add column
router.post('',async(req,res)=>{

try{
    
 const colName = req.body.colName;
 const sheetId = req.body.sheetId;
 const role = req.body.role;   
 const xPosition = req.body.xPosition;

 const temp = await colModel.create({
     colName:colName,
     sheetId:ToId(sheetId),
     role:role,
     xPosition:xPosition
 });

 res.send(temp);

}catch(e)
{
   console.log(e);
   res.send(e.message);
}

});

// update column
router.patch('/:colId',async(req,res)=>{

try{
    
 const colName = req.body.colName;
 const colId = req.params.colId;
 const xPosition = req.body.xPosition;

 const temp = await colModel.findOneAndUpdate({
     _id:colId
 },{
     colName:colName,
     xPosition:xPosition
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

// update column
router.delete('/:colId',async(req,res)=>{

try{

 const colId = req.params.colId;
 const role = req.params.role;   

 const temp = await colModel.deleteOne({
     _id:colId 
 });

 if(temp.deletedCount == 0 ){
   res.status(400).json({ "status":400,"message":"You dont have access"});
 }else{
 
 res.status(200).json({ "status":200,"message":"Column deleted successfully"});
 
 }


}catch(e)
{
   console.log(e);
   res.send(e.message);
}

});

// module exports
module.exports = router; 