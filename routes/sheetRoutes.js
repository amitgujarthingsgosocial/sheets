
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// importing models
const sheetModel = require('./../models/sheetSchema');
const sheetSetModel = require('./../models/sheetSetSchema');
const colModel = require('./../models/columnSchema');
const rowModel = require('./../models/rowSchema');
const sheetSchema = require('./../models/sheetSchema');

const ToId = mongoose.Types.ObjectId;

// sheet routes 

// create new sheet 
router.post('',async(req,res)=>{

try{

 const machineId = req.body.machineId;
 const sheetTopic = req.body.sheetTopic;

 const machineIdCheck = await sheetSetModel.findOne({
     machineId:machineId
 });
 

   if(machineIdCheck == null)
    {
      
      const temp = await sheetSetModel.create({ machineId:machineId });
      const sheetSetId = temp._id;

      const temp1 = await sheetModel.
      create({ sheetTopic:sheetTopic,sheetId:sheetSetId,parentSheetId:null });

      // const temp2 = await sheetSetModel.findOneAndUpdate({machineId:machineId});
      // temp2.sheetSet = temp1._id;
      // temp2.save();
    
      res.send(temp1);
 
    }else{
      
      const SetId = machineIdCheck._id;
      const temp3 = await sheetModel.
      create({ sheetTopic:sheetTopic,sheetId:SetId,parentSheetId:null });
    
     
      // const temp4 = await sheetSetModel.
      // findOneAndUpdate({machineId:machineId},{ $push : { sheetSet : temp3._id }  },{new :true});

       res.send(temp3);

     }  



}catch(e)
{
   console.log(e);
   res.send(e.message);
}

});

// clone sheet
router.post('/clone',async(req,res)=>{

try{

 const machineId = req.body.machineId;
 const sheetTopic = req.body.sheetTopic;
 const cloneId  = req.body.cloneId;



 const machineIdCheck = await sheetSetModel.findOne({
     machineId:machineId
 });
 

   if(machineIdCheck == null)
    {
      
      const temp = await sheetSetModel.create({ machineId:machineId });
      const sheetSetId = temp._id;

      const temp1 = await sheetModel.
      create({ sheetTopic:sheetTopic,sheetId:sheetSetId,parentSheetId:cloneId });
    
      res.send(temp1);
 
    }else{
      
      const SetId = machineIdCheck._id;
      const temp3 = await sheetModel.
      create({ sheetTopic:sheetTopic,sheetId:SetId,parentSheetId:cloneId });
    
       res.send(temp3);

     }  



}catch(e)
{
   console.log(e);
   res.send(e.message);
}

});


//  update Sheet Topic
router.patch('/:sheetId',async(req,res)=>{

 try{

    const sheetId = req.params.sheetId;
    const sheetTopic = req.body.sheetTopic;
    
    const temp = await sheetModel.findOneAndUpdate({_id:sheetId},{
        sheetTopic:sheetTopic
    },{new:true});

    res.send(temp);

 }catch(e)
 {
     console.log(e);
     res.send(e.message);
 }


});


// delete sheet
router.delete('/:sheetId',async(req,res)=>{

   try{

     const sheetId = req.params.sheetId;
   

   const temp1 = await sheetModel.findOneAndDelete({_id:sheetId});

   const colTemp = await colModel.deleteMany({sheetId:sheetId});    
   const rowTemp = await rowModel.deleteMany({sheetId:sheetId});    

   res.status(200).json({"status":200,"message":"Sheet Deleted Successfully"});

   

   }catch(e)
   {    
       console.log(e);
       res.send(e);
   }

});

