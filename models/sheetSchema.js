
const mongoose = require('mongoose');

const SheetSchema = mongoose.Schema({

  sheetId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'SheetSet'
  },
  sheetTopic:{
      type:String
  },
  parentSheetId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'Sheet'
  }


},{ timestamps: true });


module.exports = mongoose.model("Sheet",SheetSchema);





