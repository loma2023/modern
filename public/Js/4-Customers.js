let DocNu = 1
let Table = document.querySelector(".Table-body")
let TitleForm = document.querySelector(".Title-Form-Collect")
let TitleInner = TitleForm.innerText

function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowCustomersOrSuppliersData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()
// Show Customers Data And Suppliers Data 
function ShowCustomersOrSuppliersData(MainData, Decode) {
    let CustomersData = MainData.CustomersData
    if (Title.includes("الموردين")) { CustomersData = MainData.SuppliersData }

    DocNu = 1
    Table.innerHTML = ""
    let FinalBalance = 0.00, TableLength = 0.00
    CustomersData.forEach((Customer, index) => {
        if (Customer.Status != "FALSE") {
            let CreatedBy = ''
            if (MainData._id == Customer.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Customer.CreatedBy)).Username }

            let Debit = 0, Credit = 0, Balance = 0;
            if (Customer.BalanceType === "Debit") { Debit = Customer.Balance }
            else { Credit = Customer.Balance }

            MainData.GeneralData.forEach(Receipt => {
                if (Receipt.SubDebit === Customer._id) { Debit = Debit + Receipt.Total }
                else if (Receipt.SubCredit === Customer._id) { Credit = Credit + Receipt.Total }
                if (Receipt.DocType.includes("سند") && index === 0) { DocNu++ }
            })

            if (Title.includes("العملاء")) { Balance = Debit - Credit }
            if (Title.includes("الموردين")) { Balance = Credit - Debit }

            let meORyou = "", meORyouClass = "", tooltip = "", page = ""
            if (Title.includes("العملاء")) {
                if (Balance > 0) { meORyou = "عليه"; meORyouClass = "Debit" }
                if (Balance < 0) { meORyou = "له"; meORyouClass = "Credit" }
                tooltip = "التحصيل من العميل "; page = "CustomerFile-"
            }
            if (Title.includes("الموردين")) {
                if (Balance < 0) { meORyou = "عليه"; meORyouClass = "Credit" }
                if (Balance > 0) { meORyou = "له"; meORyouClass = "Debit" }
                tooltip = "الدفع للمورد "; page = "SupplierFile-"
            }
            if (Balance == 0) { meORyou = ""; meORyouClass = "Debit-Credit" }
            TableLength++
            Table.innerHTML +=
                `<tr id="${Customer._id}">
                <td>${TableLength}</td>
                <td>${Customer.Name}</td>
                <td>${Customer.City}</td>
                <td>${Customer.Address}</td>
                <td>${Customer.Phone}</td>
                <td Balance="${Balance}" Debit="${Debit}" Credit="${Credit}">
                    <div class="FlexTD">
                        <span>${Balance.toFixed(2)}</span>
                        <span class="${meORyouClass}">${meORyou}</span>
                    </div>   
                </td>
                <td>${Customer.UpdatedAt.slice(0, 10)}</td>
                <td>${CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">عرض الملف</span>
                            <button type="button" class="btn btn-File bx bxs-file" id="${Customer._id}"
                                onclick="location.href='${page + Customer._id + "-" + index}'">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">${tooltip}</span>
                            <button type="button" class="btn btn-Collect bx bx-dollar" id="${Customer._id}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">تحديد موعد</span>
                            <button type="button" class="btn btn-History bx bx-history" id="${Customer._id}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            FinalBalance += Balance
        }
    });
    document.querySelector(".TableLength").innerText = TableLength
    document.querySelector(".FinalBalance").innerText = FinalBalance.toFixed(2)
}
// Function to make Table into array
function CreateArray() {
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            ID: Row.id,
            Name: Row.querySelectorAll("td")[1].innerText,
            City: Row.querySelectorAll("td")[2].innerText,
            Address: Row.querySelectorAll("td")[3].innerText,
            Phone: Row.querySelectorAll("td")[4].innerText,
            Debit: Row.querySelectorAll("td")[5].getAttribute("Debit"),
            Credit: Row.querySelectorAll("td")[5].getAttribute("Credit"),
            Balance: Row.querySelectorAll("td")[5].getAttribute("Balance"),
            meORyou: Row.querySelectorAll("td")[5].querySelectorAll("span")[1].innerText,
            meORyouClass: Row.querySelectorAll("td")[5].querySelectorAll("span")[1].classList,
            UpdatedAt: Row.querySelectorAll("td")[6].innerText,
            CreatedBy: Row.querySelectorAll("td")[7].innerText,
            tooltip1: Row.querySelectorAll("td")[8].querySelectorAll(".tooltip")[0].innerText,
            tooltip2: Row.querySelectorAll("td")[8].querySelectorAll(".tooltip")[1].innerText,
            OnClick: Row.querySelectorAll("td")[8].querySelectorAll("button")[0].getAttribute("onclick"),
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
    let FinalBalance = 0.00, TableLength = 0.00
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "City") { SearchBy = TableObj.City }
        if (SearchBy == "Address") { SearchBy = TableObj.Address }
        if (SearchBy == "Phone") { SearchBy = TableObj.Phone }
        if (SearchBy == "User") { SearchBy = TableObj.CreatedBy }

        if (TableObj.UpdatedAt >= SDate && TableObj.UpdatedAt <= EDate && SearchBy.includes(SearchInput.value)) {
            TableLength++
            Table.innerHTML += `
            <tr id="${TableObj.ID}">
                <td>${TableLength}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.City}</td>
                <td>${TableObj.Address}</td>
                <td>${TableObj.Phone}</td>
                <td Balance="${TableObj.Balance}" Debit="${TableObj.Debit}" Credit="${TableObj.Credit}">
                    <div class="FlexTD">
                        <span>${(parseFloat(TableObj.Balance)).toFixed(2)}</span>
                        <span class="${TableObj.meORyouClass}">${TableObj.meORyou}</span>
                    </div>   
                </td>
                <td>${TableObj.UpdatedAt}</td>
                <td>${TableObj.CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">${TableObj.tooltip1}</span>
                            <button type="button" class="btn btn-File bx bxs-file" id="${TableObj.ID}"
                                onclick="${TableObj.OnClick}">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">${TableObj.tooltip2}</span>
                            <button type="button" class="btn btn-Collect bx bx-dollar" id="${TableObj.ID}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">تحديد موعد</span>
                            <button type="button" class="btn btn-History bx bx-history" id="${TableObj.ID}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            FinalBalance += parseFloat(TableObj.Balance)
        }
    })
    document.querySelector(".TableLength").innerText = TableLength
    document.querySelector(".FinalBalance").innerText = FinalBalance.toFixed(2)
}


