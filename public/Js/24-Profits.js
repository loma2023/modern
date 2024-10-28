function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowAllReceipts(Data[0], Data[1]) })
        .then(() => { document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show GeneralData Data And Expenses Data 
function ShowAllReceipts(MainData, Decode) {
    let Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let ArabicMonth = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يوليو", "يونيو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    let IncomeStatement = [
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
        { Salse: 0, Purchases: 0, Revenues: 0, Expenses: 0 },
    ]

    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""
    let ThisMonth = new Date().getMonth()

    MainData.GeneralData.forEach(Receipt => {
        let ThisYear = new Date().toJSON().slice(0, 4)
        let MonthReceipt = new Date(Receipt.DocDate.slice(0, 7)).toString().slice(4, 15).replace(" 01 ", "-")
        let index = Months.findIndex(item => item == MonthReceipt.slice(0, 3))

        if (MonthReceipt.includes(MonthReceipt.slice(0, 3) + "-" + ThisYear)) {
            if (Receipt.DocType === "مبيعات") {
                IncomeStatement[index].Salse += Receipt.Total
                Receipt.Products.forEach(Product => {
                    IncomeStatement[index].Purchases += Product.PriceUnitBuy * Product.ConFactor
                })
            }
            if (Receipt.DocType === "مرتجع مبيعات") {
                IncomeStatement[index].Salse -= Receipt.Total
                Receipt.Products.forEach(Product => {
                    IncomeStatement[index].Purchases -= Product.PriceUnitBuy * Product.ConFactor
                })
            }

            if (Receipt.Credit === "الايرادات") { IncomeStatement[index].Revenues += Receipt.Total }
            if (Receipt.Debit === "المصاريف") { IncomeStatement[index].Expenses += Receipt.Total }
        }
    })
    let YearNetIncome = 0
    IncomeStatement.forEach((Income, index) => {
        let ClassMonth = ""
        let NetIncome = Income.Salse - Income.Purchases + Income.Revenues - Income.Expenses
        if (index === ThisMonth) {
            document.querySelector(".ProfitsThisMonth").innerText = NetIncome
            ClassMonth = "active"
        }
        Table.innerHTML += `
            <tr class="${ClassMonth}">
                <td>${ArabicMonth[index]}</td>
                <td>${Income.Salse}</td>
                <td>${Income.Purchases}</td>
                <td>${Income.Salse - Income.Purchases}</td>
                <td>${Income.Revenues} </td>
                <td>${Income.Expenses}</td>
                <td>${NetIncome}</td>
            </tr>`
        YearNetIncome += NetIncome
    });

    document.querySelector(".ProfitsThisYear").innerText = YearNetIncome
}
