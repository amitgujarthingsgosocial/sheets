const mongoose = require("mongoose");

const SheetStoreSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
    },

    headings: [{
        type: mongoose.Schema.Types.Mixed,
        default: ""
    }],
    rows: [{
        type: mongoose.Schema.Types.Mixed,
        default: ""
    }]



});

module.exports = mongoose.model("SheetStore", SheetStoreSchema);