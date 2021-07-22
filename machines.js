const express = require("express");
const router = express.Router();
const httpErrors = require('http-errors');
const { findOneAndDelete } = require("../Models1/sheet");
const mongoose = require('mongoose');

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

/*/////////////////////  sheetSchema routes ///////////////////*/


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

  const colTemp = await colsModel.deleteMany({sheetId:sheetId});    
  const rowTemp = await rowsModel.deleteMany({sheetId:sheetId});    

  res.status(200).json({"status":200,"message":"Sheet Deleted Successfully"});

}catch(e)
{
   res.send(e);
}

});


// select all columns and rows asscoiated with sheet id
router.get('/getSheetData',async(req,res)=>{

   try{
    
    console.log('aaaaaaaaaaaaa');
    const id = mongoose.Types.ObjectId("60f9351bd5a20e05a487173e");

    const tif = mongoose.Types.ObjectId("60f940adef1ce81ec0e6c285");

    const temp = await colsModel.find({sheetId:id}).
         populate('rows.rawData');




      res.send(temp);

   }catch(e)
  {
    res.send(e);
  }


});


/*/////////////////////  column routes ///////////////////*/

// add column
router.post('/column/addColumn',async(req,res,next)=>{

  try{

  
     const data = { 
          colName:req.body.colName ,
          sheetId : req.body.sheetId
       };

     const columnData = await colsModel.create(data);
     console.log(columnData);
     res.send(columnData);

  }catch(e)
  {
      res.send(e);
  }

});

// delete column
router.delete('/column/deleteColumn',async(req,res,next)=>{

  try{

  
    const columnId = req.body.columnId;
      

     const columnData = await colsModel.findByIdAndDelete(columnId);
     console.log(columnData);
     res.status(200).json({
            "status":200,
            "message":"Column deleted successfully"
         });

  }catch(e)
  {
      res.send(e);
  }

});

// update column
router.patch('/column/updateColumn',async(req,res,next)=>{

  try{
        const  colName = req.body.colName;
        const  columnId = req.body.columnId;
    
        const columnData = await colsModel.findByIdAndUpdate(columnId,{
          colName:colName
        },{new:true});
        console.log(columnData);
        res.send(columnData);

  }catch(e)
  {
      res.send(e);
  }

});

// get all column asscociated with sheet
router.get('/column/getAll',async(req,res)=>{

  try{
  
     const sheetId = req.body.sheetId;
     const columnData = await colsModel.find({sheetId:sheetId}).lean() ;
     console.log(columnData);
     res.send(columnData);

  }catch(e)
  {
      res.send(e);
  }

});




/*/////////////////////  rows routes ///////////////////*/

// add row
router.post('/row/addRow',async(req,res,next)=>{

  try{
  
     const data = { 
          columnId:req.body.columnId ,
          sheetId : req.body.sheetId,
          value:req.body.value
       };
     const Id = mongoose.Types.ObjectId(req.body.columnId);
     const rowsData = await rowsModel.create(data);
    
     const rid = mongoose.Types.ObjectId(rowsData._id);

    const colsData = await colsModel.findById(Id);
    colsData.rows.push({rawData:rid});
    colsData.save();

     res.send(colsData);

  }catch(e)
  {
      res.send(e);
  }

});

// delete row
router.delete('/row/deleteRow',async(req,res,next)=>{

  try{

  
    const rowId = req.body.rowId;
      

     const rowData = await colsModel.findByIdAndDelete(rowId);
     console.log(rowData);
     res.status(200).json({
            "status":200,
            "message":"Row deleted successfully"
         });

  }catch(e)
  {
      res.send(e);
  }

});

// update row
router.patch('/row/updateRow',async(req,res,next)=>{

  try{
        const  value = req.body.value;
        const  rowId = req.body.rowId;
    
        const rowsData = await rowsModel.findByIdAndUpdate(rowId,{
          value:value
        },{new:true});
        console.log(rowsData);
        res.send(rowsData);

  }catch(e)
  {
      res.send(e);
  }

});

// get all row asscociated with sheet and column
router.get('/row/getAll',async(req,res,next)=>{

  try{
  
     const sheetId = req.body.sheetId;
     const columnId = req.body.columnId;

     const rowsData = await rowsModel.find({columnId:columnId ,sheetId:sheetId});
     console.log(rowsData);
     res.send(rowsData);

  }catch(e)
  {
      res.send(e);
  }

});






module.exports = router;



//      try{

//      const temp = await sheetSchemaModel.aggregate([


//            {
//             $match:{ machineId :"2" }
//            }  ,
//            {
//                 $lookup : { 
//                     from: 'sheets',
//                     localField: 'sheets',
//                     foreignField: 'sheetId',
//                     as: 'Sheets',
   

//                      }
       
//           },
          
//           {
//               $project:{
//                 "Sheets.sheetTopic":1,
//                 "Sheets._id":1,
//                 "Sheets.machineId":1
//                       }
//           }
//           ,
//             {
//               $project:{
//                   Sheets:{
//                       $filter :{
//                           input :"$Sheets",
//                           as :"item",
//                           cond:{
//                             $and: [
//                         {$eq: ["$$item.machineId", "2"]},
//                         {$eq: ["$$item.machineId", "2"]}
//                                   ]
//                              }
                      
//                       }
//                   ,
            
                  
//                   } 
//               ,"machineId":1
//               }
//           }
//      ]);
        
//   res.send(temp);

//      }catch(e)
//      {

//        res.send(e);

//      }



// // GET ALL sheets by machineId
// router.get('/get',async(req,res)=>{

//      try{

//      const temp = await sheetSchemaModel.aggregate([


//            {
//             $match:{ machineId :"2" }
//            }  ,
//            {
//                 $lookup : { 
//                     from: 'sheets',
//                     localField: 'sheets',
//                     foreignField: 'sheetId',
//                     as: 'Sheets',
//                         }
       
//           },
          
//           {
//               $project:{
//                 "Sheets.sheetTopic":1,
//                 "Sheets._id":1,
//                 "Sheets.machineId":1
//                       }
//           }
//           ,
//             {
//               $project:{
//                   Sheets:{
//                       $filter :{
//                           input :"$Sheets",
//                           as :"item",
//                           cond:{
//                             $and: [
//                         {$eq: ["$$item.machineId", "2"]},
//                         {$eq: ["$$item.machineId", "2"]}
//                                   ]
//                              }
                      
//                       }
//                   ,
            
                  
//                   } 
//               ,"machineId":1
//               }
//           }
//      ]);
        
//   res.send(temp);

//      }catch(e)
//      {

//        res.send(e);

//      }

// });


// // add multiple columns
// router.post('/addColumn',async(req,res,next)=>{

//   try{

//       const data = req.body.data;
//      const columnData = await colsModel.create(data);
//      console.log(columnData);
//       res.send(columnData);

//   }catch(e)
//   {
//       res.send(e);
//   }

// });




