const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");

// GET REQUEST
router.get("/SuppliersData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("1-Customers", { User: Decode, Title: "الموردين", Buttons: "TRUE", })
});

router.get("/SupplierFile-:id-:index", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("2-CustomerFile", { FileIndex: req.params.index, FileID: req.params.id, User: Decode, Title: "ملف المورد ", Buttons: "FALSE", })
});

router.get("/SuppliersReport", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("3-CustomersReport", { User: Decode, Title: "تقرير الموردين", Buttons: "FALSE", })
});

router.get("/SuppliersTimes", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("4-CustomersTimes", { User: Decode, Title: "مواعيد الدفع للموردين", Buttons: "FALSE", })
});

// POST Data AND GET Requst
router.post("/SuppliersData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Suppliers")
  if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push:
    {
      SuppliersData: {
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
        Text: "بإضافة مورد جديد", Icon: "bx bx-user-plus", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Save) })
    .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET Request
router.put("/SuppliersData:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Suppliers")
  if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ "SuppliersData._id": req.params.id },
    {
      "SuppliersData.$.Name": req.body.Name,
      "SuppliersData.$.City": req.body.City,
      "SuppliersData.$.Address": req.body.Address,
      "SuppliersData.$.Phone": req.body.Phone,
      "SuppliersData.$.Balance": req.body.Balance,
      "SuppliersData.$.BalanceType": req.body.BalanceType,
      "SuppliersData.$.CreatedBy": Decode.UserID,
      "SuppliersData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بتعديل بيانات مورد ", Icon: "bx bx-pencil", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Edit) })
    .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET Request
router.delete("/SuppliersData:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Suppliers")
  if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ "SuppliersData._id": req.params.id },
    {
      "SuppliersData.$.Status": "FALSE",
      "SuppliersData.$.CreatedBy": Decode.UserID,
      "SuppliersData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بحذف بيانات مورد ", Icon: "bx bx-trash", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Delete) })
    .catch((err) => { return res.json(Msg.Error) })
});

// **************************************************************
// POST Data AND GET Requst
router.post("/NewTimeSupplier", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "SuppliersTimes")
  if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push:
    {
      TimeSuppliersData: {
        Name: req.body.Name,
        DocDate: req.body.DocDate,
        Statment: req.body.Statment,
        Total: req.body.Total,
        CreatedBy: Decode.UserID,
        CreatedAt: new Date(),
      },
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بتحديد موعد دفع لمورد ", Icon: "bx bx-history", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Save) })
    .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET Request
router.put("/NewTimeSupplier:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "SuppliersTimes")
  if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ "TimeSuppliersData._id": req.params.id },
    {
      "TimeSuppliersData.$.Name": req.body.Name,
      "TimeSuppliersData.$.DocDate": req.body.DocDate,
      "TimeSuppliersData.$.Statment": req.body.Statment,
      "TimeSuppliersData.$.Total": req.body.Total,
      "TimeSuppliersData.$.CreatedBy": Decode.UserID,
      "TimeSuppliersData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بتعديل موعد دفع لمورد ", Icon: "bx bx-pencil", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Edit) })
    .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET Request
router.delete("/NewTimeSupplier:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "SuppliersTimes")
  if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne(
    { "TimeSuppliersData._id": req.params.id },
    { $pull: { TimeSuppliersData: { _id: req.params.id } } }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: `بحذف موعد دفع لمورد ${req.body.DocType} `, Icon: "bx bx-trash", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Delete) })
    .catch((err) => { return res.json(Msg.Error) })
});

module.exports = router;