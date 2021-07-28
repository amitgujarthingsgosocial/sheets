
const mongoose = require('mongoose');

const ColumnSchema = mongoose.Schema({

 sheetId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Sheet'
 },
 colName:{
     type:String
 },
 xPosition:{
     type:Number
 },
 role:{
     type:String,
     enum:['manager','worker']
 }

});


module.exports = mongoose.model("ColumnSchema",ColumnSchema);





