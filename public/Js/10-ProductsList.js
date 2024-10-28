let Table = document.querySelector(".Table-body")
function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowProductsList(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Products List 
function ShowProductsList(MainData, Decode) {
    Table.innerHTML = ""
    MainData.ProductsData.forEach((Product, index) => {
        if (Product.Status === "TRUE") {
            let CreatedBy = ''
            if (MainData._id == Product.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Product.CreatedBy)).Username }

            let UnitsInner = ""
            let UnitsArr = Product.Units
            UnitsArr.forEach((Unit, index) => {
                let plus = ""
                if (index != UnitsArr.length - 1) { plus = "-" }
                UnitsInner += `
            <span>${Unit.NameUnit}  ${Unit.PriceUnitSales}</span>
            <span> ${plus} </span>`
            });

            Table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${Product.Barcode}</td>
            <td>${Product.Name}</td>
            <td><div>${UnitsInner}</div></td>
        </tr>`
        }
    });

    document.querySelector(".TableLength").innerText = MainData.ProductsData.length
}
// Function to make Table into array
function CreateArray() {
    let AllRows = Table.querySelectorAll("tr")
    TableArray = []; let TableObj = {}
    AllRows.forEach((Row) => {
        TableObj = {
            Barcode: Row.querySelectorAll("td")[1].innerText,
            Name: Row.querySelectorAll("td")[2].innerText,
            Unit: Row.querySelectorAll("td")[3].querySelector("div").innerText,
        }
        TableArray.push(TableObj)
    });
}

