const express = require('express');
const router = express.Router();
module.exports = router;

const topics_Mid = require("../middleware/topics_Mid");

router.post("/Add", [topics_Mid.AddItem], (req, res) => {
    if(res.ok)
        res.status(200).json({message:"OK", Last_Id:res.insertId});
    else
        return res.status(500).json({message: res.err});
});

router.put("/Update/:id", [topics_Mid.UpdateItem], (req, res) => {
    if(res.ok)
        res.status(200).json({message:"OK"});
    else
        return res.status(500).json({message: res.err});
});

router.delete("/Delete", [topics_Mid.DeleteItem], (req, res) => {
    if(res.ok)
        res.status(200).json({message:"OK"});
    else
        return res.status(500).json({message: res.err});
});

router.get("/List", [topics_Mid.GetAllItems], (req, res) => {
    if(res.ok) {
        res.status(200).json(req.ItemsData);
    }
    else
        return res.status(500).json({message: res.err});
});