const express = require("express");
const router = express.Router();
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Mailer = require('nodemailer');

const transporter = Mailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: "j t z s y v s j w a i v k y c s",
  }
});
require('dotenv').config()

const { RequireAuth, UnRequireAuth, CheckIfUser } = require("../middleware/middleware");
const Msg = require("../messages/Msg");
const ModernUser = require("../models/ModernSchema");
const Admin = require("../models/AdminSchema");

router.get("*", CheckIfUser);
router.post("*", CheckIfUser);
router.put("*", CheckIfUser);
router.delete("*", CheckIfUser);


router.get("/MainData.JSON", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  await ModernUser.findOne({ _id: Decode.ID })
    .then((MainData) => { res.json([MainData, Decode]) })
    .catch((err) => { return res.json(Msg.Error) })
});

router.get("/Home", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page === "Home")
  if (Decode.TypeUser === "User" && Permission.Show === false) {
    return res.render("0-HomeUser", { Title: "Home" });
  }

  await ModernUser.findOne({ _id: Decode.ID })
    .then((Data) => { res.render("0-Home", { MainData: Data, User: Decode, moment: moment, Title: "Home" }); })
    .catch((err) => { return res.json(Msg.Error) })
});

router.get("/CashBook", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page === "Cash")
  if (Decode.TypeUser === "User" && Permission.Show === false) { return res.redirect("/Permission"); }

  res.render("17-CashBook", { Title: "دفتر النقدية", Buttons: "FALSE" });
});

router.get("/SalesReport", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("19-SalesReport", { User: Decode, Title: "تقرير مبيعات", Buttons: "FALSE" });
});

router.get("/PurchasesReport", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  res.render("19-SalesReport", { User: Decode, Title: "تقرير مشتريات", Buttons: "FALSE" });
});

router.get("/Profits", RequireAuth, (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  let Permission = Decode.Permissions.find(item => item.Page == "Income")
  if (Decode.TypeUser === "User" && Permission.Show == false) { return res.redirect("/Permission"); }

  res.render("22-Profits", { User: Decode, Title: "قائمة الدخل", Buttons: "FALSE" });
});

router.put("/ReadNotification:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  await ModernUser.updateOne({ "NotificationsData._id": req.params.id },
    { $push: { "NotificationsData.$.ReadBy": { User: Decode.UserID, }, } })
    .then((Data) => { return res.json(Msg.Success) })
    .catch((err) => { return res.json(Msg.Error) })
});

router.delete("/DeleteNotification:id", RequireAuth, async (req, res) => {
  let Decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
  await HemayaUser.updateOne(
    { "NotificationsData._id": req.params.id },
    { $pull: { NotificationsData: { _id: req.params.id } } }
  )
});


router.get("/Error", (req, res) => {
  res.render("Auth/Error", { Title: "Error" });
});

router.get("/Error404", (req, res) => {
  res.render("Auth/Error", { Title: "Error 404" });
});

router.get("/Permission", (req, res) => {
  res.render("Auth/Error", { Title: "Permission" });
});

router.get("/SignOut", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/Login");
});




router.post("/SendMessage", async (req, res) => {
  try {
    const EmailObj = {
      from: req.body.Email,
      to: process.env.MY_EMAIL,
      subject: 'Verification Email',
      html: `${Msg.DesignGamilMsg}
      <div class="DetailsMsg">
          <p>${req.body.Name} : الاسم</p>
          <p>${req.body.Email} : الإميل</p>
          <p>:  الرسالة <br> ${req.body.Message} </p>
      </div></div></body></html>`
    };
    let SendMail = await transporter.sendMail(EmailObj)
    if (SendMail) { res.json(Msg.SendMsg); }
    else { res.json(Msg.NotSendMsg); }

    await Admin.updateOne({ Email: process.env.MY_EMAIL }, {
      $push:
      {
        MessagesData: {
          Name: req.body.Name,
          Email: req.body.Email,
          Message: req.body.Message,
          System: "MODERN",
          CreatedAt: new Date(),
        },
        NotificationsData: {
          Username: req.body.Name, ReadBy: [],
          Text: "ارسل لك رسالة", Icon: "bx bx-envelope", CreatedAt: new Date(),
        },
      }
    })
  }
  catch (err) { return res.json(Msg.Error) }
}
);


module.exports = router;