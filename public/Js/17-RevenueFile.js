function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowRevenueOrExpenseData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Revenue Data And Expense Data 
function ShowRevenueOrExpenseData(MainData, Decode) {
    let FileID = document.querySelector(".FileID").id
    let FileIndex = document.querySelector(".FileID").getAttribute("index")

    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""

    let Revenue = MainData.RevenuesData[FileIndex]
    if (Title.includes("المصروف")) { Revenue = MainData.ExpensesData[FileIndex] }

    document.querySelector(".Person-Details .Name").innerText = Revenue.Name
    document.querySelector(".Person-Details .Type").innerText = Revenue.Type
    document.querySelector(".Person-Details .AmountType").innerText = Revenue.AmountType
    document.querySelector(".Person-Details .Amount").innerText = Revenue.Amount

    let Balance = 0;
    MainData.GeneralData.forEach(Receipt => {
        index = Table.querySelectorAll("tr").length + 1
        if (Receipt.SubDebit == FileID || Receipt.SubCredit == FileID) {

            let CreatedBy = ''
            if (MainData._id == Receipt.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Receipt.CreatedBy)).Username }

            let Debit = 0, Credit = 0;
            if (Receipt.SubDebit === FileID) { Debit = Receipt.Total }
            else if (Receipt.SubCredit === FileID) { Credit = Receipt.Total }

            if (Title.includes("الايراد")) { Balance = Balance + Credit - Debit }
            if (Title.includes("المصروف")) { Balance = Balance + Debit - Credit }
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
        }
    })
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


// Function to Delete Revenue Or Expense
function DeleteData(id) {
    let link = "/RevenuesData"
    if (Title.includes("المصروف")) { link = "/ExpensesData" }
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
    let Type = PersonDetails.querySelector(".Type").innerText
    let AmountType = PersonDetails.querySelector(".AmountType").innerText

    Form.classList.toggle("active")
    Form.querySelectorAll("input")[1].focus()
    Form.querySelector(".Name").value = PersonDetails.querySelector(".Name").innerText
    Form.querySelector(".Amount").value = PersonDetails.querySelector(".Amount").innerText

    if (Type.includes("يومي")) { Form.querySelector(".Type").options[0].selected = true }
    else if (Type.includes("شهري")) { Form.querySelector(".Type").options[1].selected = true }
    else if (Type.includes("سنوي")) { Form.querySelector(".Type").options[2].selected = true }

    if (AmountType.includes("متغيرة")) { Form.querySelector(".AmountType").options[0].selected = true }
    else if (AmountType.includes("ثابتة")) { Form.querySelector(".AmountType").options[1].selected = true }

    Form.querySelector('.btn-Save').id = id
}
// Function To Edit Revenue Data
function EditRevenueOrExpense(id) {
    let Form = document.querySelector(".Form-ADD")
    let Name = Form.querySelector(".Name")
    let AmountType = Form.querySelector(".AmountType")
    let Amount = Form.querySelector(".Amount")
    let Type = Form.querySelector(".Type").value

    Name.classList.remove("Required");
    AmountType.classList.remove("Required");
    Amount.classList.remove("Required");

    if (Name.value === "") { Name.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال الاسم ",); }
    if (AmountType.value.includes("ثابتة") && Amount.value == "") { Amount.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال المبلغ ",); }
    if (Amount.value == "") { Amount.value = 0 }

    let link = "/RevenuesData" + id
    if (Title.includes("المصاريف")) { link = "/ExpensesData" + id }

    fetch(link, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Name: Name.value, Type: Type,
            AmountType: AmountType.value, Amount: Amount.value,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })

}