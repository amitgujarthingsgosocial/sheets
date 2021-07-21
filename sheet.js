

const { Schema ,model  } = require('mongoose');


const sheet = new Schema({
// _id   becomes its primary key like (colId)

   machineId:{
     type:Schema.Types.ObjectId,
     ref:'SheetCollection'
   },
   sheetTopic:{
     type:String
   }


}, { timestamps: true });

module.exports  = model('Sheet',sheet);

