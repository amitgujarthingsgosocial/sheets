const { Schema ,model  } = require('mongoose');

const machineScheama = new Schema({
// _id   becomes its primary key like (sheetId)
   machineId:{
        type:Schema.Types.ObjectId,
        required:true
   },
   sheetSet :[{ type:Schema.Types.ObjectId , ref:'ColsCollection' }]

});

module.exports  = model('MachineCollection',machineScheama);

