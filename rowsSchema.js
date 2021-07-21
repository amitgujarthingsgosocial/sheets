
const { Schema ,model  } = require('mongoose');


const rowScheama = new Schema({

// _id   becomes its primary key like (rowId)
    value:{
        type:String
    },
    columnId:{ 
        type:Schema.Types.ObjectId , 
        ref:'ColsCollection'
    },
    sheetId:{
        type:Schema.Types.ObjectId,
        ref:'SheetsCollection'
    }

});

module.exports  = model('RowsCollection',rowScheama);





