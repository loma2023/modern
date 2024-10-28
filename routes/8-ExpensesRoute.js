const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");

// GET REQUEST
router.get("/ExpensesData", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.render("14-Revenues", { User: Decode, Title: "المصاريف", Buttons: "TRUE", })
});

router.get("/ExpenseFile-:id-:index", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.render("15-RevenueFile", { FileIndex: req.params.index, FileID: req.params.id, User: Decode, Title: "ملف المصروف ", Buttons: "FALSE", })
});

router.get("/ExpensesReport", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.render("16-RevenuesReport", { User: Decode, Title: "تقرير المصاريف", Buttons: "FALSE", })
});

// POST Data AND GET REQUEST
router.post("/ExpensesData", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Expenses")
    if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }
  
    await ModernUser.updateOne({ _id: Decode.ID }, {
        $push:
        {
            ExpensesData: {
                Name: req.body.Name,
                Type: req.body.Type,
                AmountType: req.body.AmountType,
                Amount: req.body.Amount,
                CreatedBy: Decode.UserID,
                CreatedAt: new Date(),
            },
            NotificationsData: {
                Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                Text: "بإضافة مصروف جديد", Icon: "bx bx-plus", CreatedAt: new Date(),
            },
        }
    })
        .then((Data) => { return res.json(Msg.Save) })
        .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET REQUEST
router.put("/ExpensesData:id", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Expenses")
    if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

    await ModernUser.updateOne({ "ExpensesData._id": req.params.id },
        {
            "ExpensesData.$.Name": req.body.Name,
            "ExpensesData.$.Type": req.body.Type,
            "ExpensesData.$.AmountType": req.body.AmountType,
            "ExpensesData.$.Amount": req.body.Amount,
            "ExpensesData.$.CreatedBy": Decode.UserID,
            "ExpensesData.$.UpdatedAt": new Date(),
        }
    )
    await ModernUser.updateOne({ _id: Decode.ID }, {
        $push: {
            NotificationsData: {
                Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                Text: "بتعديل بيانات مصروف ", Icon: "bx bx-pencil", CreatedAt: new Date(),
            },
        }
    })
        .then((Data) => { return res.json(Msg.Edit) })
        .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET REQUEST
router.delete("/ExpensesData:id", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Expenses")
    if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

    await ModernUser.updateOne({ "ExpensesData._id": req.params.id },
        {
            "ExpensesData.$.Status": "FALSE",
            "ExpensesData.$.CreatedBy": Decode.UserID,
            "ExpensesData.$.UpdatedAt": new Date(),
        }
    )
    await ModernUser.updateOne({ _id: Decode.ID }, {
        $push: {
            NotificationsData: {
                Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                Text: "بحذف بيانات مصروف ", Icon: "bx bx-trash", CreatedAt: new Date(),
            },
        }
    })
        .then((Data) => { return res.json(Msg.Delete) })
        .catch((err) => { return res.json(Msg.Error) })
});

module.exports = router;