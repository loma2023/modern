function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowCustomerOrSupplierData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Customer Data And Supplier Data 
function ShowCustomerOrSupplierData(MainData, Decode) {
    let FileID = document.querySelector(".FileID").id
    let FileIndex = document.querySelector(".FileID").getAttribute("index")

    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""

    let Customer = MainData.CustomersData[FileIndex]
    if (Title.includes("المورد")) { Customer = MainData.SuppliersData[FileIndex] }

    let FinalDebit = 0, FinalCredit = 0, Balance = 0
    document.querySelector(".Person-Details .Name").innerText = Customer.Name
    document.querySelector(".Person-Details .Address").innerText = Customer.City + " " + Customer.Address
    document.querySelector(".Person-Details .Address").setAttribute("City", Customer.City)
    document.querySelector(".Person-Details .Address").setAttribute("Address", Customer.Address)
    document.querySelector(".Person-Details .Phone").innerText = Customer.Phone
    document.querySelector(".Person-Details .Balance").setAttribute("Balance", Customer.Balance)
    document.querySelector(".Person-Details .Balance").setAttribute("BalanceType", Customer.BalanceType)

    if (Customer.Balance !== 0) {

        let CreatedBy = ''
        if (MainData._id == Customer.CreatedBy) { CreatedBy = MainData.Username }
        else { CreatedBy = (MainData.UsersData.find(User => User._id == Customer.CreatedBy)).Username }

        let Debit = 0, Credit = 0;
        if (Customer.BalanceType === "Debit") { Debit = Customer.Balance }
        else { Credit = Customer.Balance }

        if (Title.includes("العميل")) { Balance = Debit - Credit }
        if (Title.includes("المورد")) { Balance = Credit - Debit }

        FinalDebit = Debit
        FinalCredit = Credit

        Table.innerHTML += `
            <tr>
                <td>1</td>
                <td>${Customer.CreatedAt.slice(0, 10)} </td>
                <td></td>
                <td>رصيد افتتاحي</td>
                <td>رصيد افتتاحي</td>
                <td>${Debit}</td>
                <td>${Credit}</td>
                <td>${Balance}</td>
                <td>${CreatedBy}</td>
            </tr>`
    }

    MainData.GeneralData.forEach(Receipt => {
        index = Table.querySelectorAll("tr").length + 1
        if (Receipt.Name == FileID) {
            // قد يكون الادمن هو من ضاف العميل او احد المستخدمين
            let CreatedBy = ''
            if (MainData._id == Receipt.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Receipt.CreatedBy)).Username }

            // رصيد العميل في الفواتير
            let Debit = 0, Credit = 0;
            if (Receipt.SubDebit === FileID) { Debit = Receipt.Total }
            else if (Receipt.SubCredit === FileID) { Credit = Receipt.Total }

            if (Receipt.Statment.includes("نقدية")) { Debit = Receipt.Total; Credit = Receipt.Total }

            if (Title.includes("العميل")) { Balance = Balance + Debit - Credit }
            if (Title.includes("المورد")) { Balance = Balance + Credit - Debit }
            Table.innerHTML += `
            <tr>
                <td>${index}</td>
                <td>${Receipt.DocDate}</td>
                <td>${Receipt.DocNu}</td>
                <td>${Receipt.DocType}</td>
                <td>${Receipt.Statment}</td>
                <td>${Debit}</td>
                <td>${Credit}</td>
                <td>${Balance}</td>
                <td>${CreatedBy}</td>
            </tr>`
            FinalDebit = FinalDebit + Debit
            FinalCredit = FinalCredit + Credit
        }
    })
    document.querySelector(".Person-Details .Debit").innerText = FinalDebit
    document.querySelector(".Person-Details .Credit").innerText = FinalCredit
    document.querySelector(".Person-Details .Balance").innerText = Balance
}
// Function to make Table into array
function CreateArray() {
    let Table = document.querySelector(".Table-body")
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            DocDate: Row.querySelectorAll("td")[1].innerText,
            DocNu: Row.querySelectorAll("td")[2].innerText,
            DocType: Row.querySelectorAll("td")[3].innerText,
            Statment: Row.querySelectorAll("td")[4].innerText,
            Debit: Row.querySelectorAll("td")[5].innerText,
            Credit: Row.querySelectorAll("td")[6].innerText,
            Balance: Row.querySelectorAll("td")[7].innerText,
            CreatedBy: Row.querySelectorAll("td")[8].innerText,
        }
        TableArray.push(TableObj)
    });
}
// Function to Search
function Search() {
    let SearchInput = document.querySelector(".SearchInput")
    let SDate = document.querySelector(".SDate").value
    let EDate = document.querySelector(".EDate").value
    let Table = document.querySelector(".Table-body")

    let NextYear = new Date().getFullYear() + 1
    if (SDate === "") { SDate = "1997-09-28" }
    if (EDate === "") { EDate = NextYear + "-01-01" }

    Table.innerHTML = ""
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "DocType") { SearchBy = TableObj.DocType }
        if (SearchBy == "DocNu") { SearchBy = TableObj.DocNu }
        if (SearchBy == "Statment") { SearchBy = TableObj.Statment }
        if (SearchBy == "User") { SearchBy = TableObj.CreatedBy }

        let index = Table.querySelectorAll("tr")
        if (TableObj.DocDate >= SDate && TableObj.DocDate <= EDate && SearchBy.includes(SearchInput.value)) {
            Table.innerHTML += `
            <tr>
                <td>${index.length + 1}</td>
                <td>${TableObj.DocDate}</td>
                <td>${TableObj.DocNu}</td>
                <td>${TableObj.DocType}</td>
                <td>${TableObj.Statment}</td>
                <td>${TableObj.Credit}</td>
                <td>${TableObj.Debit}</td>
                <td>${TableObj.Balance}</td>
                <td>${TableObj.CreatedBy}</td>
            </tr>`
        }
    })
}


