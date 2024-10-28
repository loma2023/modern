const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");

// GET REQUEST
router.get("/UsersData", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    res.render("20-Users", { User: Decode, Title: "المستخدمين", Buttons: "TRUE", })
});

// POST Data AND GET REQUEST
router.post("/UsersData", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Users")
    if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }

    let isCurrentEmail;
    try {
        isCurrentEmail = await ModernUser.findOne({ Email: req.body.Email });
        if (isCurrentEmail) { return res.json(Msg.ExistEmail); }
        if (!isCurrentEmail) {
            isCurrentEmail = await ModernUser.findOne({ "UsersData.Email": req.body.Email })
            if (isCurrentEmail) { return res.json(Msg.ExistEmail); }
        }
        let HashedPassword = bcrypt.hashSync(req.body.Password, 10)

        await ModernUser.updateOne({ _id: Decode.ID }, {
            $push:
            {
                UsersData: {
                    Username: req.body.Name,
                    Email: req.body.Email,
                    Phone: req.body.Phone,
                    Password: HashedPassword,
                    Permissions: req.body.Permissions,
                    VoiceMessage: "false",
                    Notifications: "true",
                    DarkMood: "false",
                    CreatedBy: Decode.UserID,
                    CreatedAt: new Date(),
                },
                NotificationsData: {
                    Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                    Text: "بإضافة مستخدم جديد", Icon: "bx bx-user-plus", CreatedAt: new Date(),
                },
            }
        })
            .then((Data) => { return res.json(Msg.Save) })
            .catch((err) => { return res.json(Msg.Error) })
    }
    catch (err) { return res.json(Msg.Error) }
});

// EDIT AND GET REQUEST
router.put("/UsersData:id", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Users")
    if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

    let isCurrentEmail;
    try {
        if (req.body.Status === "ChangeEmail") {
            isCurrentEmail = await ModernUser.findOne({ Email: req.body.Email });
            if (isCurrentEmail) { return res.json(Msg.ExistEmail); }
            if (!isCurrentEmail) {
                isCurrentEmail = await ModernUser.findOne({ "UsersData.Email": req.body.Email })
                if (isCurrentEmail) { return res.json(Msg.ExistEmail); }
            }
        }
        let HashedPassword = bcrypt.hashSync(req.body.Password, 10)

        await ModernUser.updateOne({ "UsersData._id": req.params.id },
            {
                "UsersData.$.Username": req.body.Name,
                "UsersData.$.Email": req.body.Email,
                "UsersData.$.Phone": req.body.Phone,
                "UsersData.$.Password": HashedPassword,
                "UsersData.$.Permissions": req.body.Permissions,
                "UsersData.$.CreatedBy": Decode.UserID,
                "UsersData.$.UpdatedAt": new Date(),
            }
        )
        await ModernUser.updateOne({ _id: Decode.ID }, {
            $push: {
                NotificationsData: {
                    Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                    Text: "بتعديل بيانات مستخدم ", Icon: "bx bx-pencil", CreatedAt: new Date(),
                },
            }
        })
            .then((Data) => { return res.json(Msg.Edit) })
            .catch((err) => { return res.json(Msg.Error) })
    }
    catch (err) { return res.json(Msg.Error) }
});

// DELETE AND GET REQUEST
router.delete("/UsersData:id", RequireAuth, async (req, res) => {
    let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
    let Permission = Decode.Permissions.find(item => item.Page == "Users")
    if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

    await ModernUser.updateOne({ "UsersData._id": req.params.id },
        {
            "UsersData.$.Status": "FALSE",
            "UsersData.$.CreatedBy": Decode.UserID,
            "UsersData.$.UpdatedAt": new Date(),
        }
    )
    await ModernUser.updateOne({ _id: Decode.ID }, {
        $push: {
            NotificationsData: {
                Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
                Text: "بحذف بيانات مستخدم ", Icon: "bx bx-trash", CreatedAt: new Date(),
            },
        }
    })
        .then((Data) => { return res.json(Msg.Delete) })
        .catch((err) => { return res.json(Msg.Error) })
});

module.exports = router;