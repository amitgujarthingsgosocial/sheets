

const { Schema ,model  } = require('mongoose');


const sheetScheama = new Schema({
// _id   becomes its primary key like (colId)

   machineId:{
     type:Schema.Types.ObjectId,
     ref:'MachineCollection'
   },
   columnId:{
     type:Schema.Types.ObjectId,
     ref:'ColumnCollection'
   },
    rowsId:{
     type:Schema.Types.ObjectId,
     ref:'RowsCollection'
   }


}, { timestamps: true });

module.exports  = model('SheetCollection',sheetScheama);

