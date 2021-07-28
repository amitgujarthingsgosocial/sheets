
const mongoose = require('mongoose');

const RowSchema = mongoose.Schema({

 sheetId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Sheet'
 },
 columnId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'ColumnSchema'
 },
 value:{
     type:String
 },
 yPosition:{
     type:Number
 }


});


module.exports = mongoose.model("RowSchema",RowSchema);





