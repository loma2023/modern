function ChangeContainer(index) {
    document.querySelectorAll(".ContainerStep").forEach(item => { item.classList.remove("active") })
    document.querySelectorAll(".ContainerStep")[index].classList.add("active")
    document.querySelectorAll(".Wrapper-button button").forEach(item => { item.classList.remove("active") })
    document.querySelectorAll(".Wrapper-button button")[index].classList.add("active")
}

function PersonalData() {
    let Name = document.querySelector(".Name")
    let Phone = document.querySelector(".Phone")
    let Email = document.querySelector(".Email")
    let Address = document.querySelector(".Address")
    let CheckPhone = /^[0-9\s]+$/;
    let CheckMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    Name.classList.remove("Required");
    Phone.classList.remove("Required")
    Email.classList.remove("Required")

    // Check Name
    if (Name.value.trim() == "") { Name.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال الاسم",); }

    // Check Email
    if (Email.value.trim() == "") { Email.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال الإميل",); }
    else if (CheckMail.test(Email.value) == false) { Email.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال إميل صالح",); }

    // Check Phone
    if (Phone.value.trim() == "") { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال رقمُ الهاتف ",); }
    else if (CheckPhone.test(Phone.value) == false) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال رقمُ هاتفً صالح",); }
    else if (Phone.value.trim().length !== 11) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يجب أن يتكون رقمُ الهاتف من 11 رقم",); }

    let Link = "/PersonalDataSettings"
    let EmailInner = document.querySelector(".EmailInner").innerText
    if (Email.value != EmailInner) { Link = "/EmailSettings" }

    fetch(Link, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: Name.value, Phone: Phone.value, Address: Address.value, Email: Email.value, })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success" && Email.value === EmailInner) {
                document.querySelector(".UsernameInner").innerText = Name.value
                document.querySelector(".AddressInner").innerText = Address.value
                document.querySelector(".PhoneInner").innerText = Phone.value
                document.querySelector(".EmailInner").innerText = Email.value
            }
            if (Data.id === "Success" && Email.value != EmailInner) {
                document.querySelectorAll(".ContainerStep").forEach(item => {
                    item.classList.remove("active")
                })
                document.querySelector(".ContainerStep.ConfirmEmail").classList.add("active")
                document.querySelectorAll(".ContainerStep.ConfirmEmail input")[0].focus()
            }
        })
}

function Verify() {
    let Name = document.querySelector(".Name")
    let Address = document.querySelector(".Address")
    let Phone = document.querySelector(".Phone")
    let Email = document.querySelector(".Email")

    fetch("/ConfirmEmailSettings", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            CodeTxt: CodeTxts[0].value + CodeTxts[1].value + CodeTxts[2].value + CodeTxts[3].value + CodeTxts[4].value + CodeTxts[5].value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") {
                document.querySelector(".UsernameInner").innerText = Name.value
                document.querySelector(".AddressInner").innerText = Address.value
                document.querySelector(".PhoneInner").innerText = Phone.value
                document.querySelector(".EmailInner").innerText = Email.value
                document.querySelectorAll(".ContainerStep").forEach(item => {
                    item.classList.remove("active")
                })
                document.querySelectorAll(".ContainerStep")[0].classList.add("active")
            }
        })
}

function ChangePassword() {
    let Password = document.querySelector(".Password")
    let NewPassword = document.querySelector(".NewPassword")
    let ConfirmPassword = document.querySelector(".ConfirmPassword")
    fetch("/PasswordSettings", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Password: Password.value, NewPassword: NewPassword.value,
            ConfirmPassword: ConfirmPassword.value,
        })
    })
        .then((res) => res.json())
        .then((Data) => { Toast(id = Data.id, txt = Data.txt,); })
}

function CompanyData() {
    let SubContainer = document.querySelector(".SubContainer")
    let NameCompany = SubContainer.querySelector(".NameCompany").value
    let TypeCompany = SubContainer.querySelector(".TypeCompany").value
    let LogoCompany = SubContainer.querySelector(".LogoCompany").value
    let CityCompany = SubContainer.querySelector(".CityCompany").value
    let AddressCompany = SubContainer.querySelector(".AddressCompany").value
    let PhoneCompany1 = SubContainer.querySelector(".PhoneCompany1").value
    let PhoneCompany2 = SubContainer.querySelector(".PhoneCompany2").value

    fetch("/CompanyDataSettings", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            NameCompany, TypeCompany, LogoCompany, CityCompany, AddressCompany, PhoneCompany1, PhoneCompany2,
        })
    })
        .then((res) => res.json())
        .then((Data) => { Toast(id = Data.id, txt = Data.txt,); })

}

function Settings() {
    let VoiceMessage = document.querySelector("#VoiceMessage")
    let Notifications = document.querySelector("#Notifications")
    let DarkMood = document.querySelector("#DarkMood")

    fetch("/Settings", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            VoiceMessage: VoiceMessage.checked,
            Notifications: Notifications.checked,
            DarkMood: DarkMood.checked,
        })
    })
        .then((res) => res.json())
        .then((Data) => { Toast(id = Data.id, txt = Data.txt,); })
}

let Btn = document.querySelector(".btn-OTP")
let CodeTxts = document.querySelectorAll(".CodeTxt")
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