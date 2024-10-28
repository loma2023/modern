let ToDay = new Date().toJSON().slice(0, 10)
let Title = document.title, TableArray = [];

let AllButtons = document.querySelectorAll("button")

AllButtons.forEach(Button => {
    Button.addEventListener("click", () => {
        Button.disabled = true
        setTimeout(() => {
            Button.disabled = false
        }, 2000);
    })
});

function ActiveBody() {
    const LayoutBody = document.querySelector(".Layout-body");
    const MenuToggle = document.querySelector(".menu-toggle");

    LayoutBody.classList.toggle("active")
    if (LayoutBody.classList.contains("active")) {
        MenuToggle.classList.replace("bx-menu", "bx-menu-alt-right")
    } else {
        MenuToggle.classList.replace("bx-menu-alt-right", "bx-menu")
    }
}

function DarkMood() {
    const LayoutBody = document.querySelector(".Layout-body");
    const MoonToggle = document.querySelector(".moon-toggle");

    LayoutBody.classList.toggle("Dark")
    if (LayoutBody.classList.contains("Dark")) {
        MoonToggle.classList.replace("bxs-moon", "bxs-sun")
    } else {
        MoonToggle.classList.replace("bxs-sun", "bxs-moon")
    }
}

// عناصر القائمة
$(".wrapper-items > .menu-item").click(function (e) {
    $(this).siblings().removeClass("open");
    $(this).toggleClass("open");
    $(this).find(".sub-menu").slideToggle();
    $(this).siblings().find(".sub-menu").slideUp();
    $(this).siblings().find(".sub-menu").find(".menu-item").removeClass("open")
})

// عنصر الصورة
$(".tools > .UserTools").click(function (e) {
    $(this).find(".UserPage").slideToggle();
    $(this).siblings().find(".Notificat-body").slideUp();
})

// عنصر الاشعارات
$(".tools > .Notifications .bell-icon").click(function (e) {
    $(".Notifications").find(".Notificat-body").slideToggle();
    $(".Notifications").siblings().find(".UserPage").slideUp();
})

function GetFullScreenElement() {
    return document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullscreenElement
        || document.msFullscreenElement;
}

function ToggleFullScreen() {
    if (GetFullScreenElement()) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen().catch(console.log)
    }
}

document.addEventListener("fullscreenchange", () => {
    let btn = document.querySelector(".screen-toggle")
    if (GetFullScreenElement()) {
        btn.classList.replace("bx-fullscreen", "bx-exit-fullscreen")
    } else {
        btn.classList.replace("bx-exit-fullscreen", "bx-fullscreen")
    }
})

function FormADD() {
    let form = document.querySelector(".Form-ADD")
    form.classList.toggle("active")
    form.querySelectorAll("input")[0].focus()
}

function Hide_Container() {
    let Alert = document.querySelector(".Alert-container")
    if (Alert) { Alert.classList.remove("active") }

    let PopUps = document.querySelectorAll(".Form-Container")
    PopUps.forEach(Pop => {
        Pop.classList.remove("active")
        let inputs = Pop.querySelectorAll("input")
        let selects = Pop.querySelectorAll("select")
        inputs.forEach(input => { input.value = ""; input.checked = false });
        selects.forEach(select => { select.options[0].selected = true });

        if (Pop.classList.contains("Form-Product")) {
            Pop.querySelectorAll(".LableInclude").forEach(item => {
                item.innerText = "تحتوي علي كم "
            });
            Pop.querySelectorAll(".LablePrice").forEach(item => {
                item.innerText = "سعر الوحدة"
            });
        }
        if (Pop.classList.contains("Form-User")) {
            Pop.querySelector(".Table-Container").style.display = "flex"
        }
    });
}

