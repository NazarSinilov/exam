const Search = require("../../db")
const fs = require("fs/promises")

module.exports.getAllData = async (_, res) => {

    try {
        const allData = await fs.readFile("array.json", "utf-8")
        res.send({data: allData})

    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

module.exports.createNewData = async (req, res) => {

    try {
        const {sortBy, sortDir, searchText, searchResult} = req.body
        await Search.updateOne({sortBy, sortDir, searchText} , {searchResult}, {upsert: true})
        res.send({data: {success: true}})

    } catch (err) {
        res.status(500).send({success: false})
    }
}