// Function to Delete Customer Or Supplier
function DeleteData(id) {
    let link = "/CustomersData"
    if (Title.includes("المورد")) { link = "/SuppliersData" }
    let page = link + id

    fetch(page, { method: "DELETE" })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") {
                FetchData(), Hide_Container()
                location.href = link
            }
        })
        .catch((err) => { return location.href = "/Error" })
}
// Function To Set Data Into Form
function EditData(id) {
    let Form = document.querySelector(".Form-ADD")
    let PersonDetails = document.querySelector(".Person-Details")
    let BalanceType = PersonDetails.querySelector(".Balance").getAttribute("BalanceType")
    Form.classList.toggle("active")
    Form.querySelectorAll("input")[0].focus()

    Form.querySelector(".Name").value = PersonDetails.querySelector(".Name").innerText
    Form.querySelector(".City").value = PersonDetails.querySelector(".Address").getAttribute("City")
    Form.querySelector(".Address").value = PersonDetails.querySelector(".Address").getAttribute("Address")
    Form.querySelector(".Phone").value = PersonDetails.querySelector(".Phone").innerText
    Form.querySelector(".Balance").value = PersonDetails.querySelector(".Balance").getAttribute("Balance")

    if (BalanceType.includes("Debit")) { Form.querySelector(".BalanceType").options[1].selected = true }
    else if (BalanceType.includes("Credit")) { Form.querySelector(".BalanceType").options[2].selected = true }
    else { Form.querySelector(".BalanceType").options[0].selected = true }
    Form.querySelector('.btn-Save').id = id

}
// Function To Edit Customer Data
function EditCustomerOrSupplier(id) {
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

    let link = "/CustomersData" + id
    if (Title.includes("المورد")) { link = "/SuppliersData" + id }

    fetch(link, {
        method: "PUT",
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