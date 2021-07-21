const { Schema ,model  } = require('mongoose');

const sheetScheama = new Schema({
// _id   becomes its primary key 
   machineId:{
        type:String
   },
   sheetSet :[
      { 
         type:Schema.Types.ObjectId ,
          ref:'Sheet' 
      }
    ]

});

module.exports  = model('sheetCollection',machineScheama);

