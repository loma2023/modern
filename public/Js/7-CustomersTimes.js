function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowCustomersOrSuppliersTimes(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Customers Data And Suppliers Data 
function ShowCustomersOrSuppliersTimes(MainData, Decode) {
    let CustomersTimes = MainData.TimeCustomersData

    if (Title.includes("للموردين")) { CustomersTimes = MainData.TimeSuppliersData }

    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""
    let SumDebit = 0
    CustomersTimes.forEach(Time => {
        index = Table.querySelectorAll("tr").length + 1

        let CreatedBy = ''
        if (MainData._id == Time.CreatedBy) { CreatedBy = MainData.Username }
        else { CreatedBy = (MainData.UsersData.find(User => User._id == Time.CreatedBy)).Username }
        Table.innerHTML += `
            <tr id="${Time._id}">
                <td>${index}</td>
                <td>${Time.DocDate}</td>
                <td>${Time.Name} </td>
                <td>${Time.Statment}</td>
                <td>${Time.Total}</td>
                <td>${CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">حذف</div>
                            <button type="button" onclick="Show_Alert(id)" id="${Time._id}" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        SumDebit += Time.Total
    })
    document.querySelector(".SumDebit").innerText = SumDebit.toFixed(2)
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
            Name: Row.querySelectorAll("td")[2].innerText,
            Statment: Row.querySelectorAll("td")[3].innerText,
            Total: Row.querySelectorAll("td")[4].innerText,
            CreatedBy: Row.querySelectorAll("td")[5].innerText,
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
    let SumDebit = 0.00
    TableArray.forEach(TableObj => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "Statment") { SearchBy = TableObj.Statment }
        if (SearchBy == "User") { SearchBy = TableObj.CreatedBy }

        let index = Table.querySelectorAll("tr")
        if (TableObj.DocDate >= SDate && TableObj.DocDate <= EDate && SearchBy.includes(SearchInput.value)) {
            Table.innerHTML += `
            <tr id="${TableObj.ID}">
                <td>${index.length + 1}</td>
                <td>${TableObj.DocDate}</td>
                <td>${TableObj.Name}</td>
                <td>${TableObj.Statment}</td>
                <td>${TableObj.Total}</td>
                <td>${TableObj.CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">حذف</div>
                            <button type="button" onclick="Show_Alert(id)" id="${TableObj.ID}" class="btn btn-Delete bx bxs-trash">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
            SumDebit += parseFloat(TableObj.Total)
        }
    })
    document.querySelector(".SumDebit").innerText = SumDebit.toFixed(2)
}


// Function to Delete Customer Or Supplier
function DeleteData(id) {
    let link = "/NewTimeCustomer"
    if (Title.includes("للموردين")) { link = "/NewTimeSupplier" }
    let page = link + id

    fetch(page, { method: "DELETE" })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}