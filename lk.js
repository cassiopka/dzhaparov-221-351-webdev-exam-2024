const url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/";
const apiKey = "b2d53706-80cb-4970-81e7-e3c888aaf517";
let allData;


const holidays = [                                       
    "01-01",
    "02-23",
    "03-08",
    "05-09",
    "09-01",
    "06-12",
    "05-01",
];

function showAlert(error, color) {                          
    let alerts = document.querySelector(".alerts");
    let alert = document.createElement("div");
    alert.classList.add("alert", "alert-dismissible", color);
    alert.setAttribute("role", "alert");
    alert.append(error);
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("btn-close", "position-sticky", "end-50", "my-0");
    btn.setAttribute("data-bs-dismiss", "alert");
    btn.setAttribute("aria-label", "Close");
    alert.append(btn);
    alerts.append(alert);
    setTimeout(() => alert.remove(), 4000);
}

async function nameOfRoute(idRoute) {              
    let nUrl = new URL(url + "routes/" + idRoute);
    nUrl.searchParams.append("api_key", apiKey);
    let nameRoute = "";
    try {
        let response = await fetch(nUrl);
        let route = await response.json();
        nameRoute = route.name;
    } catch (error) {
        console.log(error.message);
    }
    return nameRoute;
}

async function nameOfGuide(idGuide) {                     
    let nUrl = new URL(url + "guides/" + idGuide);
    nUrl.searchParams.append("api_key", apiKey);
    let nameGuide = "";
    try {
        let response = await fetch(nUrl);
        let guide = await response.json();
        document.querySelector(".table-routes").setAttribute("data-pricePerHour", guide.pricePerHour);
        nameGuide = guide.name;
    } catch (error) {
        console.log(error.message);
    }
    return nameGuide;
}

function clickOnTrash(event) {  
    if (!event.target.classList.contains("bi-trash-fill")) return;
    let idTask = event.target.parentNode.parentNode.id;
    document.querySelector(".delete").setAttribute("data-task-id", idTask);
}

function clickOnEye(event) {
    if (!event.target.classList.contains("bi-eye-fill")) return;
    let modal = document.querySelector("#showTask");
    modal.querySelector("#exampleModalLabel").textContent = "Заявка номер " + event.target.parentNode.parentNode.id;

    let guideId = event.target.parentNode.parentNode.getAttribute("data-guide-id");
    let guideFio = modal.querySelector("#name");
    nameOfGuide(guideId).then((response) => guideFio.value = response);
    guideFio.classList.add("text-blanchedalmond");

    let routeName = modal.querySelector("#route");
    routeName.value = event.target.parentNode.parentNode.children[1].textContent;
    routeName.classList.add("text-blanchedalmond");

    let date = modal.querySelector("#date");
    date.setAttribute("readonly", "");
    let strDate = event.target.parentNode.parentNode.children[2].textContent.split(".");
    let trueDate = new Date(strDate[2] + "-" + strDate[1] + "-" + strDate[0]);
    date.value = trueDate.toJSON().slice(0, 10);

    let time = modal.querySelector("#time");
    time.setAttribute("readonly", "");
    let timeRoute = event.target.parentNode.parentNode.getAttribute("data-time");
    time.value = timeRoute;

    let duration = modal.querySelector("#selectLength");
    duration.setAttribute("disabled", "");
    let durationRoute = event.target.parentNode.parentNode.getAttribute("data-duration");
    duration.value = durationRoute;

    let personsRange = modal.querySelector("#customRange2");
    personsRange.setAttribute("readonly", "");
    personsRange.setAttribute("disabled", "");

    let personsText = modal.querySelector("#number-people");
    personsText.setAttribute("readonly", "");
    personsText.setAttribute("disabled", "");
    let persons = event.target.parentNode.parentNode.getAttribute("data-persons");
    personsRange.value = persons;
    personsText.value = persons;


    let options = modal.querySelector(".options");
    options.innerHTML = "";
    options.textContent = "Дополнительные опции: ";
    let switches = modal.querySelectorAll(".form-switch");
    for (let swit of switches) {
        swit.innerHTML = "";
    }
    let option1 = document.createElement("input");
    option1.setAttribute("type", "text");
    option1.classList.add("form-control-plaintext", "text-blanchedalmond");
    option1.setAttribute("readonly", "");
    option1.value = "Интерактивный путеводитель";
    let routeOptionF = event.target.parentNode.parentNode.getAttribute("data-option1");
    if (routeOptionF == "true") options.append(option1);

    let option2 = document.createElement("textarea");
    option2.setAttribute("type", "text");
    option2.classList.add("form-control-plaintext","text-blanchedalmond");
    option2.setAttribute("readonly", "");
    option2.value = "Сопровождение сурдопереводчика";
    let routeOptionS = event.target.parentNode.parentNode.getAttribute("data-option2");
    if (routeOptionS == "true") options.append(option2);

    let price = modal.querySelector("#price");
    let priceRoute = event.target.parentNode.parentNode.children[3].textContent;
    price.classList.add("text-blanchedalmond");
    price.value = priceRoute;
    modal.querySelector(".back-btn").classList.add("d-none");
    let createBtn = modal.querySelector(".create-btn");
    createBtn.setAttribute("data-bs-dismiss", "modal");
    createBtn.classList.remove("create-change-task");
    createBtn.textContent = "Готово";
}

