const mongoose = require('mongoose');
const {Schema} = mongoose

const dataScheme = new Schema({
    sortBy : String,
    sortDir : String,
    searchText: String,
    searchResult: String
})

module.exports = Data = mongoose.model("data", dataScheme)
