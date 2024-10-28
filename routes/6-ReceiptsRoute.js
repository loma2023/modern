const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");

// GET REQUEST
router.get("/Receipt:Type", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Title
  if (req.params.Type === "Sales") { Title = "فاتورة مبيعات" }
  else if (req.params.Type === "Purchases") { Title = "فاتورة مشتريات" }
  else { res.render("Auth/Error", { User: Decode, Title: "Error", Buttons: "FALSE", }); return };

  await ModernUser.findOne({ _id: Decode.ID })
    .then((Data) => { res.render("10-Receipts", { MainData: Data, User: Decode, Title: Title, Buttons: "FALSE", }); })
    .catch((err) => { return res.json(Msg.Error) })
});

router.get("/EditReceipt-:Type-:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Title
  if (req.params.Type === "Sales") { Title = "فاتورة مبيعات" }
  else if (req.params.Type === "Purchases") { Title = "فاتورة مشتريات" }
  else { res.render("Auth/Error", { User: Decode, Title: "Error", Buttons: "FALSE", }); return };

  await ModernUser.findOne({ _id: Decode.ID })
    .then((Data) => { res.render("11-EditReceipt", { FileID: req.params.id, MainData: Data, User: Decode, Title: Title, Buttons: "FALSE", }); })
    .catch((err) => { return res.json(Msg.Error) })
});

router.get("/AllReceipts", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("12-AllReceipts", { User: Decode, Title: "الفواتير", Buttons: "FALSE", })
});

router.get("/CollectsData", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("18-Collects", { User: Decode, Title: "سندات القبض والدفع", Buttons: "FALSE", })
});

router.get("/ShowReceipt:id", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("13-ShowReceipt", { FileID: req.params.id, User: Decode, Title: "الفاتورة", Buttons: "FALSE", })
});

// POST AND GET Requst
router.post("/GeneralData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Receipts")
  if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }

  let Type = "فاتورة " + req.body.DocType + " جديدة"
  if (req.body.DocType.includes("سند")) { Type = req.body.DocType + " جديد" }

  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push:
    {
      GeneralData: {
        DocNu: req.body.DocNu,
        DocType: req.body.DocType,
        TypeAmount: req.body.TypeAmount,
        DocDate: req.body.DocDate,
        Name: req.body.Name,
        Statment: req.body.Statment,
        Debit: req.body.Debit,
        Credit: req.body.Credit,
        SubDebit: req.body.SubDebit,
        SubCredit: req.body.SubCredit,
        Total: req.body.Total,
        SubTotal: req.body.SubTotal,
        Discount: req.body.Discount,
        Products: req.body.Products,
        CreatedBy: Decode.UserID,
        CreatedAt: new Date(),
      },
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: `بإضافة ${Type}`, Icon: "bx bx-plus", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Save) })
    .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET Request
router.put("/GeneralData:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Receipts")
  if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

  let Type = "فاتورة " + req.body.DocType
  if (req.body.DocType.includes("سند")) { Type = req.body.DocType }

  await ModernUser.updateOne(
    { "GeneralData._id": req.params.id },
    {
      "GeneralData.$.DocNu": req.body.DocNu,
      "GeneralData.$.DocType": req.body.DocType,
      "GeneralData.$.TypeAmount": req.body.TypeAmount,
      "GeneralData.$.DocDate": req.body.DocDate,
      "GeneralData.$.Name": req.body.Name,  //
      "GeneralData.$.Statment": req.body.Statment,
      "GeneralData.$.Debit": req.body.Debit,
      "GeneralData.$.Credit": req.body.Credit,
      "GeneralData.$.SubDebit": req.body.SubDebit,
      "GeneralData.$.SubCredit": req.body.SubCredit,
      "GeneralData.$.Total": req.body.Total,
      "GeneralData.$.SubTotal": req.body.SubTotal,
      "GeneralData.$.Discount": req.body.Discount,
      "GeneralData.$.Products": req.body.Products,
      "GeneralData.$.CreatedBy": Decode.UserID,
      "GeneralData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: `بتعديل ${Type}`, Icon: "bx bx-pencil", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Edit) })
    .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET Request
router.delete("/GeneralData-:DocType-:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Receipts")
  if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

  let Type = "فاتورة " + req.params.DocType
  if (req.params.DocType.includes("سند")) { Type = req.params.DocType }

  await ModernUser.updateOne(
    { "GeneralData._id": req.params.id },
    { $pull: { GeneralData: { _id: req.params.id } } }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: `بحذف ${Type} `, Icon: "bx bx-trash", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Delete) })
    .catch((err) => { return res.json(Msg.Error) })
});

module.exports = router;