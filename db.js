const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017"


const connectToMOngoose = ()=>{
mongoose.connect(mongoURI,()=>{
    console.log("connect to mongoose");
})
}

module.exports = connectToMOngoose;