// get all data asscoiated with sheetId (all sheet Data)
router.get('/:sheetId',async(req,res)=>{

  try{
 
   const sheetId = req.params.sheetId;


   const copyCheck = await sheetModel.findOne({_id:sheetId});

   if(copyCheck.parentSheetId == null)
   {
     const response = await sheetModel.aggregate([
 
      { $match :{ _id :ToId( sheetId) }},


     {
        $lookup:{
                from: 'rowschemas',
                localField: '_id',
                foreignField: 'sheetId',
                pipeline:[
                   { $sort : { yPosition: 1}  }
                ],
                as: 'RowData'
        }
     },

            {   $unwind :{
          path :'$RowData', 
          preserveNullAndEmptyArrays: true}},


          {
          $lookup:{
              from: 'columnschemas',
              localField: 'RowData.columnId',
              foreignField: '_id',
              pipeline:[
                  { $sort : { xPosition : 1}  }
              ],
              as: 'ColData'
          }
          },
            {   $unwind :{
          path :'$ColData', 
          preserveNullAndEmptyArrays: true}},


    { $project :{ 
      "sheetId":{  $ifNull:[ "$_id" ,null ] },
      "sheetTopic":{  $ifNull:[ "$sheetTopic" ,null ] },
      "sheetCreatedAt": {  $ifNull:['$createdAt' ,null ] }  ,
      "sheetUpdatedAt":  {  $ifNull:[ '$updatedAt' ,null ] } ,
      "colId":{  $ifNull:["$ColData._id" ,null ] },
      "colName":{  $ifNull:["$ColData.colName" ,null ] },
      "xPosition":{  $ifNull:[ "$ColData.xPosition" ,null ] },
      "yPosition":{  $ifNull:[ "$RowData.yPosition" ,null ] },
      "rowId": {  $ifNull:[ "$RowData._id" ,null ] },
      _id:0 ,
      "value":{  $ifNull:[ "$RowData.value" ,null ] }
        } }
  
    
  ]);

     res.send(response);

   }else{

   

  const response = await sheetModel.aggregate([
 
      { $match :{ _id :ToId( sheetId) }},
  

     {
        $lookup:{
                from: 'rowschemas',
                localField: 'parentSheetId',
                foreignField: 'sheetId',
                pipeline:[
                   { $sort : { yPosition: 1}  }
                ],
                as: 'RowData'
        }
     },

            {   $unwind :{
          path :'$RowData', 
          preserveNullAndEmptyArrays: true}},


          {
          $lookup:{
              from: 'columnschemas',
              localField: 'RowData.columnId',
              foreignField: '_id',
              pipeline:[
                  { $sort : { xPosition : 1}  }
              ],
              as: 'ColData'
          }
          },
            {   $unwind :{
          path :'$ColData', 
          preserveNullAndEmptyArrays: true}},



    { $project :{ 

      "sheetId":{  $ifNull:[ "$RowData.sheetId" ,null ] },
      "sheetTopic":{  $ifNull:[ "$sheetTopic" ,null ] },
      "sheetCreatedAt": {  $ifNull:['$createdAt' ,null ] }  ,
      "sheetUpdatedAt":  {  $ifNull:[ '$updatedAt' ,null ] } ,
      "colId":{  $ifNull:["$RowData.columnId" ,null ] },
      "colName":{  $ifNull:["$ColData.colName" ,null ] },
      "xPosition":{  $ifNull:[ "$ColData.xPosition" ,null ] },
      "yPosition":{  $ifNull:[ "$RowData.yPosition" ,null ] },
      "rowId": {  $ifNull:[ "$RowData._id" ,null ] },
      _id:0 ,
      "value":{  $ifNull:[ "$RowData.value" ,null ] }
    
    } }
  
    
  ]);

     res.send(response);


   }

  }catch(e)
  {
    console.log(e);
    res.send(e);
  }


});


