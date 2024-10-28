let Table = document.querySelector(".Table-body")
let FixedForm = document.querySelector(".Form-Product")
let FormHTML = FixedForm.innerHTML
let Units = document.querySelector('.UnitsParent')
let RowFixed = Units.querySelectorAll('.Row')[0].innerHTML

function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { ShowProductsData(Data[0], Data[1]) })
        .then(() => { CreateArray(); document.querySelector(".Loader").style = "display:none;" })
        .catch((err) => { return location.href = "/Error" })
} FetchData()
// Show Products Data 
function ShowProductsData(MainData, Decode) {
    Table.innerHTML = ""
    let TableLength = 0
    MainData.ProductsData.forEach((Product, index) => {
        if (Product.Status != "FALSE") {
            let CreatedBy = ''
            if (MainData._id == Product.CreatedBy) { CreatedBy = MainData.Username }
            else { CreatedBy = (MainData.UsersData.find(User => User._id == Product.CreatedBy)).Username }

            let QtyIn = Product.Balance, QtyOut = 0;
            MainData.GeneralData.forEach((Receipt) => {
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
            let InnerTxtArr = [], indexNum = 0, UnitsArr = Product.Units

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
            let UnitsInner = ""
            UnitsArr.forEach((Unit, index) => {
                let plus = ""
                if (index != UnitsArr.length - 1) { plus = "," }
                UnitsInner += `
                    <span>${Unit.NameUnit}  ${Unit.PriceUnitSales}</span>
                    <span> ${plus} </span>`
            });
            TableLength++
            Table.innerHTML += `
            <tr id="${Product._id}">
                <td>${TableLength}</td>
                <td>${Product.Barcode}</td>
                <td>${Product.Name}</td>
                <td><div>${UnitsInner}</div></td>
                <td>${Product.MinQty + " " + UnitsArr[0].NameUnit}</td>
                <td><div>${BalanceInner}</div></td>
                <td>${Product.UpdatedAt.slice(0, 10)}</td>
                <td>${CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">عرض ملف المنتج</div>
                            <button type="button" class="btn btn-File bx bxs-file" id="${Product._id}"
                                onclick="location.href='ProductFile-${Product._id + "-" + index}'">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
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
            ID: Row.id,
            Barcode: Row.querySelectorAll("td")[1].innerText,
            Name: Row.querySelectorAll("td")[2].innerText,
            Unit: Row.querySelectorAll("td")[3].querySelector("div").innerText,
            MinQty: Row.querySelectorAll("td")[4].innerText,
            Balance: Row.querySelectorAll("td")[5].querySelector("div").innerText,
            UpdatedAt: Row.querySelectorAll("td")[6].innerText,
            CreatedBy: Row.querySelectorAll("td")[7].innerText,
            OnClick: Row.querySelectorAll("td")[8].querySelectorAll("button")[0].getAttribute("onclick"),
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
    let TableLength = 0
    TableArray.forEach((TableObj, index) => {
        let SearchBy = SearchInput.id.replace("SearchBy", "")
        if (SearchBy == "Name") { SearchBy = TableObj.Name }
        if (SearchBy == "Barcode") { SearchBy = TableObj.Barcode }
        if (SearchBy == "User") { SearchBy = TableObj.CreatedBy }

        if (TableObj.UpdatedAt >= SDate && TableObj.UpdatedAt <= EDate && SearchBy.includes(SearchInput.value)) {
            TableLength++
            Table.innerHTML += `
            <tr id="${TableObj.ID}">
                <td>${TableLength}</td>
                <td>${TableObj.Barcode}</td>
                <td>${TableObj.Name}</td>
                <td><div>${TableObj.Unit}</div></td>
                <td>${TableObj.MinQty}</td>
                <td><div>${TableObj.Balance}</div></td>
                <td>${TableObj.UpdatedAt.slice(0, 10)}</td>
                <td>${TableObj.CreatedBy}</td>
                <td>
                    <div class="FlexTD">
                        <div class="btn-box">
                            <div class="tooltip">عرض ملف المنتج</div>
                            <button type="button" class="btn btn-File bx bxs-file" id="${TableObj.ID}"
                                onclick="${TableObj.OnClick}">
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`
        }
    });
    document.querySelector(".TableLength").innerText = TableLength
}


// New ProductData 
function NewProduct() {
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

    fetch("/ProductsData", {
        method: "POST",
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
// Function to Add Or Remove Item
function AddOrRemoveItem(event) {
    let btn = event.target;
    let parent = btn.parentElement.parentElement

    if (btn.classList.contains('btn-Delete')) {
        parent.remove()
    } else {
        $('.UnitsParent').append(`<div class="Row grid-7"> ${RowFixed}</div> `);
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
// Function to Change Label Txt
function ChangeLabelTxt(event) {
    let Form = document.querySelector(".Form-Product")
    let input = event.target
    let parent = input.parentElement.parentElement.parentElement;

    if (input.classList.contains("MainUnit")) {
        parent.querySelectorAll(".LabelPrice")[0].innerText = "سعر بيع الـ " + input.value
        parent.querySelectorAll(".LabelPrice")[1].innerText = "سعر شراء الـ " + input.value
        parent.querySelectorAll(".LabelMinQty")[0].innerText = "حد اعادة الطلب بالـ " + input.value
        Form.querySelector(".LabelBalance").innerText = "الرصيد الافتتاحي بالـ " + input.value
    }
    if (input.classList.contains("SubUnit")) {
        let MainUnit = document.querySelector(".MainUnit")
        let Rows = document.querySelectorAll(".UnitsParent .Row")
        Rows[0].querySelector(".LabelInclude").innerText = "1 " + Rows[0].querySelector(".SubUnit").value + " يحتوي علي كم " + MainUnit.value
        Rows.forEach((Row, index) => {
            if (index > 0) {
                Row.querySelector(".LabelInclude").innerText = "1 " + Row.querySelector(".SubUnit").value + " يحتوي علي كم " + Rows[index - 1].querySelector(".SubUnit").value
            }
            Row.querySelectorAll(".LabelPrice")[0].innerText = "سعر بيع الـ " + Row.querySelector(".SubUnit").value
            Row.querySelectorAll(".LabelPrice")[1].innerText = "سعر شراء الـ " + Row.querySelector(".SubUnit").value
        });
    }
}