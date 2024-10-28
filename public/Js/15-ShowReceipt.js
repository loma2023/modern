function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowReceipt(Data[0], Data[1]) })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show GeneralData Data And Expenses Data 
function ShowReceipt(MainData, Decode) {
    let Customers = MainData.CustomersData
    let FileID = document.querySelector(".Layout-Container").id
    let Receipt = {}
    if (FileID != "NewReceipt") { Receipt = (MainData.GeneralData.find(item => item._id == FileID)) }
    else { Receipt = (MainData.GeneralData[MainData.GeneralData.length - 1]) }

    if (Receipt.DocType.includes("مشتريات")) { Customers = MainData.SuppliersData }

    let NameCustomer = (Customers.find(item => item._id == Receipt.Name))

    document.querySelector(".NameCompany").innerText = MainData.NameCompany
    document.querySelector(".TypeCompany").innerText = MainData.TypeCompany
    let line1 = " - ", line2 = " - ";
    if (MainData.CityCompany === "" || MainData.AddressCompany === "") { line1 = "" }
    document.querySelector(".AddressCompany span").innerText = MainData.CityCompany + line1 + MainData.AddressCompany
    if (MainData.PhoneCompany1 === "" || MainData.PhoneCompany2 === "") { line2 = "" }
    document.querySelector(".PhoneCompany span").innerText = MainData.PhoneCompany1 + line2 + MainData.PhoneCompany2

    if (MainData.LogoCompany != "") { document.querySelector(".Details-Company .Logo").src = MainData.LogoCompany }
    else { document.querySelector(".Details-Company .Logo").src = "Img/Logo2.png" }

    document.querySelector(".Title-Container").innerText = "فاتورة " + Receipt.DocType
    document.querySelector(".DocNu").innerText = Receipt.DocNu
    document.querySelector(".DocDate").innerText = Receipt.DocDate
    document.querySelector(".TypeAmount").innerText = Receipt.TypeAmount

    document.querySelector(".NameCustomer").innerText = NameCustomer.Name
    document.querySelector(".AddressCustomer").innerText = NameCustomer.Address
    document.querySelector(".PhoneCustomer").innerText = NameCustomer.Phone

    document.querySelector(".SubTotal").innerText = Receipt.SubTotal
    document.querySelector(".Discount").innerText = Receipt.Discount
    document.querySelector(".Total").innerText = Receipt.SubTotal - Receipt.Discount

    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""
    Receipt.Products.forEach((Product, index) => {
        let NameItem = (MainData.ProductsData.find(item => item._id == Product.NameItem)).Name
        Table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${NameItem}</td>
            <td>${Product.UnitsItem}</td>
            <td>${Product.QtyItem}</td>
            <td>${Product.PriceItem}</td>
            <td>${Product.TotalItem}</td>
        </tr>`
    })

    setTimeout(() => { print() }, 1500);
}
