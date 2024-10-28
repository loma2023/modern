function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowAllReceipts(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show GeneralData Data And Expenses Data 
function ShowAllReceipts(MainData, Decode) {
    let Customers = MainData.CustomersData
    let Revenues = MainData.RevenuesData
    let Status1 = "العملاء", Status2 = "الايرادات"
    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""

    let SumDebit = 0.00, SumCredit = 0.00
    MainData.GeneralData.forEach(Receipt => {
        index = Table.querySelectorAll("tr").length + 1
        if (Receipt.DocType.includes("دفع")) { Customers = MainData.SuppliersData; Revenues = MainData.ExpensesData; Status1 = "الموردين"; Status2 = "المصاريف" }

        if (Receipt.DocType.includes("سند")) {
            let CreatedBy = ''
            if (MainData._id == Receipt.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Receipt.CreatedBy)).Username }

            let ChooseStatus = Status1
            let Name = (Customers.find(item => item._id == Receipt.Name))
            if (Name == undefined) { ChooseStatus = Status2; Name = (Revenues.find(item => item._id == Receipt.Name)) }

            if (Receipt.DocType.includes("قبض")) { SumDebit += Receipt.Total }
            if (Receipt.DocType.includes("دفع")) { SumCredit += Receipt.Total }

            Table.innerHTML += `
            <tr id="${Receipt._id}">
                <td>${index}</td>
                <td>${Receipt.DocDate}</td>
                <td>${Receipt.DocNu}</td>
                <td>${Receipt.DocType}</td>
                <td Status="${ChooseStatus}" id="${Receipt.Name}">${Name.Name} </td>
                <td>${Receipt.Statment}</td>
                <td>${Receipt.Total}</td>
                <td>${CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                         <div class="btn-box">
                            <div class="tooltip">تعديل السند</div>
                            <button type="button" class="btn btn-Edit bx bxs-pencil" id="${Receipt._id}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">حذف السند</div>
                            <button type="button" id="${Receipt.DocType}-${Receipt._id}" onclick="Show_Alert(id)" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            if (Receipt.DocType.includes("قبض")) { SumDebit += Receipt.Total }
            if (Receipt.DocType.includes("دفع")) { SumCredit += Receipt.Total }
        }
    })
    document.querySelector(".SumDebit").innerText = SumDebit.toFixed(2)
    document.querySelector(".SumCredit").innerText = SumCredit.toFixed(2)
}
// Function to make Table into array
function CreateArray() {
    let Table = document.querySelector(".Table-body")
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            ID: Row.id,
            DocDate: Row.querySelectorAll("td")[1].innerText,
            DocNu: Row.querySelectorAll("td")[2].innerText,
            DocType: Row.querySelectorAll("td")[3].innerText,
            Name: Row.querySelectorAll("td")[4].innerText,
            Statment: Row.querySelectorAll("td")[5].innerText,
            Total: Row.querySelectorAll("td")[6].innerText,
            CreatedBy: Row.querySelectorAll("td")[7].innerText,
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
    let SumDebit = 0.00, SumCredit = 0.00
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "DocType") { SearchBy = TableObj.DocType }
        if (SearchBy == "DocNu") { SearchBy = TableObj.DocNu }
        if (SearchBy == "Statment") { SearchBy = TableObj.Statment }
        if (SearchBy == "User") { SearchBy = TableObj.CreatedBy }

        let index = Table.querySelectorAll("tr")
        if (TableObj.DocDate >= SDate && TableObj.DocDate <= EDate && SearchBy.includes(SearchInput.value)) {
            Table.innerHTML += `
            <tr id="${TableObj._id}" >
                <td>${index.length + 1}</td>
                <td>${TableObj.DocDate}</td>
                <td>${TableObj.DocNu}</td>
                <td>${TableObj.DocType}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Statment}</td>
                <td>${TableObj.Total}</td>
                <td>${TableObj.CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                         <div class="btn-box">
                            <div class="tooltip">تعديل السند</div>
                            <button type="button" class="btn btn-Edit bx bxs-pencil" id="${TableObj.ID}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">حذف السند</div>
                            <button type="button" id="${TableObj.DocType}-${TableObj.ID}" onclick="Show_Alert(id)" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            if (TableObj.DocType.includes("قبض")) { SumDebit += parseFloat(TableObj.Total) }
            if (TableObj.DocType.includes("دفع")) { SumCredit += parseFloat(TableObj.Total) }
        }
    })
    document.querySelector(".SumDebit").innerText = SumDebit.toFixed(2)
    document.querySelector(".SumCredit").innerText = SumCredit.toFixed(2)
}


// GeneralData => Edit Collect Or Payment
function EditCollectOrPayment(id) {
    let Form = document.querySelector(".Form-Collect")
    let CustomerID = Form.querySelector(".Name").id
    let DocDate = Form.querySelectorAll(".DocDate")[1]
    let Total = Form.querySelectorAll(".Total")[1]
    let Statment = Form.querySelectorAll(".Statment")[1].value
    let DocNu = Form.querySelector(".DocNu").innerText
    let Status = Form.querySelector(".Name").getAttribute("Status")

    DocDate.classList.remove("Required");
    Total.classList.remove("Required");

    if (Total.value === "" || Total.value < 0.1) { Total.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال المبلغ ",); }
    if (DocDate.value === "") { DocDate.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال التاريخ ",); }

    let DocType = "سند قبض", Debit = "الصندوق",
        Credit = Status, SubDebit = "مقبوضات", SubCredit = CustomerID

    if (Status === "الموردين" || Status === "المصاريف") {
        DocType = "سند دفع"; Debit = Status;
        Credit = "الصندوق"; SubDebit = CustomerID; SubCredit = "مدفوعات"
    }

    fetch("/GeneralData" + id, {
        method: "PUT",
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
// Function to Set Values in Input 
function FormCollect(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement.parentElement.parentElement

    let Form = document.querySelector(".Form-Collect")
    Form.classList.toggle("active")
    Form.querySelectorAll("input")[1].focus()
    Form.querySelectorAll('.DocDate')[0].innerText = parent.querySelectorAll("td")[1].innerText
    Form.querySelectorAll('.DocDate')[1].value = parent.querySelectorAll("td")[1].innerText
    Form.querySelector(".DocNu").innerText = parent.querySelectorAll("td")[2].innerText
    Form.querySelector(".DocType").innerText = parent.querySelectorAll("td")[3].innerText

    Form.querySelector(".Name").innerText = parent.querySelectorAll("td")[4].innerText
    Form.querySelector(".Name").setAttribute("Status", parent.querySelectorAll("td")[4].getAttribute("Status"))
    Form.querySelector(".Name").id = parent.querySelectorAll("td")[4].id

    Form.querySelectorAll(".Statment")[0].innerText = parent.querySelectorAll("td")[5].innerText
    Form.querySelectorAll(".Statment")[1].value = parent.querySelectorAll("td")[5].innerText

    Form.querySelectorAll(".Total")[0].innerText = parent.querySelectorAll("td")[6].innerText
    Form.querySelectorAll(".Total")[1].value = parent.querySelectorAll("td")[6].innerText
    Form.querySelector('.btn-Save').id = btn.id

}
// Function to Delete Revenue Or Expense
function DeleteData(id) {
    fetch("/GeneralData-" + id, { method: "DELETE" })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}