let Overlows = document.querySelectorAll(".overlow")
Overlows.forEach(Overlow => {
    Overlow.addEventListener("click", (event) => {
        let Event = event.target;
        let Parent = Event.parentElement
        let Form, Toast
        if (Parent.classList.contains("Form-Container")) {
            Form = Parent.querySelector(".Form")
            Toast = Parent.querySelector(".X-Toast")
        }
        else {
            Form = Parent.querySelector(".Alert")
            Toast = Parent.querySelector(".Alert")
        }
        Form.style = "animation: shake 300ms;border-color:var(--Rose);"
        Toast.style = "animation: shake 300ms;border-color:var(--Rose);"
        setTimeout(() => { Form.style = ""; Toast.style = "" }, 1000);
    })
});

// Function to Show Alert When user Want to Delete
function Show_Alert(id) {
    document.querySelector(".Alert-container").classList.add("active")
    document.querySelector(".Alert-container .btn-Delete").id = id
    document.querySelector(".Alert-container .btn-Delete").focus()
}

// اكواد خاصة بكونتينر البحث
function Show_Search_container(event) {
    let btn = event.target
    // btn.classList.toggle("bx-search")
    // btn.classList.toggle("bx-x")
    let container = document.querySelector(".Search-Container")
    let TableContainer = document.querySelector(".Table-Container")
    container.classList.toggle("active")
    TableContainer.classList.toggle("active")
    let inputs = container.querySelectorAll("input")
    inputs.forEach(input => { input.value = "" });
    Search()
}

function ShowFilter() {
    let Filter = document.querySelector(".filter-item")
    Filter.classList.toggle("active")
}

let FilterItems = document.querySelectorAll(".filter-item h5")
FilterItems.forEach(btn => {
    btn.addEventListener("click", function () {
        FilterItems.forEach(h5 => { h5.classList.remove("active") })
        btn.classList.add("active")
        let parent = btn.parentElement.parentElement.parentElement
        parent.querySelector("input").id = btn.id
        parent.querySelector("label").innerText = btn.innerText
        ShowFilter()
        Search()
    })
});
// Function to Select Sort Data 
function SortMyData(event) {
    let Btn = event.target;
    if (Btn.classList.contains("bx-filter-alt")) {
        SortData_AZ(Btn.id)
        Btn.classList.replace("bx-filter-alt", "bxs-filter-alt")
    }
    else {
        SortData_ZA(Btn.id)
        Btn.classList.replace("bxs-filter-alt", "bx-filter-alt")
    }
}
// Function to Sort Data A to Z
function SortData_AZ(id) {
    if (id === "Name") { TableArray.sort((A, Z) => A.Name.localeCompare(Z.Name)) }
    if (id === "City") { TableArray.sort((A, Z) => A.City.localeCompare(Z.City)) }
    if (id === "Type") { TableArray.sort((A, Z) => A.Type.localeCompare(Z.Type)) }
    if (id === "DocDate") { TableArray.sort((A, Z) => new Date(A.DocDate) - new Date(Z.DocDate)) }
    if (id === "UpdatedAt") { TableArray.sort((A, Z) => new Date(A.UpdatedAt) - new Date(Z.UpdatedAt)) }
    Search()
}
// Function to Sort Data Z to A
function SortData_ZA(id) {
    if (id === "Name") { TableArray.sort((A, Z) => Z.Name.localeCompare(A.Name)) }
    if (id === "City") { TableArray.sort((A, Z) => Z.City.localeCompare(A.City)) }
    if (id === "Type") { TableArray.sort((A, Z) => Z.Type.localeCompare(A.Type)) }
    if (id === "DocDate") { TableArray.sort((A, Z) => new Date(Z.DocDate) - new Date(A.DocDate)) }
    if (id === "UpdatedAt") { TableArray.sort((A, Z) => new Date(Z.UpdatedAt) - new Date(A.UpdatedAt)) }
    Search()
}
// Function to Export Table to Excel
function ExcelFile() {
    let Table = document.querySelector(".Table")
    TableToExcel.convert(Table, {
        name: `${Title}.xlsx`,                  // اسم الملف
        sheet: { name: `${Title}` }             // اسم الورقة
    });
}

if (Title.includes("تقرير")) { document.querySelector(".wrapper-items").scrollTop = 1000 }