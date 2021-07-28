
const mongoose = require('mongoose');

const SheetSetSchema = mongoose.Schema({

 machineId:{
     type:String
 },
 sheetSet:[
     { 
          type:mongoose.Schema.Types.ObjectId,
          ref:'Sheet'
      }
 ]


});


module.exports = mongoose.model("SheetSet",SheetSetSchema);





