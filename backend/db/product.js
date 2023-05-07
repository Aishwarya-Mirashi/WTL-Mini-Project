const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    arttype : String,
    artistname: String,
    image : String,
    email:String,
    file:String
});
 
module.exports = mongoose.model("products",productSchema);