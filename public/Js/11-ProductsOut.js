let Table = document.querySelector(".Table-body")
function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowProductsOut(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Products Out
function ShowProductsOut(MainData, Decode) {
    Table.innerHTML = ""
    let TableLength = 0, LastDateBuy = "--", LastDateSale = "--"
    MainData.ProductsData.forEach((Product, index) => {
        if (Product.Status === "TRUE") {
            let CreatedBy = ''
            if (MainData._id == Product.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Product.CreatedBy)).Username }

            let QtyIn = Product.Balance, QtyOut = 0;
            MainData.GeneralData.forEach((Receipt) => {
                if (Receipt.DocType == "مشتريات") { LastDateBuy = Receipt.DocDate.slice(0, 10) }
                if (Receipt.DocType == "مبيعات") { LastDateSale = Receipt.DocDate.slice(0, 10) }

                Receipt.Products.forEach((ReceiptItem) => {
                    if (ReceiptItem.NameItem === Product._id) {
                        if (Receipt.DocType === "مشتريات" || Receipt.DocType === "مرتجع مبيعات") {
                            QtyIn = QtyIn + ReceiptItem.ConFactor
                        }
                        if (Receipt.DocType === "مبيعات" || Receipt.DocType === "مرتجع مشتريات") {
                            QtyOut = QtyOut + ReceiptItem.ConFactor
                        }
                    }
                })
            })

            let Balance = QtyIn - QtyOut
            let InnerTxtArr = []
            let indexNum = 0
            let UnitsArr = Product.Units
            for (let i = UnitsArr.length - 1; i > -1; i--) {
                let MaxUnit = UnitsArr[UnitsArr.length - 1].QtyUnit
                let Num = parseInt((Balance / MaxUnit))
                if (i == UnitsArr.length - 2) {
                    Num = parseInt((Balance - (Num * MaxUnit)) / UnitsArr[i].QtyUnit)
                    indexNum = Num * UnitsArr[i].QtyUnit
                } else if (i < UnitsArr.length - 2) {
                    Num = parseInt((Balance - ((Num * MaxUnit) + indexNum)) / UnitsArr[i].QtyUnit)
                    indexNum = Num * UnitsArr[i].QtyUnit
                }
                let Obj = { NuUnit: Num, NameUnit: UnitsArr[i].NameUnit }
                if (Num != 0) { InnerTxtArr.push(Obj) }
            }

            let BalanceInner = ""
            InnerTxtArr.forEach((Txt, index) => {
                let plus = ""
                if (index != InnerTxtArr.length - 1) { plus = "+" }
                BalanceInner += `
            <span>${Txt.NuUnit}  ${Txt.NameUnit}</span>
            <span> ${plus} </span>`
            })


            if (Balance < Product.MinQty) {
                TableLength++
                Table.innerHTML += `
                    <tr>
                        <td>${TableLength}</td>
                        <td>${Product.Barcode}</td>
                        <td>${Product.Name}</td>
                        <td>${Product.MinQty + " " + UnitsArr[0].NameUnit}</td>
                        <td><div>${BalanceInner}</div></td>
                        <td>${LastDateBuy}</td>
                        <td>${LastDateSale}</td>
                    </tr>`
            }
        }
    });
    document.querySelector(".TableLength").innerText = TableLength
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
            MinQty: Row.querySelectorAll("td")[4].innerText,
            Balance: Row.querySelectorAll("td")[5].querySelector("div").innerText,
            LastDateBuy: Row.querySelectorAll("td")[6].innerText,
            LastDateSale: Row.querySelectorAll("td")[7].innerText,
        }
        TableArray.push(TableObj)
    });
}
// Function to Search
function Search() {
    let SearchInput = document.querySelector(".SearchInput")
    Table.innerHTML = ""
    TableArray.forEach((TableObj, index) => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }

        if (SearchBy.includes(SearchInput.value)) {
            Table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${TableObj.Barcode}</td>
                <td>${TableObj.Name}</td>
                 <td>${TableObj.MinQty}</td>
                <td><div>${TableObj.BalanceInner}</div></td>
                <td>${TableObj.LastDateBuy}</td>
                <td>${TableObjLastDateSale}</td>
            </tr>`
        }
    })
}