let Table = document.querySelector(".Table-body")
let ChangeEmail = ""
function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowUsersData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()
// Show Users Data And Suppliers Data 
let AllUserData = []
function ShowUsersData(MainData, Decode) {
    Table.innerHTML = ""
    let TableLength = 0
    AllUserData = MainData.UsersData
    MainData.UsersData.forEach((User, index) => {
        if (User.Status != "FALSE") {
            TableLength++
            Table.innerHTML += `
            <tr id="${User._id}">
                <td>${TableLength}</td>
                <td>${User.Username}</td>
                <td>${User.Email}</td>
                <td>${User.Phone}</td>  
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">تعديل</div>
                            <button type="button" onclick="EditData(event)" id="${User._id}" class="btn btn-Edit bx bxs-pencil">
                            </button>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">حذف</div>
                            <button type="button" onclick="Show_Alert(id)" id="${User._id}" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>  
            </tr>`
        }
    });
    document.querySelector(".TableLength").innerText = TableLength
}
// Function to make Table into array
function CreateArray() {
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            ID: Row.id,
            Name: Row.querySelectorAll("td")[1].innerText,
            Email: Row.querySelectorAll("td")[2].innerText,
            Phone: Row.querySelectorAll("td")[3].innerText,
        }
        TableArray.push(TableObj)
    });
}
// Function to Search
function Search() {
    let SearchInput = document.querySelector(".SearchInput")
    let SDate = document.querySelector(".SDate").value
    let EDate = document.querySelector(".EDate").value

    let NextYear = new Date().getFullYear() + 1
    if (SDate === "") { SDate = "1997-09-28" }
    if (EDate === "") { EDate = NextYear + "-01-01" }

    Table.innerHTML = ""
    let TableLength = 0
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "Email") { SearchBy = TableObj.Email }
        if (SearchBy == "Phone") { SearchBy = TableObj.Phone }


        if (TableObj.UpdatedAt >= SDate && TableObj.UpdatedAt <= EDate && SearchBy.includes(SearchInput.value)) {
            TableLength++
            Table.innerHTML += `
            <tr id="${TableObj.ID}">
                <td>${TableLength}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Email}</td>
                <td>${TableObj.Phone}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">تعديل</div>
                            <button type="button" onclick="EditData(event)" id="${TableObj.ID}" class="btn btn-Edit bx bxs-pencil">
                            </button>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">حذف</div>
                            <button type="button" onclick="Show_Alert(id)" id="${TableObj.ID}" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        }
    });
    document.querySelector(".TableLength").innerText = TableLength
}


// New UserData or SupplierData
function NewUser(id) {
    let Form = document.querySelector(".Form-ADD")
    let Name = Form.querySelector(".Name")
    let Email = Form.querySelector(".Email")
    let TypeUser = Form.querySelector(".TypeUser");
    let Phone = Form.querySelector(".Phone")
    let Password = Form.querySelector(".Password")
    let ConfirmPassword = Form.querySelector(".ConfirmPassword")
    let CheckPhone = /^[0-9\s]+$/;
    let CheckMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let Link = "/UsersData", Method = "POST"
    let Status = ""
    if (id != "Save") { Link = "/UsersData" + id, Method = "PUT" }
    if (id != "Save" && Email.value != ChangeEmail) { Status = "ChangeEmail" }

    Name.classList.remove("Required");
    Phone.classList.remove("Required")
    Email.classList.remove("Required")
    Password.classList.remove("Required")
    ConfirmPassword.classList.remove("Required")

    // Check Name
    if (Name.value.trim() == "") { Name.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال الاسم",); }

    // Check Email
    if (Email.value.trim() == "") { Email.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال الإميل",); }
    else if (CheckMail.test(Email.value) == false) { Email.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال إميل صالح",); }

    // Check Phone
    if (Phone.value.trim() == "") { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال رقمُ الهاتف ",); }
    else if (CheckPhone.test(Phone.value) == false) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال رقمُ هاتفً صالح",); }
    else if (Phone.value.trim().length !== 11) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يجب أن يتكون رقمُ الهاتف من 11 رقم",); }

    // Check Password
    if (Password.value.trim() === "") { Password.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال كلمة المرور",); }
    else if (ConfirmPassword.value.trim() === "") { ConfirmPassword.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي تأكيد كلمة المرور",); }
    else if (Password.value != ConfirmPassword.value) { ConfirmPassword.classList.add("Required"); return Toast(id = "Notification", txt = "كلمة المرور غير متطابقة",); }

    let Rows = Form.querySelectorAll(".Table-body tr")
    let Array = []
    Rows.forEach(Row => {
        let Obj = {}
        if (TypeUser.value != "Admin") {
            Obj = {
                Page: Row.id,
                Show: Row.querySelectorAll("input")[0].checked,
                Add: Row.querySelectorAll("input")[1].checked,
                Edit: Row.querySelectorAll("input")[2].checked,
                Delete: Row.querySelectorAll("input")[3].checked,
            }
        } else {
            Obj = { Page: Row.id, Show: "true", Add: "true", Edit: "true", Delete: "true", }
        }
        Array.push(Obj)
    });

    fetch(Link, {
        method: Method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Name: Name.value, Email: Email.value, Password: Password.value,
            Phone: Phone.value, Permissions: Array, Status: Status,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })

}
// Function to Edit Data
function EditData(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement.parentElement.parentElement

    let UserData = AllUserData.find(item => item._id === btn.id)

    let Form = document.querySelector(".Form-ADD")
    Form.querySelector(".Name").value = UserData.Username
    Form.querySelector(".Email").value = UserData.Email
    Form.querySelector(".Phone").value = UserData.Phone
    // Form.querySelector(".Password").value = UserData.Password
    // Form.querySelector(".ConfirmPassword").value = UserData.Password

    let Rows = Form.querySelectorAll(".Table-body tr")
    Rows.forEach(Row => {
        let Permission = UserData.Permissions.find(Page => Page.Page === Row.id)
        Row.querySelectorAll("input")[0].checked = Permission.Show
        Row.querySelectorAll("input")[1].checked = Permission.Add
        Row.querySelectorAll("input")[2].checked = Permission.Edit
        Row.querySelectorAll("input")[3].checked = Permission.Delete
    });
    Form.querySelector(".btn-Save").id = btn.id

    ChangeEmail = parent.querySelectorAll("td")[2].innerText

    FormADD()
}
// Function to Delete Data
function DeleteData(id) {
    fetch("/UsersData" + id, { method: "DELETE" })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}

function ShowOrHideTable(value) {
    let Table = document.querySelector(".Form-ADD .Table-Container")
    if (value === "User") {
        Table.style.display = "flex"
    } else if (value === "Admin") {
        Table.style.display = "none"
    }
}