function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowCashBookData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Customers Data And Suppliers Data 
function ShowCashBookData(MainData, Decode) {
    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""

    let SumDebit = 0, SumCredit = 0, Balance = 0;
    MainData.GeneralData.forEach(Receipt => {
        index = Table.querySelectorAll("tr").length + 1
        if (Receipt.Debit.includes("الصندوق") || Receipt.Credit.includes("الصندوق")) {

            let CreatedBy = ''
            if (MainData._id == Receipt.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Receipt.CreatedBy)).Username }

            let Debit = 0, Credit = 0;
            if (Receipt.Debit.includes("الصندوق")) { Debit = Receipt.Total }
            else if (Receipt.Credit.includes("الصندوق")) { Credit = Receipt.Total }

            Balance = Balance + Debit - Credit
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
            SumDebit += Debit
            SumCredit += Credit
        }
    })
    document.querySelector(".Buttons-Container .SumDebit").innerText = SumDebit.toFixed(2)
    document.querySelector(".Buttons-Container .SumCredit").innerText = SumCredit.toFixed(2)
    document.querySelector(".Buttons-Container .FinalBalance").innerText = Balance.toFixed(2)
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
    let SumDebit = 0, SumCredit = 0, Balance = 0;
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
            SumDebit += parseFloat(TableObjDebit)
            SumCredit += parseFloat(TableObjCredit)
            Balance = parseFloat(TableObj.Balance)
        }
    })
    document.querySelector(".Buttons-Container .SumDebit").innerText = SumDebit.toFixed(2)
    document.querySelector(".Buttons-Container .SumCredit").innerText = SumCredit.toFixed(2)
    document.querySelector(".Buttons-Container .FinalBalance").innerText = Balance.toFixed(2)
}