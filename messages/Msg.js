//  رساله حضره
let Success = { id: "Success", txt: "" }
let Save = { id: "Success", txt: "تم حفظ البيانات بنجاح" }
let Edit = { id: "Success", txt: "تم تعديل البيانات بنجاح" }
let Delete = { id: "Success", txt: "تم حذف البيانات بنجاح" }
let SendMsg = { id: "Success", txt: "تم إرسال رسالتك بنجاح" }
let SendMail = { id: "Success", txt: "تم إرسال كود تأكيد الإميل بنجاح" }
let SendPass = { id: "Success", txt: "تم إرسال كود تعيين كلمة المرور بنجاح" }

// رساله زرقه
let ExistEmail = { id: "Notification", txt: "هذا الإميل موجود بالفعل" }
let ExistName = { id: "Notification", txt: "هذا الاسم موجود بالفعل" }
let NotExist = { id: "Notification", txt: "هذا الإميل غير موجود " }
let MaxAge = { id: "MaxAge", txt: "انتهت الفترة التجريبية , قم بتفعيل الموقع" }

// رساله حمره
let Error = { id: "Error", txt: "حَدَثَ خَطَأَ .. حَاوَلَ مَرَّةً أُخْرَى" }
let WrongCode = { id: "Error", txt: "الكود الذي ادخلته غير صحيح حاول مرةً اخري " }
let WrongEmail = { id: "Error", txt: "الإميل او كلمة المرور خطأ" }
let WrongPass = { id: "Error", txt: "كلمة المرور الحالية غير صحيحة" }
let WrongConfirm = { id: "Error", txt: "كلمة المرور الجديدة غير متطابقة" }
let NotSendMail = { id: "Error", txt: "فشل إرسال الكود" }
let NotSendMsg = { id: "Error", txt: "فشل إرسال الرسالة " }
let Permission = { id: "Error", txt: "هذه الصلاحية غير متوفره لك !" }



let DesignGamilMsg = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Register | HEMAYA</title>
      
          <style>
              * {
                  padding: 0;
                  margin: 0;
                  box-sizing: border-box;
              }
              body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  font-family: Calibri, 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif;
              }
              .Container {
                  display: inline-block;
                  align-items: center;
                  text-align: center;
                  justify-content: center;
                  gap: 20px;
                  padding: 20px;
                  border-radius: 8px;
              }
              .Container .img-div {
                  width: 200px;
                  height: 200px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  border-radius: 50%;
                  margin: auto;
                  background: #f1f1f1;
              }
              .Container .img-div img {
                  width: 150px;
                  height: 100px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: auto;
              }
              .Container p {
                  width: 600px;
                  margin: 10px;
                  font-size: 20px;
                  line-height: 1.5;
              }
              .Container p:first-child {
                  margin-top: 35px;
              }
              .Container h3 {
                  font-size: 25px;
                  color: #4099ff;
                  letter-spacing: 5px;
                  border:1px solid #4099ff;
                  width:fit-content;
                  margin: auto;
                  margin-top: 25px;
                  padding: 10px 20px;
                  border-radius: 8px;
                  text-align: center;
              }
              .Note{
                 margin-top: 35px;
                 font-size: 20px;
                 padding: 10px 20px;
                 background: rgb(240, 240, 142);
                 border-radius: 5px;
                 color:#6b6b6b;
              }
              @media (max-width: 600px) {
                  .Container p {
                      width: 100%;
                  }
              }

          </style></head><body>
          <div class="Container">
              <div class="img-div">
                  <img src="https://e.top4top.io/p_3210go8ur1.png" alt="" srcset="">
              </div>`


module.exports = {
    Success, Save, Edit, Delete,SendMsg,NotSendMsg,
    SendMail, SendPass, NotSendMail, ExistEmail, WrongPass,
    WrongConfirm, ExistName, NotExist, MaxAge, Error,
    WrongCode, WrongEmail, Permission, DesignGamilMsg
};