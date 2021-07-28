
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
router.post('/createSheet',async(req,res)=>{

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

//  update Sheet Topic
router.post('/updateSheetTopic',async(req,res)=>{

 try{

    const sheetId = req.body.sheetId;
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
router.delete('/deleteSheet',async(req,res)=>{

   try{

     const sheetId = req.body.sheetId;
     const sheetSetId = req.body.sheetSetId;

    const temp1 = await sheetModel.findOneAndDelete({_id:sheetId});

    const temp = await sheetSetModel.
    findOneAndUpdate({_id:sheetSetId} );    

    temp.sheetSet.pull(sheetId);
    temp.save();
 
   const colTemp = await colModel.deleteMany({sheetId:sheetId});    
   const rowTemp = await rowModel.deleteMany({sheetId:sheetId});    

   res.status(200).json({"status":200,"message":"Sheet Deleted Successfully"});

   

   }catch(e)
   {    
       console.log(e);
       res.send(e);
   }

});



// get sheet list ( machine Id , sheetId , sheetTopic , sheetSetid)
router.get('/sheetList',async(req,res)=>{

  try{

   const machineId  = req.body.machineId ;

   const response = await sheetSetModel.aggregate([

           { $match :{machineId : machineId } },
           { $lookup :{
                from: 'sheets',
                localField: 'sheetSet',
                foreignField: '_id',
                as: 'Data'
           } },
         { $unwind:'$Data'},

  { $replaceRoot :{ newRoot :{
       $mergeObjects:["$Data","$$ROOT"  ]
   }} }
   ,

   { $project:{"sheetSetId":"$_id" , "sheetId":"$Data._id", 
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


// alternative
router.get('/sheetList1',async(req,res)=>{

  try{

   const machineId  = req.body.machineId ;

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

   { $project:{"sheetSetId":"$_id" , "sheetId":"$Data._id", 
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



router.get('/sheetData',async(req,res)=>{

  try{
 
   const sheetId = req.body.sheetId;
   const xposition = req.body.xposition;
   const yposition = req.body.yposition;

   const copyCheck = await sheetModel.findOne({_id:sheetId});

   if(copyCheck.parentSheetId == null)
   {
     const response = await sheetModel.aggregate([
 
      { $match :{ _id :ToId( sheetId) }},
      { $lookup :{

              from: 'columnschemas',
              localField: '_id',
              foreignField: 'sheetId',
              pipeline:[
                { $match : { xPosition :{ $lt : xposition} } },
                 { $sort : { xPosition : 1 } }
              ] ,
              as: 'ColData'

      }  },
      {   $unwind :{
        path :'$ColData', 
        preserveNullAndEmptyArrays: true}},
   
      { $project :{ _id:0  } }
     ,

     { $replaceRoot :{ 
      newRoot :{
       $mergeObjects:["$ColData","$$ROOT"  ]
     }
     }},

     { $lookup :{

              from: 'rowschemas',
              localField: '_id',
              foreignField: 'columnId',
              pipeline:[
                { $match : { yPosition :{ $lt : yposition} } },
                 { $sort : { yPosition : 1 } }
              ] ,
              as: 'RowData'

      }  },

      {   $unwind :{
        path :'$RowData', 
        preserveNullAndEmptyArrays: true}},
  
    { $project :{ _id:0  } },
    { $replaceRoot :{ 
        newRoot :{
        $mergeObjects:["$RowData","$$ROOT"  ]
      }
      }},

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

   }else{

   

  const response = await sheetModel.aggregate([
 
      { $match :{ _id :ToId( sheetId) }},
      { $lookup :{

              from: 'columnschemas',
              localField: 'parentSheetId',
              foreignField: 'sheetId',
              pipeline:[
                { $match : { xPosition :{ $lte : xposition} } },
                { $sort : { xPosition : 1 } }
              ] ,
              as: 'ColData'

      }  },
      {   $unwind :{
        path :'$ColData', 
        preserveNullAndEmptyArrays: true}},
   
      { $project :{ _id:0  } }
     ,

     { $replaceRoot :{ 
      newRoot :{
       $mergeObjects:["$ColData","$$ROOT"  ]
     }
     }},

     { $lookup :{

              from: 'rowschemas',
              localField: '_id',
              foreignField: 'columnId',
              pipeline:[
                { $match : { yPosition :{ $lte : yposition} } },
                { $sort : { yPosition : 1 } }
              ] ,
              as: 'RowData'

      }  },

      {   $unwind :{
        path :'$RowData', 
        preserveNullAndEmptyArrays: true}},
  
    { $project :{ _id:0  } },
    { $replaceRoot :{ 
        newRoot :{
        $mergeObjects:["$RowData","$$ROOT"  ]
      }
      }},

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


// column routes

// add column
router.post('/createColumn',async(req,res)=>{

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
router.post('/updateColumn',async(req,res)=>{

try{
    
 const colName = req.body.colName;
 const colId = req.body.colId;
 const role = req.body.role;   
 const xPosition = req.body.xPosition;

 const temp = await colModel.findOneAndUpdate({
     _id:colId
 },{
     colName:colName,
     role:role,
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
router.delete('/deleteColumn',async(req,res)=>{

try{
    

 const colId = req.body.colId;
 const role = req.body.role;   


 const temp = await colModel.deleteOne({
     _id:colId , role:role
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


// rows routes

// add row
router.post('/createRow',async(req,res)=>{

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
router.post('/updateRow',async(req,res)=>{

try{
    
 const colId = req.body.colId;
 const sheetId = req.body.sheetId;
 const yPosition = req.body.yPosition;
 const value =req.body.value;
 const rowId = req.body.rowId;

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
router.delete('/deleteRow',async(req,res)=>{

try{
    

 const rowId = req.body.rowId;


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
//Plan executor error during findAndModify :: caused by :: Performing an update on the path '_id' would modify the
//immutable field '_id'

// router.post('/createSheet',async(req,res)=>{

// try{



// }catch(e)
// {
//    console.log(e);
//    res.send(e.message);
// }

// });