// to get only x column and y rows
router.get('/:sheetId/:xposition/:yposition',async(req,res)=>{

  try{
 
   const sheetId = req.params.sheetId;
   const xposition =parseInt( req.params.xposition);
   const yposition =parseInt(req.params.yposition);

   const copyCheck = await sheetModel.findOne({_id:sheetId});

   if(copyCheck.parentSheetId == null)
   {
     const response = await sheetModel.aggregate([
 
      { $match :{ _id :ToId( sheetId) }},


     {
        $lookup:{
                from: 'rowschemas',
                localField: '_id',
                foreignField: 'sheetId',
                pipeline:[
                    { $match : { yPosition :{ $lte : yposition} } },
                   { $sort : { yPosition: 1}  }
                ],
                as: 'RowData'
        }
     },

            {   $unwind :{
          path :'$RowData', 
          preserveNullAndEmptyArrays: true}},


          {
          $lookup:{
              from: 'columnschemas',
              localField: 'RowData.columnId',
              foreignField: '_id',
              pipeline:[
                  { $match : { xPosition :{ $lte : xposition} } },
                  { $sort : { xPosition : 1}  }
              ],
              as: 'ColData'
          }
          },
            {   $unwind :{
          path :'$ColData', 
          preserveNullAndEmptyArrays: true}},


    { $project :{ 
      "sheetId":{  $ifNull:[ "$_id" ,null ] },
      "sheetTopic":{  $ifNull:[ "$sheetTopic" ,null ] },
      "sheetCreatedAt": {  $ifNull:['$createdAt' ,null ] }  ,
      "sheetUpdatedAt":  {  $ifNull:[ '$updatedAt' ,null ] } ,
      "colId":{  $ifNull:["$ColData._id" ,null ] },
      "colName":{  $ifNull:["$ColData.colName" ,null ] },
      "xPosition":{  $ifNull:[ "$ColData.xPosition" ,null ] },
      "yPosition":{  $ifNull:[ "$RowData.yPosition" ,null ] },
      "rowId": {  $ifNull:[ "$RowData._id" ,null ] },
      _id:0 ,
      "value":{  $ifNull:[ "$RowData.value" ,null ] }
        } }
  
    
  ]);

     res.send(response);

   }else{

   

  const response = await sheetModel.aggregate([
 
      { $match :{ _id :ToId( sheetId) }},
  

     {
        $lookup:{
                from: 'rowschemas',
                localField: 'parentSheetId',
                foreignField: 'sheetId',
                pipeline:[
                  { $match : { yPosition :{ $lte : yposition} } },
                   { $sort : { yPosition: 1}  }
                ],
                as: 'RowData'
        }
     },

            {   $unwind :{
          path :'$RowData', 
          preserveNullAndEmptyArrays: true}},


          {
          $lookup:{
              from: 'columnschemas',
              localField: 'RowData.columnId',
              foreignField: '_id',
              pipeline:[
                  { $match : { xPosition :{ $lte : xposition} } },
                  { $sort : { xPosition : 1}  }
              ],
              as: 'ColData'
          }
          },
            {   $unwind :{
          path :'$ColData', 
          preserveNullAndEmptyArrays: true}},



    { $project :{ 

      "sheetId":{  $ifNull:[ "$RowData.sheetId" ,null ] },
      "sheetTopic":{  $ifNull:[ "$sheetTopic" ,null ] },
      "sheetCreatedAt": {  $ifNull:['$createdAt' ,null ] }  ,
      "sheetUpdatedAt":  {  $ifNull:[ '$updatedAt' ,null ] } ,
      "colId":{  $ifNull:["$RowData.columnId" ,null ] },
      "colName":{  $ifNull:["$ColData.colName" ,null ] },
      "xPosition":{  $ifNull:[ "$ColData.xPosition" ,null ] },
      "yPosition":{  $ifNull:[ "$RowData.yPosition" ,null ] },
      "rowId": {  $ifNull:[ "$RowData._id" ,null ] },
      _id:0 ,
      "value":{  $ifNull:[ "$RowData.value" ,null ] }
    
    } }
  
    
  ]);

     res.send(response);


   }

  }catch(e)
  {
    console.log(e);
    res.send(e);
  }


});


// module exports
module.exports = router; 
//Plan executor error during findAndModify :: caused by :: Performing an update on the path '_id' would modify the
//immutable field '_id'