// New CustomerData or SupplierData
function NewCustomerOrSupplier() {
    let Form = document.querySelector(".Form-ADD")
    let Name = Form.querySelector(".Name")
    let Phone = Form.querySelector(".Phone")
    let BalanceType = Form.querySelector(".BalanceType");
    let City = Form.querySelector(".City").value
    let Address = Form.querySelector(".Address").value
    let Balance = Form.querySelector(".Balance").value;

    let CheckPhone = /^[0-9\s]+$/;

    Name.classList.remove("Required");
    Phone.classList.remove("Required");
    BalanceType.classList.remove("Required");

    // CHeck Name
    if (Name.value.trim() == "") { Name.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال الاسم",); }

    // CHeck Phone
    if (Phone.value.trim() != "" && CheckPhone.test(Phone.value) == false) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال رقم هاتفً صالح",); }
    else if (Phone.value.trim() != "" && Phone.value.trim().length !== 11) { Phone.classList.add("Required"); return Toast(id = "Notification", txt = "يجب أن يكون رقمُ الهاتف 11 رقم",); }

    // CHeck Balance
    if (Balance > 0 && BalanceType.value == "empty") { BalanceType.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي تحديد نوع الرصيد  ",); }
    if (Balance === "") { Balance = 0 }

    let link = "/CustomersData"
    if (Title.includes("الموردين")) { link = "/SuppliersData" }

    fetch(link, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Name: Name.value, City: City, Address: Address, Phone: Phone.value,
            Balance: Balance, BalanceType: BalanceType.value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}
// GeneralData => New Collect Or Payment
function NewCollectOrPayment(id) {
    let Form = document.querySelector(".Form-Collect")
    let CustomerID = id
    let DocDate = Form.querySelector(".DocDate")
    let Total = Form.querySelector(".Total")
    let Statment = Form.querySelector(".Statment").value

    DocDate.classList.remove("Required");
    Total.classList.remove("Required");

    if (Total.value === "" || Total.value < 0.1) { Total.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال المبلغ ",); }
    if (DocDate.value === "") { DocDate.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال التاريخ ",); }

    let DocType = "سند قبض", Debit = "الصندوق",
        Credit = "العملاء", SubDebit = "مقبوضات", SubCredit = CustomerID

    if (Title.includes("الموردين")) {
        DocType = "سند دفع"; Debit = "الموردين";
        Credit = "الصندوق"; SubDebit = CustomerID; SubCredit = "مدفوعات"
    }

    fetch("/GeneralData", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            DocNu: DocNu, DocType: DocType, DocDate: DocDate.value, Name: CustomerID,
            Statment: Statment, Debit: Debit, Credit: Credit,
            SubDebit: SubDebit, SubCredit: SubCredit, Total: Total.value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}
// GeneralData => New Collect Or Payment
function NewTime(id) {
    let Form = document.querySelector(".Form-Collect")
    let CustomerID = id
    let Name = Form.querySelector(".Person-Details .Name").innerText
    let DocDate = Form.querySelector(".DocDate")
    let Total = Form.querySelector(".Total")
    let Statment = Form.querySelector(".Statment").value

    DocDate.classList.remove("Required");
    Total.classList.remove("Required");

    if (DocDate.value === "") { DocDate.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال التاريخ ",); }
    if (Total.value === "" || Total.value < 0.1) { Total.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال المبلغ ",); }

    let Link = "/NewTimeCustomer"
    if (Title.includes("الموردين")) { Link = "/NewTimeSupplier" }

    fetch(Link, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Name: Name, ObjID: CustomerID, DocDate: DocDate.value,
            Statment: Statment, Total: Total.value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}
// Function to Set Values in Input 
function FormCollect(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement.parentElement.parentElement

    let Form = document.querySelector(".Form-Collect")
    Form.classList.toggle("active")
    Form.querySelectorAll("input")[1].focus()
    Form.querySelector(".Name").innerText = parent.querySelectorAll("td")[1].innerText
    Form.querySelector(".Address").innerText = parent.querySelectorAll("td")[2].innerText + " - " + parent.querySelectorAll("td")[3].innerText
    Form.querySelector(".Phone").innerText = parent.querySelectorAll("td")[4].innerText
    Form.querySelector(".Debit").innerText = parent.querySelectorAll("td")[5].getAttribute("Debit")
    Form.querySelector(".Credit").innerText = parent.querySelectorAll("td")[5].getAttribute("Credit")
    Form.querySelector(".Balance").innerText = parent.querySelectorAll("td")[5].getAttribute("Balance") + " " + parent.querySelectorAll("td")[5].querySelectorAll("span")[1].innerText
    Form.querySelector('.DocDate').value = ToDay
    Form.querySelector('.btn-Save').id = btn.id

    if (btn.classList.contains("bx-dollar")) {
        TitleForm.innerText = TitleInner
        Form.querySelector('.btn-Save').classList.add("btn-Collect")
    }
    else if (btn.classList.contains("bx-history")) {
        TitleForm.innerText = "تحديد تاريخ تحصيل"
        Form.querySelector('.btn-Save').classList.add("btn-Time")
    }
}

function SelectFunction(event) {
    let btn = event.target;
    let id = btn.id
    if (btn.classList.contains("btn-Collect")) { NewCollectOrPayment(id) }
    if (btn.classList.contains("btn-Time")) { NewTime(id) }
}
