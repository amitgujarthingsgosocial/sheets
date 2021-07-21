const { Schema ,model  } = require('mongoose');

const sheetScheama = new Schema({
// _id   becomes its primary key 
   machineId:{
        type:String
   },
   sheetSet :[
      { 
         sheetId:{ 
         type:Schema.Types.ObjectId ,
         ref:'Sheet' 
      },

      Topic:String
      
       }
    ]

});

module.exports  = model('sheetCollection',sheetScheama);

