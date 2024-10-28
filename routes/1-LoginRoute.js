const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
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
const ModernUser = require("../models/ModernSchema");
const Msg = require("../messages/Msg");

router.get("/", UnRequireAuth, (req, res) => {
  res.render("Auth/Login", { Title: "Login" });
});

router.get("/Login", UnRequireAuth, (req, res) => {
  res.render("Auth/Login", { Title: "Login" });
});

router.get("/Activation", (req, res) => {
  res.render("Auth/Activation", { Title: "Activation" });
});

router.get("/ForgotPassword", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.render("Auth/ForgotPassword", { Title: "ForgotPassword" })
})

router.post("/Login", async (req, res) => {
  let CheckUser, UserData, TypeUser, Permissions = [];
  try {
    CheckUser = await ModernUser.findOne({ Email: req.body.Email });
    if (CheckUser) { TypeUser = "Owner"; UserData = CheckUser }
    if (!CheckUser) {
      CheckUser = await ModernUser.findOne({ "UsersData.Email": req.body.Email })
      if (CheckUser) { TypeUser = "User"; UserData = CheckUser.UsersData.find((item) => { return item.Email == req.body.Email; }) }
      if (!CheckUser) {
        return res.json(Msg.WrongEmail)
      }
    }
    const match = await bcrypt.compare(req.body.Password, UserData.Password);
    if (!match) { return res.json(Msg.WrongEmail); }
    if (TypeUser === "User") { Permissions = UserData.Permissions }
    let Code = {
      ID: CheckUser._id,
      UserID: UserData._id,
      Username: UserData.Username,
      Email: UserData.Email,
      Phone: UserData.Phone,
      Address: UserData.Address,
      Password: UserData.Password,
      VoiceMessage: UserData.VoiceMessage,
      Notifications: UserData.Notifications,
      DarkMood: UserData.DarkMood,
      TypeUser: TypeUser,
      Permissions: Permissions,
      DollarKey: process.env.DOLLAR_KEY,
    }

    let MaxAgeValue = 14;  // Latter
    if (CheckUser.Plan === "Month") { MaxAgeValue = 30 }
    if (CheckUser.Plan === "Year") { MaxAgeValue = 360 }
    if (CheckUser.Plan === "Lifetime") { MaxAgeValue = 1000000 }

    let MaxAge = Math.floor((new Date() - new Date(CheckUser.ActivedAt)) / 86400000)
    if (MaxAge >= MaxAgeValue) { return res.json(Msg.MaxAge) }

    let Diff = MaxAgeValue - MaxAge
    if (Diff <= 2) {
      ModernUser.updateOne({ _id: CheckUser._id }, {
        $push: {
          NotificationsData: {
            Username: "تذكير بموعد الاشتراك", Text: `متبقي علي موعد دفع الاشتراك ${Diff} يوم`, Icon: "bx bx-calendar", CreatedAt: new Date(),
          },
        }
      })
        .catch((err) => { return res.json(Msg.Error) })
    }

    let token = jwt.sign(Code, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json(Msg.Success)
  }
  catch (err) { return res.json(Msg.Error) }

});

// Create Random Code and Sent Email then redirect to ResetPassword
let ForgotObj = { ID: "", }
router.post("/ForgotPassword", async (req, res) => {
  let CheckUser; let TypeUser; let UserData; let CodeTxt = '';
  try {
    CheckUser = await ModernUser.findOne({ Email: req.body.Email });
    if (CheckUser) { TypeUser = "Owner"; UserData = CheckUser; }
    if (!CheckUser) {
      CheckUser = await ModernUser.findOne({ "UsersData.Email": req.body.Email })
      if (CheckUser) { TypeUser = "User"; UserData = CheckUser.UsersData.find((item) => { return item.Email == req.body.Email; }) }
      if (!CheckUser) {
        return res.json(Msg.WrongEmail)
      }
    }

    const hexString = "0123456789"
    for (let i = 0; i < 6; i++) {
      CodeTxt += hexString[Math.floor(Math.random() * hexString.length)]
    }
    const EmailObj = {
      from: req.body.Email,
      to: req.body.Email,
      subject: 'Verification Email',
      html: `${Msg.DesignGamilMsg}
      <div class="DetailsMsg">
          <p>عزيزي ${UserData.Username}</p>
          <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك</p>
          <p>أدخل رمز إعادة تعيين كلمة المرور التالي</p>
          <h3>${CodeTxt}</h3>
      </div>
      <div class="Note">
            <span>اذا لم تكن انت تجاهل ذلك !</span>
        </div>
      </div></body></html>`
    };

    let SendMail = await transporter.sendMail(EmailObj)
    if (SendMail) {
      ForgotObj = {
        ID: UserData._id,
        CodeTxt: CodeTxt,
        TypeUser: TypeUser,
      }
      console.log(CodeTxt)
      res.json(Msg.SendMail);
    } else {
      res.json(Msg.NotSendMail);
    }
  }
  catch (err) { return res.json(Msg.Error) }
})

// Check If CodeTxt True redirect to NewPassword
router.post("/ResetPassword", async (req, res) => {
  try {
    if (req.body.CodeTxt === ForgotObj.CodeTxt) { res.json(Msg.Success); }
    else { res.json(Msg.WrongCode) }
  }
  catch (err) { return res.json(Msg.Error) }
});

router.post("/NewPassword", async (req, res) => {
  let HashedPassword = bcrypt.hashSync(req.body.Password, 10)

  try {
    if (ForgotObj.TypeUser === "Owner") {
      await ModernUser.updateOne({ _id: ForgotObj.ID },
        { Password: HashedPassword }
      );
    }
    if (ForgotObj.TypeUser === "User") {
      await ModernUser.updateOne({ "UsersData._id": ForgotObj.ID },
        { "UsersData.$.Password": HashedPassword, }
      )
    }
    res.json(Msg.Success);
  }
  catch (err) { return res.json(Msg.Error) }

});


module.exports = router;