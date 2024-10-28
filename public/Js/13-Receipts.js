let Table = document.querySelector('.Table-body')
let RowFixed = Table.querySelectorAll('tr')[0].innerHTML
let NuReceipt = document.querySelector('.NuReceipt')

if (document.querySelector('.DocDate').value == "") {
  document.querySelector('.DocDate').value = ToDay
}

let Products = [], Customers = []
fetch("/MainData.JSON")
  .then((res) => res.json())
  .then((MainData) => {
    //  بيانات المنتجات
    Products = MainData[0].ProductsData
    // بيانات العملاء او الموردين
    Customers = MainData[0].CustomersData
    if (Title.includes("مشتريات")) { Customers = MainData.SuppliersData }

    // عشان اجيب رقم الفاتورة
    let Number = 1
    MainData[0].GeneralData.forEach(Receipt => { if (!Receipt.DocType.includes("سند")) { Number++ } });
    if (NuReceipt.innerText == "") { NuReceipt.innerText = Number }
  })

// Function NewReceipt
function NewReceipt(event) {
  let Btn = event.target;
  let Status = Btn.getAttribute("Status")
  let ElmDocType = document.querySelector('.DocType')
  let ElmNamePerson = document.querySelector('.NamePerson');
  let ElmTypeAmount = document.querySelector('.TypeAmount')
  let DocType = ElmDocType.value
  let NamePerson = ElmNamePerson.id;
  let TypeAmount = ElmTypeAmount.value
  let SubTotal = parseFloat(document.querySelector('.SubTotal').innerText);
  let Discount = document.querySelector('.Discount').value;
  let Total = SubTotal - Discount

  let txt = 'يرجي إدخال اسم العميل '
  if (Title.includes("مشتريات")) { txt = 'يرجي إدخال اسم المورد ' }

  ElmDocType.classList.remove("Required");
  ElmNamePerson.classList.remove("Required");
  ElmTypeAmount.classList.remove("Required");

  if (Status !== "True") { return Toast(id = 'Notification', txt = "تم حفظ الفاتورة بالفعل",) }

  if (DocType == 'empty') { ElmDocType.classList.add("Required"); return Toast(id = 'Notification', txt = "يرجي تحديد نوع الفاتورة",) }
  if (NamePerson == 'empty') { ElmNamePerson.classList.add("Required"); return Toast(id = 'Notification', txt = txt,) }

  if (Btn.id == "Save") {
    if (Table.querySelectorAll('.NameItem')[0].id == 'empty') {
      return Toast(id = 'Notification', txt = 'يرجي إدخال منتج واحد على الاقل ',);
    }
  }
  if (Btn.id != "Save") {
    if (Table.querySelectorAll('.NameItem')[1].id == 'empty') {
      return Toast(id = 'Notification', txt = 'يرجي إدخال منتج واحد على الاقل ',);
    }
  }
  if (TypeAmount == 'empty') { ElmTypeAmount.classList.add("Required"); return Toast(id = 'Notification', txt = "يرجي تحديد طريقة الدفع",) }

  let Statment = "", Debit = "", Credit = "", SubDebit = "", SubCredit = "";

  // في حالة المبيعات النقدية
  if (DocType === "مبيعات" && TypeAmount === "نقدي") {
    Statment = "مبيعات نقدية", Debit = "الصندوق", Credit = "المبيعات", SubDebit = "مقبوضات", SubCredit = "مبيعات نقدية";
  }
  // في حالة المبيعات الآجلة
  if (DocType === "مبيعات" && TypeAmount === "آجل") {
    Statment = "مبيعات آجلة", Debit = "العملاء", Credit = "المبيعات", SubDebit = NamePerson, SubCredit = "مبيعات آجلة";
  }
  // في حالة مرتجع المبيعات النقدية
  if (DocType === "مرتجع مبيعات" && TypeAmount === "نقدي") {
    Statment = "مرتجع مبيعات نقدي", Debit = "المبيعات", Credit = "الصندوق", SubDebit = "مرتجع مبيعات نقدي", SubCredit = "مدفوعات";
  }
  // في حالة مرتجع المبيعات الآجلة
  if (DocType === "مرتجع مبيعات" && TypeAmount === "آجل") {
    Statment = "مرتجع مبيعات آجل", Debit = "المبيعات", Credit = "العملاء", SubDebit = "مرتجع مبيعات آجل", SubCredit = NamePerson;
  }
  // في حالة المشتريات النقدية
  if (DocType === "مشتريات" && TypeAmount === "نقدي") {
    Statment = "مشتريات نقدية", Debit = "المشتريات", Credit = "الصندوق", SubDebit = "مشتريات نقدية", SubCredit = "مدفوعات";
  }
  // في حالة المشتريات الآجلة
  if (DocType === "مشتريات" && TypeAmount === "آجل") {
    Statment = "مشتريات آجلة", Debit = "المشتريات", Credit = "الموردين", SubDebit = "مشتريات آجلة", SubCredit = NamePerson;
  }
  // في حالة مرتجع المشتريات النقدية
  if (DocType === "مرتجع مشتريات" && TypeAmount === "نقدي") {
    Statment = "مرتجع مشتريات نقدي", Debit = "الصندوق", Credit = "المشتريات", SubDebit = "مقبوضات", SubCredit = "مرتجع مشتريات نقدي";
  }
  // في حالة مرتجع المشتريات الآجلة
  if (DocType === "مرتجع مشتريات" && TypeAmount === "آجل") {
    Statment = "مرتجع مشتريات آجل", Debit = "الموردين", Credit = "المشتريات", SubDebit = NamePerson, SubCredit = "مرتجع مشتريات آجل";
  }

  let ProductArray = []
  let Rows = Table.querySelectorAll('tr')

  Rows.forEach((Row, index) => {
    let obj = {
      NameItem: Row.querySelector('.NameItem').id,
      UnitsItem: Row.querySelector('.UnitsItem').value,
      PriceUnitBuy: Row.querySelector('.UnitsItem')
        .options[Row.querySelector('.UnitsItem').selectedIndex].getAttribute("PriceUnitBuy"),
      ConFactor: Row.querySelector('.UnitsItem')
        .options[Row.querySelector('.UnitsItem').selectedIndex].getAttribute("ConFactor") * Row.querySelector('.QtyItem').value,
      QtyItem: Row.querySelector('.QtyItem').value,
      PriceItem: Row.querySelector('.PriceItem').value,
      TotalItem: Row.querySelector('.TotalItem').value,
    }
    if (Btn.id != "Save" && index > 0 || Btn.id == "Save") { ProductArray.push(obj) }
  });

  let Link = '/GeneralData', Method = 'POST', ShowReceipt = "NewReceipt"
  if (Btn.id != "Save") { Link = '/GeneralData' + Btn.id; Method = 'PUT'; ShowReceipt = Btn.id }

  fetch(Link, {
    method: Method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DocNu: NuReceipt.innerText, DocType: DocType, TypeAmount: TypeAmount, Name: NamePerson,
      DocDate: document.querySelector('.DocDate').value, Statment: Statment, Debit: Debit, Credit: Credit,
      SubDebit: SubDebit, SubCredit: SubCredit, SubTotal: SubTotal, Discount: Discount, Total: Total, Products: ProductArray,
    })
  })
    .then((res) => res.json())
    .then((Data) => {
      Toast(id = Data.id, txt = Data.txt,);
      if (Data.id === "Success") {
        document.querySelectorAll('.btn-Receipt')[0].setAttribute("Status", "False")
        document.querySelectorAll('.btn-Receipt')[1].setAttribute("Status", "False")
        if (Btn.classList.contains("btn-print")) { location.href = "ShowReceipt" + ShowReceipt }
      }
    })
    .catch((err) => { return location.href = "/Error" })
}
// Function Barcode Reader 
function BarcodeReader(event) {
  let input = event.target;
  let parent = input.parentElement.parentElement
  let value = input.value

  let NameItem = parent.querySelector(".NameItem")
  let Units = parent.querySelector('.UnitsItem')
  Units.innerHTML = `<option value="empty" selected disabled hidden>الوحده</option>`
  let inputs = parent.querySelectorAll("input")
  inputs.forEach(input => { input.value = "0" });
  parent.querySelector(".SearchInput").value = ""
  NameItem.value = "الصنف"
  NameItem.id = "empty"
  input.value = ""

  Products.forEach((Product, index) => {
    if (Product.Barcode === value) {
      NameItem.value = Product.Name
      NameItem.id = Product._id
      input.setAttribute("index", index)
      GetUnitsAndPriceItem(event)
    }
  });
}
// Function Get & Set Units & Price Item
function GetUnitsAndPriceItem(event) {
  let input = event.target;
  let parent = input.parentElement.parentElement;
  let PriceItem
  if (input.classList.contains("Part1")) {
    let ItemSelected = Products[input.getAttribute('index')]

    if (!input.classList.contains("Barcode")) {
      parent = input.parentElement.parentElement.parentElement.parentElement.parentElement
    }

    parent.querySelector(".Barcode").value = ItemSelected.Barcode
    // عشان اجيب وحدات الصنف واحطهم في سلكت
    let UnitsItemSlct = ItemSelected.Units
    let SlctUnitsItem = parent.querySelector(".UnitsItem")
    SlctUnitsItem.innerHTML = ""
    UnitsItemSlct.forEach(Unit => {
      SlctUnitsItem.innerHTML +=
        `<option ConFactor="${Unit.ConFactor}"
              PriceUnitBuy="${Unit.PriceUnitBuy}"
                PriceUnitSales="${Unit.PriceUnitSales}"
                  value="${Unit.NameUnit}">${Unit.NameUnit}</option>`
    });

    if (Title.includes("مبيعات")) { PriceItem = ItemSelected.Units[0].PriceUnitSales }
    else { PriceItem = ItemSelected.Units[0].PriceUnitBuy }

  } else {
    let SlctUnitsItem = parent.querySelector(".UnitsItem")
    if (Title.includes("مبيعات")) {
      PriceItem = SlctUnitsItem.options[SlctUnitsItem.selectedIndex].getAttribute('PriceUnitSales')
    } else {
      PriceItem = SlctUnitsItem.options[SlctUnitsItem.selectedIndex].getAttribute('PriceUnitBuy')
    }
  }

  parent.querySelector('.PriceItem').value = parseFloat(PriceItem).toFixed(2)
  parent.querySelector('.TotalItem').value = parseFloat(PriceItem).toFixed(2)
  parent.querySelector('.QtyItem').value = 1
  parent.querySelector('.QtyItem').focus()
  TotalReceipt()
}
// Function Add Or Remove Row Item 
function AddOrRemoveItem(event) {
  let btn = event.target;
  let parent = btn.parentElement.parentElement.parentElement.parentElement

  if (btn.classList.contains('btn-Delete')) {
    parent.remove()
  } else {
    $('.Table-body').append(`<tr> ${RowFixed}</tr>`);
    document.querySelector(".Table-Container").scrollTop = 1000
  }

  let Rows = Table.querySelectorAll('tr')
  Rows.forEach((Row, index) => {
    if (Rows.length - 1 == index) {
      Row.querySelector("button").classList.replace("btn-Delete", "btn-plus")
      Row.querySelector("button").classList.replace("bx-trash", "bx-plus")
      Row.querySelector(".tooltip").innerText = "اضافة صنف"
    } else {
      Row.querySelector("button").classList.replace("btn-plus", "btn-Delete")
      Row.querySelector("button").classList.replace("bx-plus", "bx-trash")
      Row.querySelector(".tooltip").innerText = "حذف الصنف"
    }
  });
  SetName()
  TotalReceipt()
}
// Function TotalItem
function TotalItem(event) {
  let input = event.target;
  let parent = input.parentElement.parentElement
  let Quantity = parent.querySelector('.QtyItem').value
  let PriceItem = parent.querySelector('.PriceItem').value
  parent.querySelector('.TotalItem').value = (Quantity * PriceItem).toFixed(2)
  TotalReceipt()
}
// Function TotalReceipt and Profit 
function TotalReceipt() {
  let Rows = Table.querySelectorAll('tr')
  let Total = 0, Profit = 0
  Rows.forEach(Row => {
    Total = Total + parseFloat(Row.querySelector('.TotalItem').value)
    let SlctUnitsItem = Row.querySelector(".UnitsItem")
    let PriceUnitBuy = SlctUnitsItem.options[SlctUnitsItem.selectedIndex].getAttribute('PriceUnitBuy')
    let PriceUnitSales = SlctUnitsItem.options[SlctUnitsItem.selectedIndex].getAttribute('PriceUnitSales')
    Profit = Profit + ((PriceUnitSales - PriceUnitBuy) * Row.querySelector('.QtyItem').value)
  });
  let Discount = document.querySelector('.Discount').value
  document.querySelector('.SubTotal').innerText = Total.toFixed(2)
  document.querySelector('.TotalReceipt').innerText = (Total - Discount).toFixed(2)
  if (Title.includes("مبيعات")) { document.querySelector('.ProfitReceipt').innerText = (Profit - Discount).toFixed(2) }
  AutoSave()
}
// Function AutoSave
function AutoSave() {
  let ProductArray = []
  let Rows = Table.querySelectorAll('tr')
  Rows.forEach(Row => {
    let obj = {
      NameItem: Row.querySelector('.NameItem').value,
      NameItemID: Row.querySelector('.NameItem').id,
      UnitsItem: Row.querySelector('.UnitsItem').value,
      ConFactor: Row.querySelector('.UnitsItem')
        .options[Row.querySelector('.UnitsItem').selectedIndex].getAttribute("ConFactor") * Row.querySelector('.QtyItem').value,
      QtyItem: Row.querySelector('.QtyItem').value,
      PriceItem: Row.querySelector('.PriceItem').value,
      TotalItem: Row.querySelector('.TotalItem').value,
    }
    ProductArray.push(obj)
  });

  let Object = {
    DocNu: NuReceipt.innerText,
    DocType: document.querySelector('.DocType').value,
    DocDate: document.querySelector('.DocDate').value,
    NamePersonID: document.querySelector('.NamePerson').id,
    NamePerson: document.querySelector('.NamePerson').value,
    TypeAmount: document.querySelector('.TypeAmount').value,
    Total: parseFloat(document.querySelector('.TotalReceipt').innerText),
    Discount: document.querySelector('.Discount').value,
    Products: ProductArray,
  }

  localStorage.setItem("MyReceipt", JSON.stringify(Object))
}
// Function Focus Input
function FocusInput(event) {
  let btn = event.target
  let parent = btn.parentElement.parentElement;
  let select = parent.querySelector(".SelectMenu")
  select.classList.add("active")
  parent.classList.add("active")
  parent.querySelector(".SearchInput").focus()
}
// Function Blur Input
function BlurInput(event) {
  let btn = event.target;
  let parent = btn.parentElement.parentElement.parentElement
  let input = parent.querySelectorAll("input")[0]
  setTimeout(() => {
    let select = parent.querySelector(".SelectMenu")
    select.classList.remove("active")
    if (input.value == "الاسم" || input.value == "الصنف") { parent.classList.remove("active") }
  }, 200);
}
// Function SetName into Input
function SetName() {
  let SelectItem = document.querySelectorAll(".SelectItmes h3")
  SelectItem.forEach(item => {
    item.addEventListener("click", function () {
      let parent = item.parentElement.parentElement.parentElement
      parent.querySelectorAll("input")[0].value = item.innerText
      parent.querySelectorAll("input")[0].id = item.id
      parent.querySelectorAll("input")[1].value = ""
      parent.querySelector(".SelectMenu").classList.remove("active")
    })
  });
} SetName()
// Function Search Select
function SearchSelect(event) {
  let input = event.target;
  let parent = input.parentElement.parentElement
  let SelectItmes = parent.querySelector(".SelectItmes")
  SelectItmes.innerHTML = ""
  if (input.classList.contains("Person")) {
    Customers.forEach(Customer => {
      if (Customer.Name.includes(input.value)) {
        SelectItmes.innerHTML += `<h3 onclick="SetName(event)" id="${Customer._id}">${Customer.Name}</h3>`
      }
    });
  } else if (input.classList.contains("Product")) {
    Products.forEach((Product, index) => {
      if (Product.Name.includes(input.value)) {
        SelectItmes.innerHTML += ` <h3 class="Part1" onclick="GetUnitsAndPriceItem(event)" index="${index}" id="${Product.ID}">${Product.Name}</h3>`
      }
    });
  }
}