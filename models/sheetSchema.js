const mongoose = require("mongoose");

const SheetSchema = mongoose.Schema({


    orgId: {
        type: String,
        required: true
    },

    sheets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SheetStore',
        required: true
    }]

});


module.exports = mongoose.model("Sheets", SheetSchema);