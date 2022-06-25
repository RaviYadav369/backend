const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        unique: true
    },
    tag:{
        type:String,
        
    },
    date:{
        type:String,
        default:Date.now
    }
});

module.exports = mongoose.model('notes',NotesSchema);