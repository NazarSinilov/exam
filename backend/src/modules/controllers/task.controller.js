const Search = require("../../db/modules/task/index")
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
        const item = await Search.updateOne({sortBy, sortDir, searchText} , {searchResult})
        if (!item) {
            await Search.create({sortBy, sortDir, searchText, searchResult})
        }
        res.send({data: {success: true}})
    } catch (err) {
        res.status(500).send({success: false})
    }
}

