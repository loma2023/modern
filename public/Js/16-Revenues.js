let DocNu = 1
let Table = document.querySelector(".Table-body")
function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowRevenuesOrExpensesData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()
// Show Revenues Data And Expenses Data 
function ShowRevenuesOrExpensesData(MainData, Decode) {
    let RevenuesData = MainData.RevenuesData
    if (Title.includes("المصاريف")) { RevenuesData = MainData.ExpensesData }

    DocNu = 1
    Table.innerHTML = ""
    let EveryDay = 0, EveryMonth = 0, EveryYear = 0, TableLength = 0
    RevenuesData.forEach((Revenue, index) => {
        if (Revenue.Status != "FALSE") {

            let CreatedBy = ''
            if (MainData._id == Revenue.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Revenue.CreatedBy)).Username }

            let Debit = 0, Credit = 0, Balance = 0;
            MainData.GeneralData.forEach(Receipt => {
                if (Receipt.SubDebit === Revenue._id) { Debit = Debit + Receipt.Total }
                else if (Receipt.SubCredit === Revenue._id) { Credit = Credit + Receipt.Total }
                if (Receipt.DocType.includes("سند")) { DocNu++ }
            })

            if (Title.includes("الايرادات")) { Balance = Credit - Debit }
            if (Title.includes("المصاريف")) { Balance = Debit - Credit }

            let tooltip = "", page = ""
            if (Title.includes("الايرادات")) { tooltip = "تحصيل "; page = "RevenueFile-" }
            if (Title.includes("المصاريف")) { tooltip = "دفع "; page = "ExpenseFile-" }
            
            TableLength++
            Table.innerHTML += `<tr id="${Revenue._id}">
                <td>${TableLength}</td>
                <td>${Revenue.Name}</td>
                <td>${Revenue.Type}</td>
                <td>${Revenue.AmountType}</td>
                <td Balance="${Balance}" Debit="${Debit}" Credit="${Credit}">
                    ${Revenue.Amount}
                </td>
                <td>${Revenue.UpdatedAt.slice(0, 10)}</td>
                <td>${CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <span class="tooltip">عرض ملف ${Revenue.Name}</span>
                            <button type="button" class="btn btn-File bx bxs-file" id="${Revenue._id}"
                                onclick="location.href='${page + Revenue._id + "-" + index}'">
                            </button>
                        </div>
                        <div class="btn-box">
                            <span class="tooltip">${tooltip} ${Revenue.Name}</span>
                            <button type="button" class="btn btn-Collect bx bx-dollar" id="${Revenue._id}"
                                onclick="FormCollect(event)">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            if (Revenue.Type.includes("يومي")) { EveryDay += Revenue.Amount }
            if (Revenue.Type.includes("شهري")) { EveryMonth += Revenue.Amount }
            if (Revenue.Type.includes("سنوي")) { EveryYear += Revenue.Amount }
        }
    });
    document.querySelector(".TableLength").innerText = TableLength
    document.querySelector(".EveryDay").innerText = EveryDay.toFixed(2)
    document.querySelector(".EveryMonth").innerText = EveryMonth.toFixed(2)
    document.querySelector(".EveryYear").innerText = EveryYear.toFixed(2)
}
// Function to make Table into array
function CreateArray() {
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            ID: Row.id,
            Name: Row.querySelectorAll("td")[1].innerText,
            Type: Row.querySelectorAll("td")[2].innerText,
            AmountType: Row.querySelectorAll("td")[3].innerText,
            Amount: Row.querySelectorAll("td")[4].innerText,
            Debit: Row.querySelectorAll("td")[4].getAttribute("Debit"),
            Credit: Row.querySelectorAll("td")[4].getAttribute("Credit"),
            Balance: Row.querySelectorAll("td")[4].getAttribute("Balance"),
            UpdatedAt: Row.querySelectorAll("td")[5].innerText,
            CreatedBy: Row.querySelectorAll("td")[6].innerText,
            tooltip1: Row.querySelectorAll("td")[7].querySelectorAll(".tooltip")[0].innerText,
            tooltip2: Row.querySelectorAll("td")[7].querySelectorAll(".tooltip")[1].innerText,
            OnClick: Row.querySelectorAll("td")[7].querySelectorAll("button")[0].getAttribute("onclick"),

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
    let EveryDay = 0, EveryMonth = 0, EveryYear = 0, TableLength = 0
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "Type") { SearchBy = TableObj.Type }
        if (SearchBy == "AmountType") { SearchBy = TableObj.AmountType }
        if (SearchBy == "Amount") { SearchBy = TableObj.Amount }
        if (SearchBy == "User") { SearchBy = TableObj.CreatedBy }

        if (TableObj.UpdatedAt >= SDate && TableObj.UpdatedAt <= EDate && SearchBy.includes(SearchInput.value)) {
            TableLength++
            Table.innerHTML += `
            <tr id="${TableObj.ID}">
                <td>${TableLength}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Type}</td>
                <td>${TableObj.AmountType}</td>
                <td Balance="${TableObj.Balance}" Debit="${TableObj.Debit}" Credit="${TableObj.Credit}">
                    ${TableObj.Amount}
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
                    </div>
                </td>
            </tr>`
            if (TableObj.Type.includes("يومي")) { EveryDay += parseFloat(TableObj.Amount) }
            if (TableObj.Type.includes("شهري")) { EveryMonth += parseFloat(TableObj.Amount) }
            if (TableObj.Type.includes("سنوي")) { EveryYear += parseFloat(TableObj.Amount) }
        }
    });
    document.querySelector(".TableLength").innerText = TableLength
    document.querySelector(".EveryDay").innerText = EveryDay.toFixed(2)
    document.querySelector(".EveryMonth").innerText = EveryMonth.toFixed(2)
    document.querySelector(".EveryYear").innerText = EveryYear.toFixed(2)
}


// New RevenueData or ExpenseData
function NewRevenueOrExpense() {
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

    let link = "/RevenuesData"
    if (Title.includes("المصاريف")) { link = "/ExpensesData" }

    fetch(link, {
        method: "POST",
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
// GeneralData => New Collect Or Payment
function NewCollectOrPayment(id) {
    let Form = document.querySelector(".Form-Collect")
    let RevenueID = id
    let Name = Form.querySelector(".Person-Details .Name").innerText
    let DocDate = Form.querySelector(".DocDate")
    let Total = Form.querySelector(".Total")
    let Statment = Form.querySelector(".Statment").value

    DocDate.classList.remove("Required");
    Total.classList.remove("Required");

    if (Total.value === "" || Total.value < 0.1) { Total.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال المبلغ ",); }
    if (DocDate.value === "") { DocDate.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال التاريخ ",); }

    if (Statment === "" && Title.includes("الايرادات")) { Statment = "تحصيل ايراد " + Name }
    if (Statment === "" && Title.includes("المصاريف")) { Statment = "دفع مصروف " + Name }

    let DocType = "سند قبض", Debit = "الصندوق",
        Credit = "الايرادات", SubDebit = "مقبوضات", SubCredit = RevenueID

    if (Title.includes("المصاريف")) {
        DocType = "سند دفع"; Debit = "المصاريف";
        Credit = "الصندوق"; SubDebit = RevenueID; SubCredit = "مدفوعات"
    }

    fetch("/GeneralData", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            DocNu: DocNu, DocType: DocType, DocDate: DocDate.value, Name: RevenueID,
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
    Form.querySelector(".Name").innerText = parent.querySelectorAll("td")[1].innerText
    Form.querySelector(".Type").innerText = parent.querySelectorAll("td")[2].innerText
    Form.querySelector(".AmountType").innerText = parent.querySelectorAll("td")[3].innerText
    Form.querySelector(".Amount").innerText = parent.querySelectorAll("td")[4].innerText
    Form.querySelector(".Balance").innerText = parent.querySelectorAll("td")[4].getAttribute("Balance")
    Form.querySelector('.DocDate').value = ToDay
    Form.querySelector('.btn-Save').id = btn.id
}