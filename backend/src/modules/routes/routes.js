const express = require("express")
const router = express.Router();

const {
    getAllData,
    createNewData
} = require("../controllers/task.controller")

router.get("/all/data", getAllData)
router.post("/data", createNewData)

module.exports = router