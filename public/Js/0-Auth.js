function Login() {
  fetch("/Login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Email: document.querySelector(".Email").value,
      Password: document.querySelector(".Password").value,
    })
  })
    .then((res) => res.json())
    .then((Data) => {
      if (Data.id === "Success") {
        location.assign("/Home")
      } else if (Data.id === "MaxAge") {
        location.href = "/Activation"
      } else {
        Toast(id = Data.id, txt = Data.txt,);
      }

    })
}

// ************************ ContainerStep ***************************

let ItemStep = document.querySelectorAll(".ItemStep")
let ContainerStep = document.querySelectorAll(".ContainerStep")
let Btn = document.querySelector(".btn-OTP")
let CodeTxts = document.querySelectorAll(".CodeTxt")

// STEP 0
function YourINFO(ID) {
  let Name = ContainerStep[ID].querySelector(".Name");
  let Phone = ContainerStep[ID].querySelector(".Phone");
  let Email = ContainerStep[ID].querySelector(".Email");
  let Password = ContainerStep[ID].querySelector(".Password");
  let ConfirmPassword = ContainerStep[ID].querySelector(".ConfirmPassword");
  // let ChekRegex = /^[a-zA-Z-\s]+$/;
  let CheckPhone = /^[0-9\s]+$/;
  let CheckMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  Name.classList.remove("Required");
  Phone.classList.remove("Required")
  Email.classList.remove("Required")
  Password.classList.remove("Required")
  ConfirmPassword.classList.remove("Required")

  // Check Name
  if (Name.value.trim() == "") { Name.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال الاسم",); }

  // CHeck Phone
  if (Phone.value.trim() == "") { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال رقم الهاتف ",); }
  else if (CheckPhone.test(Phone.value) == false) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال رقم هاتف صالح",); }
  else if (Phone.value.trim().length !== 11) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يجب ان يكون رقم الهاتف 11 رقم",); }

  // Check Email
  if (Email.value.trim() == "") { Email.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال الاميل",); }
  else if (CheckMail.test(Email.value) == false) { Email.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال اميل صالح",); }

  // Check Password
  if (Password.value.trim() === "") { Password.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال كلمة مرور",); }
  else if (ConfirmPassword.value.trim() === "") { ConfirmPassword.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي تأكيد كلمة المرور",); }
  else if (Password.value != ConfirmPassword.value) { ConfirmPassword.classList.add("Required"); return Toast(id = "Notification", txt = "كلمة المرور غير متطابقة",); }

  // Next Step

  fetch("/isCurrentEmail", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Email: document.querySelector(".Email").value,
    })
  })
    .then((res) => res.json())
    .then((Data) => {
      if (Data.id === "Success") { GoStepNext(ID) }
      else { Toast(id = Data.id, txt = Data.txt,); }
    })
}

// STEP 1
function YourCompany(ID) {
  let Name = ContainerStep[ID].querySelector(".NameCompany");
  let TypeCompany = ContainerStep[ID].querySelector(".TypeCompany");

  Name.classList.remove("Required");
  TypeCompany.classList.remove("Required")

  // Check Name
  if (Name.value.trim() == "") { Name.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال اسم النشاط",); }

  // Check TypeCompany
  if (TypeCompany.value.trim() == "") { TypeCompany.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي ادخال نوع النشاط",); }

  // Next Step
  Register(ID);
}

function Register(ID) {
  fetch("/Register", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Username: document.querySelector(".Name").value,
      Phone: document.querySelector(".Phone").value,
      Address: document.querySelector(".Address").value,
      Email: document.querySelector(".Email").value,
      Password: document.querySelector(".Password").value,

      NameCompany: document.querySelector(".NameCompany").value,
      TypeCompany: document.querySelector(".TypeCompany").value,
      LogoCompany: document.querySelector(".LogoCompany").value,
      CityCompany: document.querySelector(".CityCompany").value,
      AddressCompany: document.querySelector(".AddressCompany").value,
      PhoneCompany1: document.querySelector(".PhoneCompany1").value,
      PhoneCompany2: document.querySelector(".PhoneCompany2").value,
    })
  })
    .then((res) => res.json())
    .then((Data) => {
      if (Data.id === "Success") { GoStepNext(ID) }
      else { Toast(id = Data.id, txt = Data.txt,); }
    })
}

// STEP 2    &     STEP 1
function Verify(link) {
  let options = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      CodeTxt: CodeTxts[0].value + CodeTxts[1].value + CodeTxts[2].value + CodeTxts[3].value + CodeTxts[4].value + CodeTxts[5].value,
    })
  }

  fetch(link, options)
    .then((res) => res.json())
    .then((Data) => {
      if (Data.id === "Success") {
        if (link === '/ConfirmEmail') { GoStepNext(ID = 2) }
        else { GoStepNext(ID = 1) }
      }
      else { Toast(id = Data.id, txt = Data.txt,); }
    })
}

