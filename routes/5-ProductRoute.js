const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()

const { RequireAuth } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");

// GET REQUEST
router.get("/ProductsData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("5-Products", { User: Decode, Title: "قائمة المنتجات", Buttons: "TRUE", })
});

router.get("/ProductFile-:id-:index", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("6-ProductFile", { FileIndex: req.params.index, FileID: req.params.id, User: Decode, Title: "كشف حركة منتج", Buttons: "FALSE", })
});

router.get("/ProductsList", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("7-ProductsList", { User: Decode, Title: "قائمة الاسعار", Buttons: "FALSE", })
});

router.get("/ProductsOut", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("8-ProductsOut", { User: Decode, Title: "نواقص المنتجات", Buttons: "FALSE", })
});

router.get("/PoductsReport", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("9-PoductsReport", { User: Decode, Title: "تقرير حركة المخزن", Buttons: "FALSE", })
});

// POST AND GET Requst
router.post("/ProductsData", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Products")
  if (Decode.TypeUser === "User" && Permission.Add == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push:
    {
      ProductsData: {
        Name: req.body.Name,
        Barcode: req.body.Barcode,
        MinQty: req.body.MinQty,
        Balance: req.body.Balance,
        Units: req.body.Units,
        CreatedBy: Decode.UserID,
        CreatedAt: new Date(),
      },
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بإضافة منتج جديد", Icon: "bx bx-plus", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Save) })
    .catch((err) => { return res.json(Msg.Error) })
});

// EDIT AND GET Request
router.put("/ProductsData:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Products")
  if (Decode.TypeUser === "User" && Permission.Edit == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne(
    { "ProductsData._id": req.params.id },
    {
      "ProductsData.$.Name": req.body.Name,
      "ProductsData.$.Barcode": req.body.Barcode,
      "ProductsData.$.MinQty": req.body.MinQty,
      "ProductsData.$.Balance": req.body.Balance,
      "ProductsData.$.Units": req.body.Units,
      "ProductsData.$.CreatedBy": Decode.UserID,
      "ProductsData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بتعديل بيانات منتج ", Icon: "bx bx-pencil", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Edit) })
    .catch((err) => { return res.json(Msg.Error) })
});

// DELETE AND GET Request
router.delete("/ProductsData:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Products")
  if (Decode.TypeUser === "User" && Permission.Delete == false) { return res.json(Msg.Permission); }

  await ModernUser.updateOne({ "ProductsData._id": req.params.id },
    {
      "ProductsData.$.Status": "FALSE",
      "ProductsData.$.CreatedBy": Decode.UserID,
      "ProductsData.$.UpdatedAt": new Date(),
    }
  )
  await ModernUser.updateOne({ _id: Decode.ID }, {
    $push: {
      NotificationsData: {
        Username: Decode.UserID, ReadBy: [{ User: Decode.UserID }],
        Text: "بحذف بيانات منتج ", Icon: "bx bx-trash", CreatedAt: new Date(),
      },
    }
  })
    .then((Data) => { return res.json(Msg.Delete) })
    .catch((err) => { return res.json(Msg.Error) })
});


module.exports = router;