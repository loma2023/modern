function FetchData() {
    fetch("/MainData.JSON")
        .then((res) => res.json())
        .then((Data) => { DoThis(Data[0], Data[1]) })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

function DoThis(MainData, Decode) {
    let UserWelcome = document.querySelector(".Congratulations .card-title").innerText.replace("👋♥", " ");
    if (MainData.VoiceMessage === true) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(UserWelcome))
    }
    DeleteNotification(MainData)
    DollarPrice(Decode)
    BarCercel()
    GetTopProducts(MainData)
    GetProductsOut(MainData)
    charts(MainData)
}

function BarCercel() {
    let cecrel = document.querySelector(".cecrel");
    let value = document.querySelector(".value");
    let start = 0;
    if (value.id == 0) { return }
    let progress = setInterval(() => {
        start++
        value.textContent = `${start}%`
        cecrel.style.background = `conic-gradient(var(--Primary) ${start * 3.6}deg, var(--bg-bar) 0deg)`
        if (start == value.id) {
            clearInterval(progress)
        }
    }, 120);
}

function DeleteNotification(MainData) {
    MainData.NotificationsData.forEach(Notification => {
        let id = Notification._id
        interval = Math.floor((new Date() - new Date(Notification.CreatedAt)) / 86400000);
        if (interval > 14) {
            fetch("/DeleteNotification" + id, { method: "DELETE" })
                .then((res) => res.json())
                .then((Data) => { console.log(Data) })
                .catch((err) => { return location.href = "/Error" })
        }
    })
}

function GetTopProducts(MainData) {
    let Counts = [];
    MainData.ProductsData.forEach(Product => {
        if (Product.Status === "TRUE") {
            let Price = 0, Length = 0
            MainData.GeneralData.forEach(Receipt => {
                if (Receipt.DocType != "مبيعات") return
                Receipt.Products.forEach(Item => { if (Item.NameItem === Product._id) { Price += parseFloat(Item.TotalItem); Length++; } });
            });
            Counts.push({ Name: Product.Name, Price, Length })
        }
    });
    Counts.sort((A, Z) => Z.Length - A.Length)
    Counts.forEach((Count, index) => {
        if (index > 9 || Count.Length == 0) return
        document.querySelector(".TopProducts .card-body").innerHTML += `
        <div class="card-item gray">
            <i class='item-icon bx bx-cart'></i>
            <div class="center">
                <h3>${Count.Name}</h3>
                <p>${Count.Length} فاتورة</p>
            </div>
            <div class="left">
                <h3>${Count.Price}</h3>
                <p>الاجمالي</p>
            </div>
        </div>`
    });
}

function GetProductsOut(MainData) {
    MainData.ProductsData.forEach((Product, index) => {
        if (Product.Status === "TRUE") {
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
                document.querySelector(".ProductsOut .card-body").innerHTML += `
            <div class="card-item gray">
                <i class='item-icon bx bx-store-alt'></i>
                <div class="center">
                    <h3>${Product.Name}</h3>
                    <p>الحد الادني ${Product.MinQty + " " + UnitsArr[0].NameUnit}</p>
                </div>
                <div class="left">
                    <h3>${BalanceInner}</h3>
                    <p>الكمية الحالية</p>
                </div>
            </div>`
            }
        }
    });
}

// ******************************************************************************

function charts(MainData) {
    //==================== Get Data =======================
    let ThisMonth = new Date().toJSON().slice(0, 7)
    let Salse = 0, Purchases = 0, Expenses = 0, Revenues = 0;
    let BackSalse = 0, BackPurchases = 0;

    MainData.GeneralData.forEach(Receipt => {
        if (Receipt.DocDate.slice(0, 7) === ThisMonth) {
            if (Receipt.DocType === "مبيعات") { Salse += Receipt.Total }
            if (Receipt.DocType === "مرتجع مبيعات") { BackSalse += Receipt.Total }
            if (Receipt.DocType === "مشتريات") { Purchases += Receipt.Total }
            if (Receipt.DocType === "مرتجع مشتريات") { BackPurchases += Receipt.Total }
            if (Receipt.Credit === "الايرادات") { Revenues += Receipt.Total }
            if (Receipt.Debit === "المصاريف") { Expenses += Receipt.Total }
        }
    })

    let color = ["#246dec", "#cc3c43", "#367952", "#f5b74f", "#4f35a1", "#035e7b"];
    //====================الشكل الاول =======================
    const chart1 = {
        series: [{ name: " ", data: [Expenses, Revenues, BackPurchases, Purchases, BackSalse, Salse] },],
        chart: { type: 'radar', height: 350, toolbar: { show: false }, },
        colors: color,
        dataLabels: { enabled: false, },
        stroke: { curve: 'smooth' },
        labels: ["المصروفات", "الايرادات", "مرتجع مشتريات", "المشتريات", "مرتجع مبيعات", "المبيعات"],
    };
    const barchart1 = new ApexCharts(document.querySelector("#chart1"), chart1); barchart1.render();

    //====================الشكل الثاني =======================
    const chart2 = {
        series: [{ name: " ", data: [Expenses, Revenues, BackPurchases, Purchases, BackSalse, Salse] }],
        chart: { type: 'bar', height: 350, toolbar: { show: false }, },
        colors: color,
        plotOptions: { bar: { distributed: true, borderRadius: 4, horizontal: false, columnWidth: '25%', } },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: { categories: ["المصروفات", "الايرادات", "مرتجع مشتريات", "المشتريات", "مرتجع مبيعات", "المبيعات"], },
        yaxis: { title: { text: "" } }
    };
    const barChart2 = new ApexCharts(document.querySelector("#chart2"), chart2); barChart2.render();

    //====================الشكل الثالث =======================
}

function DollarPrice(Decode) {
    fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${Decode.DollarKey}`)
        .then((req) => req.json())
        .then((Data) => {
            document.querySelector(".PriceOfDollar").innerText = (document.querySelector(".PriceOfDollar").id / parseFloat(Data.rates["EGP"])).toFixed(2) + "$"
            document.querySelector(".ToDayDollar").innerText = "سعر الدولار اليوم " + parseFloat(Data.rates["EGP"]).toFixed(2)
        })
}