function numberOfVisitors() {
    let form = document.querySelector("#create-task-form");
    let number = form.elements["customRange2"].value;
    let plus = 0;
    if (number <= 5) plus = 0;
    else if ((number > 5) && (number <= 10)) plus = 1000;
    else if ((number > 10) && (number <= 20)) plus = 1500;
    return plus;
}

function isThisDayOff() {
    let form = document.querySelector("#create-task-form");
    let isHoliday = new Date(form.elements["date"].value);
    let YearMonthDay = isHoliday.toJSON().slice(0, 10).split("-");
    let MonthDay = YearMonthDay[1] + "-" + YearMonthDay[2];
    let plus = 1;
    if ((isHoliday.getDay() == 0) || (isHoliday.getDay() == 6) || (holidays.includes(MonthDay))) {
        plus = 1.5;
    }
    return plus;
}

function isItMorningOrEvening() {
    let form = document.querySelector("#create-task-form");
    let time = parseInt(form.elements["time"].value.split(":")[0]);
    let plus = 0;
    if ((time >= 9) && (time < 12)) plus = 400;
    else if ((time >= 20) && (time <= 23)) plus = 1000;
    return plus;
}

function hoursNumber() {
    let form = document.querySelector("#create-task-form");
    let hours = form.elements["selectLength"].value;
    return hours;
}

function checkOptionFirst() {
    let option = document.querySelector("#option1");
    let price = 1;
    if (option.checked) {
        price = 1.5;
    }
    return price;
}

function checkOptionSecond() {
    let option2 = document.querySelector("#option2");
    if (option2.checked) {
        let form = document.querySelector("#create-task-form");
        let numVisitors = parseInt(form.elements["customRange2"].value);
        let price = 1;
        if (numVisitors >= 1 && numVisitors <= 10) {
            price = (numVisitors <= 5) ? price * 1.15 : price * 1.25;
        } else {
            price = (numVisitors > 10) ? 0 : price;
        }
        return price;
    }
    return 1; 
}

function guideServiceCost() {                       
    let price = document.querySelector(".table-routes").getAttribute("data-pricePerHour");
    return price;
}

function changeTotalPrice(event) {                    
    let form = document.querySelector("#create-task-form");
    let price = (guideServiceCost() * hoursNumber() * isThisDayOff() + isItMorningOrEvening() + numberOfVisitors() + checkOptionSecond()) * checkOptionFirst();
    form.elements["price"].value = parseInt(price);
}

function changeTotalPriceForPersons(event) {
    document.querySelector("#number-people").value = event.target.value;
    let form = document.querySelector("#create-task-form");
    let price = (guideServiceCost() * hoursNumber() * isThisDayOff() + isItMorningOrEvening() + numberOfVisitors() + checkOptionSecond()) * checkOptionFirst();
    form.elements["price"].value = parseInt(price);
}

