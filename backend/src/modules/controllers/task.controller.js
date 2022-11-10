const Data = require("../../db")
const fs = require("fs/promises")

module.exports.getAllData = async (_, res) => {
    try {
        const data = await fs.readFile("array.json", "utf-8")
        res.send({data})

    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

module.exports.createNewData = async (req, res) => {
    try {

        const { sortBy, sortDir, searchText, searchResult} = req.body

        await Data.updateOne({sortBy,sortDir,searchText}, {searchResult}, {upsert: true})
        res.send({data: {success: true}})

    } catch (err) {
        res.status(500).send({message: err.message})
    }
}
