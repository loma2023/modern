let BalanceInner = "", Product = []
let Units = document.querySelector('.UnitsParent')
let RowFixed = Units.innerHTML
function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowProductData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

// Show Product Data And Supplier Data 
function ShowProductData(MainData, Decode) {
    let FileID = document.querySelector(".FileID").id
    let FileIndex = document.querySelector(".FileID").getAttribute("index")

    let Table = document.querySelector(".Table-body")
    Table.innerHTML = ""

    Product = MainData.ProductsData[FileIndex];
    let FinalQtyIn = 0, FinalQtyOut = 0, Balance = 0, FinalBalance = 0;

    let UnitsArr = Product.Units, UnitsInner = "";
    UnitsArr.forEach((Unit, index) => {
        let plus = ""
        if (index != UnitsArr.length - 1) { plus = "," }
        UnitsInner += `
            <span>${Unit.NameUnit}  ${Unit.PriceUnitSales}</span>
            <span> ${plus} </span>`
    });
    document.querySelector(".Person-Details .Name").innerText = Product.Name
    document.querySelector(".Person-Details .Barcode").innerText = Product.Barcode
    document.querySelector(".Person-Details .Units").innerHTML = `<div>${UnitsInner}</div>`
    document.querySelector(".Person-Details .MinQty").innerText = Product.MinQty + " " + Product.Units[0].NameUnit
    document.querySelector(".Person-Details .Balance").setAttribute("Balance", Product.Balance)

    if (Product.Balance !== 0) {

        let CreatedBy = ''
        if (MainData._id == Product.CreatedBy) { CreatedBy = MainData.Username }
        else { (MainData.UsersData.find(User => User._id == Product.CreatedBy)).Username }

        FinalQtyIn = Product.Balance
        Balance = Product.Balance

        GetBalanceInner(UnitsArr, Balance)

        Table.innerHTML += `
            <tr>
                <td>1</td>
                <td>${Product.CreatedAt.slice(0, 10)} </td>
                <td></td>
                <td>رصيد افتتاحي</td>
                <td>رصيد افتتاحي</td>
                <td>${Product.Balance + " " + Product.Units[0].NameUnit}</td>
                <td>0</td>
                <td><div>${BalanceInner}</div></td>
                <td>${CreatedBy}</td>
            </tr>`
    }
    MainData.GeneralData.forEach(Receipt => {
        Receipt.Products.forEach(Product => {
            index = Table.querySelectorAll("tr").length + 1
            if (Product.NameItem === FileID) {

                let CreatedBy = ''
                if (MainData._id == Receipt.CreatedBy) { CreatedBy = MainData.Username }
                else { CreatedBy = (MainData.UsersData.find(User => User._id == Receipt.CreatedBy)).Username }

                let QtyIn = 0, QtyOut = 0;
                if (Receipt.DocType === "مشتريات" || Receipt.DocType === "مرتجع مبيعات") { QtyIn = Product.ConFactor }
                if (Receipt.DocType === "مبيعات" || Receipt.DocType === "مرتجع مشتريات") { QtyOut = Product.ConFactor }

                Balance = Balance + QtyIn - QtyOut

                GetBalanceInner(UnitsArr, Balance)

                let QtyInTxt = 0, QtyOutTxt = 0
                if (QtyIn > 0) { QtyInTxt = Product.QtyItem + " " + Product.UnitsItem }
                if (QtyOut > 0) { QtyOutTxt = Product.QtyItem + " " + Product.UnitsItem }

                Table.innerHTML += `
                    <tr>
                        <td>${index}</td>
                        <td>${Receipt.DocDate}</td>
                        <td>${Receipt.DocNu}</td>
                        <td>${Receipt.DocType}</td>
                        <td>${Receipt.Statment}</td>
                        <td>${QtyInTxt}</td>
                        <td>${QtyOutTxt}</td>
                        <td><div>${BalanceInner}</div></td>
                        <td>${CreatedBy}</td>
                    </tr>`
                FinalQtyIn = FinalQtyIn + QtyIn
                FinalQtyOut = FinalQtyOut + QtyOut
                FinalBalance = BalanceInner
            }
        })
    })
    document.querySelector(".Person-Details .QtyIn").innerText = FinalQtyIn
    document.querySelector(".Person-Details .QtyOut").innerText = FinalQtyOut
    document.querySelector(".Person-Details .Balance").innerHTML = `<div>${FinalBalance}</div>`
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
            QtyOut: Row.querySelectorAll("td")[5].innerText,
            QtyIn: Row.querySelectorAll("td")[6].innerText,
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
                <td>${TableObj.QtyOut}</td>
                <td>${TableObj.QtyIn}</td>
                <td>${TableObj.Balance}</td>
                <td>${TableObj.CreatedBy}</td>
            </tr>`
        }
    })
}


// Function to Get Price Product
function GetBalanceInner(UnitsArr, Balance) {
    BalanceInner = "";
    let InnerTxtArr = [], indexNum = 0;
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

    InnerTxtArr.forEach((Txt, index) => {
        let plus = ""
        if (index != InnerTxtArr.length - 1) { plus = "+" }
        BalanceInner += `
            <span>${Txt.NuUnit}  ${Txt.NameUnit}</span>
            <span> ${plus} </span>`
    })
}
// Function to Delete Product
function DeleteData(id) {
    fetch("/ProductsData" + id, { method: "DELETE" })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") {
                FetchData(), Hide_Container()
                location.href = "/ProductsData"
            }
        })
        .catch((err) => { return location.href = "/Error" })
}
// Function To Set Data Into Form
function EditData(id) {
    let Form = document.querySelector(".Form-ADD")
    let UnitsParent = Form.querySelector(".UnitsParent")

    Form.classList.toggle("active")
    Form.querySelectorAll("input")[1].focus()

    Form.querySelector(".Name").value = Product.Name;
    Form.querySelector(".Barcode").value = Product.Barcode;
    Form.querySelector(".MinQty").value = Product.MinQty;
    Form.querySelector(".Balance").value = Product.Balance

    if (Product.Units.length <= 1) { UnitsParent.innerHTML = RowFixed }
    else { UnitsParent.innerHTML = "" }

    Product.Units.forEach((Unit, index) => {
        Form.querySelector(".MainUnit").value = Product.Units[0].NameUnit
        Form.querySelector(".PriceMainUnitSales").value = Product.Units[0].PriceUnitSales
        Form.querySelector(".PriceMainUnitBuy").value = Product.Units[0].PriceUnitBuy
        let TxtBtn = "Delete", BXTxt = "trash"
        if (index + 1 == Product.Units.length) { TxtBtn = "plus"; BXTxt = "plus" }
        if (index > 0) {
            UnitsParent.innerHTML += `
                            <div class="Row grid-7">
                                <h4>الوحدة</h4>
                                <div class="input-box">
                                    <input type="text" value="${Unit.NameUnit}" class="SubUnit" onchange="ChangeLabelTxt(event)" required>
                                </div>
                                <h4 class="LabelInclude"> 1 ${Unit.NameUnit} تحتوي علي كم ${Product.Units[0].NameUnit}</h4>
                                <div class="input-box">
                                    <input type="number" value="${Unit.QtyUnit}" min="1" class="IncludeSubUnit" required>
                                </div>
                                <h4 class="LabelPrice">سعر بيع ${Unit.NameUnit}</h4>
                                <div class="input-box">
                                    <input type="number" value="${Unit.PriceUnitSales}" min="1" class="PriceSubUnitSales" required>
                                </div>
                                <h4 class="LabelPrice">سعر شراء ${Unit.NameUnit}</h4>
                                <div class="input-box">
                                    <input type="number" value="${Unit.PriceUnitBuy}" min="1" class="PriceSubUnitBuy" required>
                                </div>
                                <div class="btn-box">
                                    <div class="tooltip arr-left-center">اضافة صنف</div>
                                    <button type="button" class="btn btn-${TxtBtn} bx bx-${BXTxt}" id="1"
                                        onclick="AddOrRemoveItem(event)">
                                    </button>
                                </div>
                            </div>`
        }

    });
    Form.querySelector('.btn-Save').id = id
}
// Function to Add Or Remove Item
function AddOrRemoveItem(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement

    if (btn.classList.contains('btn-Delete')) {
        parent.remove()
    } else {
        $('.UnitsParent').append(`${RowFixed}`);
        document.querySelector(".UnitsParent").scrollTop = 1000
    }

    let Rows = Units.querySelectorAll('.Row')
    Rows.forEach((Row, index) => {
        if (Rows.length - 1 == index) {
            Row.querySelector("button").classList.replace("btn-Delete", "btn-plus")
            Row.querySelector("button").classList.replace("bx-trash", "bx-plus")
            Row.querySelector(".tooltip").innerText = "اضافة وحدة"
        } else {
            Row.querySelector("button").classList.replace("btn-plus", "btn-Delete")
            Row.querySelector("button").classList.replace("bx-plus", "bx-trash")
            Row.querySelector(".tooltip").innerText = "حذف الوحدة"
        }
    });
}
// Function To Edit Product Data
function EditProduct(id) {
    let Form = document.querySelector(".Form-ADD");
    let Name = Form.querySelector('.Name');
    let NameUnit = Form.querySelector('.MainUnit');
    let PriceUnitSales1 = Form.querySelector('.PriceMainUnitSales')
    let PriceUnitBuy1 = Form.querySelector('.PriceMainUnitBuy')

    let Barcode = Form.querySelector('.Barcode').value;
    let MinQty = Form.querySelector('.MinQty').value;
    let Balance = Form.querySelector('.Balance').value;

    Name.classList.remove("Required");
    NameUnit.classList.remove("Required");
    PriceUnitSales1.classList.remove("Required");
    PriceUnitBuy1.classList.remove("Required");

    if (Name.value.trim() == "") { Name.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال اسم المنتج ",); }
    if (NameUnit.value.trim() == "") { NameUnit.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال اسم الوحدة الاساسية ",); }
    if (PriceUnitSales1.value.trim() == "") { PriceUnitSales1.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال سعر بيع الوحدة الاساسية ",); }
    if (PriceUnitBuy1.value.trim() == "") { PriceUnitBuy1.classList.add("Required"); return Toast(id = "Notification", txt = "يرجي إدخال سعر شراء الوحدة الاساسية ",); }

    let Rows = Form.querySelectorAll(".UnitsParent .Row")
    let MyArray = [{
        NameUnit: NameUnit.value,
        QtyUnit: 1,
        ConFactor: 1,
        PriceUnitBuy: PriceUnitBuy1.value,
        PriceUnitSales: PriceUnitSales1.value,
    }]
    Rows.forEach((Row, index) => {
        let QtyUnit = Row.querySelector('.IncludeSubUnit').value
        let ConFactor = QtyUnit * MyArray[index].ConFactor
        let NameUnit = Row.querySelector('.SubUnit').value
        let obj = {
            NameUnit: NameUnit,
            QtyUnit: QtyUnit,
            ConFactor: ConFactor,
            PriceUnitBuy: Row.querySelector('.PriceSubUnitBuy').value,
            PriceUnitSales: Row.querySelector('.PriceSubUnitSales').value,
        }
        if (NameUnit != "") { MyArray.push(obj) }
    });

    fetch("/ProductsData" + id, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Name: Name.value, Barcode: Barcode, MinQty: MinQty,
            Balance: Balance, Units: MyArray,
        })
    })
        .then((res) => res.json())
        .then((Data) => {
            Toast(id = Data.id, txt = Data.txt,);
            if (Data.id === "Success") { FixedForm.innerHTML = FormHTML; FetchData(), Hide_Container() }
        })
        .catch((err) => { return location.href = "/Error" })
}