function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowAllReceipts(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        // .catch((err) => { return location.href = "/Error" })
        .catch((err) => { return console.log(err) })
} FetchData()

// Show GeneralData Data 
function ShowAllReceipts(MainData, Decode) {
    let Customers = MainData.CustomersData

    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""
    let SumSales = 0, SumPurchases = 0
    MainData.GeneralData.forEach(Receipt => {
        index = Table.querySelectorAll("tr").length + 1
        if (Receipt.DocType.includes("مشتريات")) { Customers = MainData.SuppliersData; }
        if (!Receipt.DocType.includes("سند")) {

            let CreatedBy = ''
            if (MainData._id == Receipt.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Receipt.CreatedBy)).Username }

            let Name = (Customers.find(item => item._id == Receipt.Name)).Name
            let NameReceipt = "Sales"
            if (Receipt.DocType.includes("مبيعات")) { SumSales += Receipt.Total }
            if (Receipt.DocType.includes("مشتريات")) { NameReceipt = "Purchases"; SumPurchases += Receipt.Total }

            Table.innerHTML += `
            <tr id="${Receipt._id}">
                <td>${index}</td>
                <td>${Receipt.DocDate}</td>
                <td>${Receipt.DocNu}</td>
                <td>${Receipt.DocType}</td>
                <td>${Name} </td>
                <td>${Receipt.TypeAmount}</td>
                <td>${Receipt.SubTotal}</td>
                <td>${Receipt.Discount}</td>
                <td>${Receipt.Total}</td>
                <td>${CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">عرض المستند</div>
                            <a href="ShowReceipt${Receipt._id}" id="${Receipt._id}" class="btn btn-File bx bxs-file">
                            </a>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">تعديل الفاتورة</div>
                            <a href="EditReceipt-${NameReceipt}-${Receipt._id}" id="${Receipt._id}" class="btn btn-Edit bx bxs-pencil">
                            </a>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">حذف الفاتورة</div>
                            <button type="button" id="${Receipt.DocType}-${Receipt._id}" onclick="Show_Alert(id)" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        }
    })
    document.querySelector(".SumSales").innerText = SumSales
    document.querySelector(".SumPurchases").innerText = SumPurchases
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
            TypeAmount: Row.querySelectorAll("td")[5].innerText,
            SubTotal: Row.querySelectorAll("td")[6].innerText,
            Discount: Row.querySelectorAll("td")[7].innerText,
            Total: Row.querySelectorAll("td")[8].innerText,
            CreatedBy: Row.querySelectorAll("td")[9].innerText,
            btnFile: Row.querySelectorAll("td")[10].querySelector(".btn-File").getAttribute("href"),
            btnEdit: Row.querySelectorAll("td")[10].querySelector(".btn-Edit").getAttribute("href"),
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
    let SumSales = 0, SumPurchases = 0
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
            <tr id="${TableObj.ID}" >
                <td>${index.length + 1}</td>
                <td>${TableObj.DocDate}</td>
                <td>${TableObj.DocNu}</td>
                <td>${TableObj.DocType}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.TypeAmount}</td>
                <td>${TableObj.SubTotal}</td>
                <td>${TableObj.Discount}</td>
                <td>${TableObj.Total}</td>
                <td>${TableObj.CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">عرض المستند</div>
                            <a href="${TableObj.btnFile}" id="${TableObj.ID}" class="btn btn-File bx bxs-file">
                            </a>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">تعديل الفاتورة</div>
                            <a href="${TableObj.btnEdit}" id="${TableObj.ID}" class="btn btn-Edit bx bxs-pencil">
                            </a>
                        </div>
                        <div class="btn-box">
                            <div class="tooltip">حذف الفاتورة</div>
                            <button type="button" id="${TableObj.DocType}-${TableObj.ID}" onclick="Show_Alert(id)" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            if (TableObj.DocType.includes("تأجير")) { SumSales += parseFloat(TableObj.Total) }
            if (TableObj.DocType.includes("استئجأر")) { SumPurchases += parseFloat(TableObj.Total) }
        }
    })
    document.querySelector(".SumSales").innerText = SumSales.toFixed(2)
    document.querySelector(".SumPurchases").innerText = SumPurchases.toFixed(2)
}


// Function to Delete
function DeleteData(id) {
    fetch("/GeneralData-" + id, { method: "DELETE" })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}