// STEP 0
function SentCodeToEmail() {
  let link = "/ForgotPassword"
  let options = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Email: document.querySelector(".Email").value,
    })
  }

  fetch(link, options)
    .then((res) => res.json())
    .then((Data) => {
      if (Data.id === "Success") {
        GoStepNext(ID = 0)
      } else {
        Toast(id = Data.id, txt = Data.txt,);
      }
    })
}

// STEP 2
function NewPassword() {
  let Password = document.querySelector(".Password").value
  let ConfirmPassword = document.querySelector(".ConfirmPassword").value
  if (Password !== ConfirmPassword) {
    return Toast(id = "Notification", txt = "كلمة المرور غير متطابقه",);
  }
  let link = "/NewPassword"
  let options = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Password: Password,
      ConfirmPassword: ConfirmPassword,
    })
  }

  fetch(link, options)
    .then((res) => res.json())
    .then((Data) => {
      if (Data.id === "Success") {
        GoStepNext(ID = 2)
      } else {
        Toast(id = Data.id, txt = Data.txt,);
      }
    })
}

function GoStepNext(ID) {
  ItemStep[ID].classList.replace("active", "Done")
  ItemStep[ID].querySelector(".circle").classList.add("bx-check")
  ItemStep[ID].querySelector(".circle").innerText = ""

  ContainerStep[ID].classList.remove("active")
  ContainerStep[ID + 1].classList.add("active")

  if (ID < 2) {
    ItemStep[ID + 1].classList.add("active")
    ContainerStep[ID + 1].querySelectorAll("input")[0].focus()
  }
}

function GoStepBack(ID) {
  ItemStep[ID - 1].classList.replace("Done", "active")
  ItemStep[ID - 1].querySelector(".circle").classList.remove("bx-check")
  ItemStep[ID - 1].querySelector(".circle").innerText = ID

  ItemStep[ID].classList.remove("active")
  ContainerStep[ID].classList.remove("active")
  ContainerStep[ID - 1].classList.add("active")
}


CodeTxts.forEach((input) => {
  input.addEventListener("input", () => {
    let currentInput = input
    let nextInput = currentInput.nextElementSibling

    if (currentInput.value.length > 1 && currentInput.value.length === 2) {
      currentInput.value = currentInput.value[1]
    }

    if (nextInput !== null && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
      nextInput.removeAttribute("disabled")
      nextInput.focus()
    }

    if (!CodeTxts[5].disabled && CodeTxts[5].value !== "") {
      Btn.classList.add("active")
      Btn.focus()
    } else {
      Btn.classList.remove("active")
    }

  })

  input.addEventListener("keyup", (e) => {
    if (e.key == "Backspace") {
      if (input.previousElementSibling != null) {
        e.target.value = ""
        e.target.setAttribute("disabled", true)
        input.previousElementSibling.focus()
      }
    }
  })
});

// اكواد خاضة بالاشعارات
function Toast(id, txt) {
  let icon = "bell"
  if (id === "Success") { icon = "check" }
  if (id === "Error") { icon = "x" }
  let Toasts = document.querySelector(".Toasts")
  let length = Toasts.querySelectorAll(".Toast").length
  let MyToast = `
      <div class="Toast index-${length}"  id="${id}">
          <i class="bx bx-${icon}"></i>
          <div>
              <h4>${id}</h4>
              <h4 class="Toast-Txt">${txt} </h4>
          </div>
          <i onclick="CloseToast(index = ${length})" class="bx bx-x X-Toast"></i>
      </div> `
  Toasts.innerHTML += MyToast
  setTimeout(() => { Toasts.querySelectorAll(".Toast")[length].classList.add("active") }, 100);
  setTimeout(() => { CloseToast(index = length) }, 5000);
}

function CloseToast(index) {
  let Toasts = document.querySelector(".Toasts")
  let Toast = Toasts.querySelector(`.index-${index}`)
  if (Toast) {
    Toast.classList.remove("active")
    setTimeout(() => { Toast.remove() }, 500);
  }
}