function clickOnPen(event) {                            
    if (!event.target.classList.contains("bi-pencil-square")) return;
    let modal = document.querySelector("#showTask");
    modal.querySelector("#exampleModalLabel").textContent = "Редактирование заявки";
    let guideId = event.target.parentNode.parentNode.getAttribute("data-guide-id");
    let taskId = event.target.parentNode.parentNode.id;
    modal.querySelector(".create-btn").setAttribute("data-task-id", taskId);
    let guideFio = modal.querySelector("#name");
    let priceHour = document.querySelector(".table-routes");
    nameOfGuide(guideId).then((response) => guideFio.value = response);

    let routeName = modal.querySelector("#route");
    routeName.value = event.target.parentNode.parentNode.children[1].textContent;

    let date = modal.querySelector("#date");
    date.removeAttribute("readonly");
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    date.setAttribute("min", newDate.toJSON().slice(0, 10));
    let strDate = event.target.parentNode.parentNode.children[2].textContent.split(".");
    let trueDate = new Date(strDate[2] + "-" + strDate[1] + "-" + strDate[0]);
    date.value = trueDate.toJSON().slice(0, 10);

    let time = modal.querySelector("#time");
    time.removeAttribute("readonly");
    let timeRoute = event.target.parentNode.parentNode.getAttribute("data-time");
    time.value = timeRoute;

    let duration = modal.querySelector("#selectLength");
    duration.removeAttribute("disabled");
    let durationRoute = event.target.parentNode.parentNode.getAttribute("data-duration");
    duration.value = durationRoute;

    let personsRange = modal.querySelector("#customRange2");
    personsRange.removeAttribute("readonly");
    personsRange.removeAttribute("disabled");
    personsRange.oninput = changeTotalPriceForPersons;
    let personsText = modal.querySelector("#number-people");
    let persons = event.target.parentNode.parentNode.getAttribute("data-persons");
    personsRange.value = persons;
    personsText.value = persons;

    modal.querySelector(".options").innerHTML = "";

    let price = document.querySelector("#price");
    let priceRoute = event.target.parentNode.parentNode.children[3].textContent;
    price.value = priceRoute;

    modal.querySelector(".back-btn").classList.remove("d-none");
    let createBtn = modal.querySelector(".create-btn");
    createBtn.removeAttribute("data-bs-dismiss");
    createBtn.textContent = "Сохранить";
    createBtn.classList.add("create-change-task");
}

function createRoute(data, number) {
    let table = document.querySelector(".table-routes");
    let row = document.createElement("tr");
    row.setAttribute("id", data.id);
    row.setAttribute("data-guide-id", data.guide_id);
    row.setAttribute("data-time", data.time);
    row.setAttribute("data-duration", data.duration);
    row.setAttribute("data-persons", data.persons);
    row.setAttribute("data-option1", data.optionFirst);
    row.setAttribute("data-option2", data.optionSecond);

    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.textContent = number;
    row.append(th);

    let name = document.createElement("td");
    nameOfRoute(data.route_id).then((response) => name.textContent = response);
    row.append(name);

    let dateRoute = document.createElement("td");
    dateee = new Date(data.date);
    DayMonthYear = dateee.toJSON().slice(0, 10).split("-");
    dateRoute.textContent = DayMonthYear[2] + "." + DayMonthYear[1] + "." + DayMonthYear[0];
    row.append(dateRoute);

    let priceRoute = document.createElement("td");
    priceRoute.textContent = data.price;
    row.append(priceRoute);

    let actions = document.createElement("td");
    actions.classList.add("d-flex", "flex-wrap");
    let eye = document.createElement("i");
    eye.classList.add("bi", "bi-eye-fill", "mx-2");
    eye.setAttribute("data-bs-toggle", "modal");
    eye.setAttribute("data-bs-target", "#showTask");
    eye.onclick = clickOnEye;
    actions.append(eye);

    let pen = document.createElement("i");
    pen.classList.add("bi", "bi-pencil-square", "mx-2");
    pen.setAttribute("data-bs-toggle", "modal");
    pen.setAttribute("data-bs-target", "#showTask");
    pen.onclick = clickOnPen;
    actions.append(pen);

    let trash = document.createElement("i");
    trash.classList.add("bi", "bi-trash-fill", "ms-2");
    trash.setAttribute("data-bs-toggle", "modal");
    trash.setAttribute("data-bs-target", "#deleteTask");
    trash.onclick = clickOnTrash;
    actions.append(trash);
    row.append(actions);

    table.append(row);
}

