const mongoose = require('mongoose');
const {Schema} = mongoose

const searchScheme = new Schema({
    sortBy : String,
    sortDir : String,
    searchText : String,
    searchResult : String
})

module.exports = Search = mongoose.model("search", searchScheme)
