const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");

// GET REQUEST
router.get("/CustomersData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("1-Customers", { User: Decode, Title: "العملاء", Buttons: "TRUE", })
});

router.get("/CustomerFile-:id-:index", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("2-CustomerFile", { FileIndex: req.params.index, FileID: req.params.id, User: Decode, Title: "ملف العميل ", Buttons: "FALSE", })
});

router.get("/CustomersReport", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("3-CustomersReport", { User: Decode, Title: "تقرير العملاء", Buttons: "FALSE", })
});

router.get("/CustomersTimes", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("4-CustomersTimes", { User: Decode, Title: "مواعيد التحصيل من العملاء", Buttons: "FALSE", })
});

// POST Data AND GET REQUEST
router.post("/CustomersData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Customers")
  if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push:
    {
      CustomersData: {
        Name: req.body.Name,
        City: req.body.City,
        Address: req.body.Address,
        Phone: req.body.Phone,
        Balance: req.body.Balance,
        BalanceType: req.body.BalanceType,
        CreatedBy: Decode.UserID,
        CreatedAt: new Date(),
      },
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بإضافة عميل جديد", Icon: "bx bx-user-plus", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Save) })
    .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET REQUEST
router.put("/CustomersData:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Customers")
  if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ "CustomersData._id": req.params.id },
    {
      "CustomersData.$.Name": req.body.Name,
      "CustomersData.$.City": req.body.City,
      "CustomersData.$.Address": req.body.Address,
      "CustomersData.$.Phone": req.body.Phone,
      "CustomersData.$.Balance": req.body.Balance,
      "CustomersData.$.BalanceType": req.body.BalanceType,
      "CustomersData.$.CreatedBy": Decode.UserID,
      "CustomersData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بتعديل بيانات عميل", Icon: "bx bx-pencil", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Edit) })
    .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET REQUEST
router.delete("/CustomersData:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Customers")
  if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ "CustomersData._id": req.params.id },
    {
      "CustomersData.$.Status": "FALSE",
      "CustomersData.$.CreatedBy": Decode.UserID,
      "CustomersData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بحذف بيانات عميل", Icon: "bx bx-trash", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Delete) })
    .catch((err) => { return res.json(Msg.Error) })
});

// **************************************************************
// POST Data AND GET REQUEST
router.post("/NewTimeCustomer", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "CustomersTimes")
  if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push:
    {
      TimeCustomersData: {
        Name: req.body.Name,
        DocDate: req.body.DocDate,
        Statment: req.body.Statment,
        Total: req.body.Total,
        CreatedBy: Decode.UserID,
        CreatedAt: new Date(),
      },
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بتحديد موعد تحصيل من عميل", Icon: "bx bx-history", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Save) })
    .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET Request
router.put("/NewTimeCustomer:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "CustomersTimes")
  if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ "TimeCustomersData._id": req.params.id },
    {
      "TimeCustomersData.$.Name": req.body.Name,
      "TimeCustomersData.$.DocDate": req.body.DocDate,
      "TimeCustomersData.$.Statment": req.body.Statment,
      "TimeCustomersData.$.Total": req.body.Total,
      "TimeCustomersData.$.CreatedBy": Decode.UserID,
      "TimeCustomersData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بتعديل موعد تحصيل من عميل", Icon: "bx bx-pencil", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Edit) })
    .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET Request
router.delete("/NewTimeCustomer:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "CustomersTimes")
  if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne(
    { "TimeCustomersData._id": req.params.id },
    { $pull: { TimeCustomersData: { _id: req.params.id } } }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: `بحذف موعد تحصيل من عميل`, Icon: "bx bx-trash", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Delete) })
    .catch((err) => { return res.json(Msg.Error) })
});

module.exports = router;