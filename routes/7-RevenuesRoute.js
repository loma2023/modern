const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");

// GET REQUEST
router.get("/RevenuesData", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.render("14-Revenues", { User: Decode, Title: "الايرادات", Buttons: "TRUE", })
});

router.get("/RevenueFile-:id-:index", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.render("15-RevenueFile", { FileIndex: req.params.index, FileID: req.params.id, User: Decode, Title: "ملف الايراد ", Buttons: "FALSE", })
});

router.get("/RevenuesReport", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.render("16-RevenuesReport", { User: Decode, Title: "تقرير الايرادات", Buttons: "FALSE", })
});

// POST Data AND GET REQUEST
router.post("/RevenuesData", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Revenues")
    if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }
  
    await ModernUser.updateOne({ _id: Decode.ID }, {
        $push:
        {
            RevenuesData: {
                Name: req.body.Name,
                Type: req.body.Type,
                AmountType: req.body.AmountType,
                Amount: req.body.Amount,
                CreatedBy: Decode.UserID,
                CreatedAt: new Date(),
            },
            NotificationsData: {
                Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                Text: "بإضافة إيراد جديد", Icon: "bx bx-plus", CreatedAt: new Date(),
            },
        }
    })
        .then((Data) => { return res.json(Msg.Save) })
        .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET REQUEST
router.put("/RevenuesData:id", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Revenues")
    if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }
  
    await ModernUser.updateOne({ "RevenuesData._id": req.params.id },
        {
            "RevenuesData.$.Name": req.body.Name,
            "RevenuesData.$.Type": req.body.Type,
            "RevenuesData.$.AmountType": req.body.AmountType,
            "RevenuesData.$.Amount": req.body.Amount,
            "RevenuesData.$.CreatedBy": Decode.UserID,
            "RevenuesData.$.UpdatedAt": new Date(),
        }
    )
    await ModernUser.updateOne({ _id: Decode.ID }, {
        $push: {
            NotificationsData: {
                Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                Text: "بتعديل بيانات إيراد ", Icon: "bx bx-pencil", CreatedAt: new Date(),
            },
        }
    })
        .then((Data) => { return res.json(Msg.Edit) })
        .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET REQUEST
router.delete("/RevenuesData:id", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Revenues")
    if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }
  
    await ModernUser.updateOne({ "RevenuesData._id": req.params.id },
        {
            "RevenuesData.$.Status": "FALSE",
            "RevenuesData.$.CreatedBy": Decode.UserID,
            "RevenuesData.$.UpdatedAt": new Date(),
        }
    )
    await ModernUser.updateOne({ _id: Decode.ID }, {
        $push: {
            NotificationsData: {
                Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                Text: "بحذف بيانات إيراد ", Icon: "bx bx-trash", CreatedAt: new Date(),
            },
        }
    })
        .then((Data) => { return res.json(Msg.Delete) })
        .catch((err) => { return res.json(Msg.Error) })
});

module.exports = router;