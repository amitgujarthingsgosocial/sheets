
const { Schema ,model  } = require('mongoose');


const colScheama = new Schema({
// _id   becomes its primary key like (colId)
   colName:{
       type:String
   },
   sheetId:{
     type:Schema.Types.ObjectId,
     ref:'SheetsCollection'
   }

}, { timestamps: true });

module.exports  = model('ColsCollection',colScheama);