function pageBtnHandler(event) {                            
    if (!event.target.classList.contains("page-link")) return;
    let oldBtn = document.querySelector(".active");
    oldBtn.classList.remove("active");
    event.target.classList.add("active");
    createElements(allData);
}

function createElements(data) {                        
    document.querySelector(".table-routes").innerHTML = "";
    let oldBtn = document.querySelector(".active");
    let pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    for (let i = 1; i < Math.ceil(data.length / 5) + 1; i++) {
        let li = document.createElement("li");
        li.classList.add("page-item");
        let a = document.createElement("a");
        a.classList.add("page-link", "sandybrown", "text-blanchedalmond");
        if (oldBtn.textContent == i) a.classList.add("active");
        a.setAttribute("href", "#");
        a.textContent = i;
        a.onclick = pageBtnHandler;
        li.append(a);
        pagination.append(li);
    }

    let currentPage = document.querySelector(".active").textContent;
    let start = currentPage * 5 - 5;
    let end = (start + 5) > data.length ? (start + data.length % 5) : start + 5;
    for (let i = start; i < end; i++) {
        createRoute(data[i], i + 1);
    }
}

async function downloadData() {               
    let nUrl = new URL(url + "orders");
    nUrl.searchParams.append("api_key", apiKey);

    try {
        let response = await fetch(nUrl);
        let data = await response.json();
        allData = JSON.parse(JSON.stringify(data));
        createElements(data);
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteTask(event) {                     
    if (!event.target.classList.contains("delete")) return;
    let idTask = event.target.getAttribute("data-task-id");
    let nUrl = new URL(url + "orders/" + idTask);
    nUrl.searchParams.append("api_key", apiKey);
    try {
        let response = await fetch(nUrl, {
            method: "DELETE",
        });
        let data = await response.json();
        document.querySelector(".page-link").classList.add("active");
        if (data.error) showAlert(data.error, "alert-danger");
        else showAlert("Заявка успешно удалена", "alert-success");
        downloadData();
    } catch (error) {
        console.log(error.message);
    }
}

async function saveNewTask(event) {         
    if (!event.target.classList.contains("create-change-task")) return;
    let formForSend = new FormData();
    let form = document.querySelector("#create-task-form");
    formForSend.append("date", form.elements["date"].value);
    formForSend.append("time", form.elements["time"].value);
    formForSend.append("duration", form.elements["selectLength"].value);
    formForSend.append("persons", form.elements["customRange2"].value);
    formForSend.append("price", form.elements["price"].value, "₽");
    formForSend.append("optionFirst", (form.elements["option1"].checked) ? 1 : 0);
    formForSend.append("optionSecond", (form.elements["option2"].checked) ? 1 : 0);
    let taskId = event.target.getAttribute("data-task-id");
    let nUrl = new URL(url + "orders/" + taskId);
    nUrl.searchParams.append("api_key", apiKey);

    if (form.elements["time"].validity.valid) {           
        try {
            event.target.setAttribute("type", "button");
            let modal = document.querySelector("#showTask");
            var modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            let response = await fetch(nUrl, {
                method: "PUT",
                body: formForSend,
            });
            let data = await response.json();
            if (data.error) showAlert(data.error, "alert-danger");
            else showAlert("Заявка успешно изменена", "alert-success");
            downloadData();
            console.log(data);
        } catch (error) {
            showAlert(error.message, "alert-danger");
        }
    } else {
        event.target.setAttribute("type", "submit");
    }
}

window.onload = function () {
    downloadData();
    document.querySelector(".delete").onclick = deleteTask;
    document.querySelector("#selectLength").oninput = changeTotalPrice;
    document.querySelector("#time").oninput = changeTotalPrice;
    document.querySelector("#date").oninput = changeTotalPrice;
    document.querySelector("#option1").oninput = changeTotalPrice;
    document.querySelector("#option2").oninput = changeTotalPrice;
    document.querySelector(".create-btn").onclick = saveNewTask;
};
