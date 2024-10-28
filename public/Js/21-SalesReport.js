function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowGeneralDataOrExpensesReceipts(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show GeneralData Data And Expenses Data 
function ShowGeneralDataOrExpensesReceipts(MainData, Decode) {
    let Customers = MainData.CustomersData
    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""

    let Status = "مبيعات";
    if (Title.includes("مشتريات")) { Customers = MainData.SuppliersData; Status = "مشتريات" }
    let SumDebit = 0, SumCredit = 0;
    MainData.GeneralData.forEach(Receipt => {
        index = Table.querySelectorAll("tr").length + 1
        let Debit = 0, Credit = 0;
        if (Receipt.DocType.includes(Status)) {

            let CreatedBy = ''
            if (MainData._id == Receipt.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Receipt.CreatedBy)).Username }

            let Name = (Customers.find(item => item._id == Receipt.Name)).Name

            if (Receipt.DocType === "مبيعات" || Receipt.DocType === "مرتجع مشتريات") { Debit = 0; Credit = Receipt.Total }
            else { Debit = Receipt.Total; Credit = 0 }
            Table.innerHTML += `
            <tr>
                <td>${index}</td>
                <td>${Receipt.DocDate}</td>
                <td>${Receipt.DocNu}</td>
                <td>${Receipt.DocType}</td>
                <td>${Name} </td>
                <td>${Receipt.Statment}</td>
                <td>${Debit}</td>
                <td>${Credit}</td>
                <td>${CreatedBy}</td>
            </tr>`
            if (Title.includes("مشتريات")) { SumDebit += Debit; SumCredit += Credit }
            if (Title.includes("مبيعات")) { SumDebit += Credit; SumCredit += Debit }
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
            DocDate: Row.querySelectorAll("td")[1].innerText,
            DocNu: Row.querySelectorAll("td")[2].innerText,
            DocType: Row.querySelectorAll("td")[3].innerText,
            Name: Row.querySelectorAll("td")[4].innerText,
            Statment: Row.querySelectorAll("td")[5].innerText,
            Debit: Row.querySelectorAll("td")[6].innerText,
            Credit: Row.querySelectorAll("td")[7].innerText,
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
    let SumDebit = 0, SumCredit = 0;
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
            <tr>
                <td>${index.length + 1}</td>
                <td>${TableObj.DocDate}</td>
                <td>${TableObj.DocNu}</td>
                <td>${TableObj.DocType}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Statment}</td>
                <td>${TableObj.Debit}</td>
                <td>${TableObj.Credit}</td>
                <td>${TableObj.CreatedBy}</td>
            </tr>`
            if (Title.includes("استئجأر")) { SumDebit += parseFloat(TableObj.Debit); SumCredit += parseFloat(TableObj.Credit) }
            if (Title.includes("تأجير")) { SumDebit += parseFloat(TableObj.Credit); SumCredit += parseFloat(TableObj.Debit) }
        }
    })
    document.querySelector(".SumDebit").innerText = SumDebit.toFixed(2)
    document.querySelector(".SumCredit").innerText = SumCredit.toFixed(2)
}