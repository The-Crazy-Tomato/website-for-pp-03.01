// Глобальные переменные 
var userName = "Lily";
var userPhone = "+7 (999) 999-99-99";
var balanceHours = 1;
var balanceMinutes = 32;
var hasBooking = false;

// Когда страница загрузится
window.onload = function() {
    console.log("Личный кабинет загружен");
    
    // Загружаем данные из localStorage 
    try {
        var savedName = localStorage.getItem("cyberx_username");
        if (savedName) {
            userName = savedName;
        }
        
        var savedPhone = localStorage.getItem("cyberx_phone");
        if (savedPhone) {
            userPhone = savedPhone;
        }
        
        var savedHours = localStorage.getItem("cyberx_hours");
        if (savedHours) {
            balanceHours = parseInt(savedHours);
        }
        
        var savedMinutes = localStorage.getItem("cyberx_minutes");
        if (savedMinutes) {
            balanceMinutes = parseInt(savedMinutes);
        }
    } catch (e) {
        console.log("Ошибка загрузки данных: " + e);
    }
    
    // Обновляем отображение
    updateDisplay();
    
    // Загружаем историю
    loadHistory();
    
    // Проверяем бронирование
    checkBooking();
    

};

// Обновить отображение
function updateDisplay() {
    // Обновляем имя и телефон
    document.getElementById("userName").innerHTML = userName;
    document.getElementById("userPhone").innerHTML = userPhone;
    document.getElementById("userAvatar").innerHTML = userName.charAt(0);
    
    // Обновляем баланс
    var balanceText = balanceHours + " час ";
    if (balanceMinutes > 0) {
        balanceText += balanceMinutes + " мин.";
    }
    document.getElementById("balanceValue").innerHTML = balanceText;
    
    // Сохраняем в localStorage 
    localStorage.setItem("cyberx_username", userName);
    localStorage.setItem("cyberx_phone", userPhone);
    localStorage.setItem("cyberx_hours", balanceHours.toString());
    localStorage.setItem("cyberx_minutes", balanceMinutes.toString());
}

// Редактировать профиль
function editProfile() {
    var newName = prompt("Введите новое имя:", userName);
    if (newName && newName.trim() != "") {
        userName = newName.trim();
    }
    
    var newPhone = prompt("Введите новый телефон:", userPhone);
    if (newPhone) {
        userPhone = newPhone;
    }
    
    updateDisplay();
    alert("Профиль обновлен!");
    
    // Добавляем в историю 
    addHistory("Изменение профиля", "Изменены данные профиля", "сегодня");
}

// Добавить часы
function addHours(hours) {
    if (confirm("Добавить " + hours + " час(ов)?")) {
        balanceHours = balanceHours + hours;
        updateDisplay();
        alert("Добавлено " + hours + " час(ов)!");
        
        // Добавляем в историю
        addHistory("Пополнение", "Пополнение на " + hours + " час(ов)", "только что");
    }
}

// Добавить кастомное количество часов
function addCustomHours() {
    var input = document.getElementById("customHours");
    var hours = parseInt(input.value);
    
    if (hours && hours > 0) {
        addHours(hours);
        input.value = "";
    } else {
        alert("Введите число!");
    }
}

// Проверить бронирование
function checkBooking() {
    // Проверяем в localStorage 
    var booking = localStorage.getItem("cyberx_booking");
    if (booking) {
        try {
            var bookingData = JSON.parse(booking);
            hasBooking = true;
            
            // Обновляем статус
            document.getElementById("bookingStatus").innerHTML = "активно";
            document.getElementById("bookingStatus").style.color = "#4cd964";
            
            // Показываем детали
            document.getElementById("activeBooking").style.display = "block";
            document.getElementById("bookingDate").innerHTML = bookingData.date || "ПТ 5";
            document.getElementById("bookingTime").innerHTML = bookingData.time || "19:00";
            document.getElementById("bookingPC").innerHTML = bookingData.pc || "12";
        } catch (e) {
            console.log("Ошибка бронирования: " + e);
        }
    }
}

// Создать новое бронирование
function makeNewBooking() {
    if (confirm("Перейти к бронированию?")) {
        window.location.href = "reservation.html";
    }
}

// Продлить бронирование
function extendBooking() {
    if (hasBooking) {
        if (confirm("Продлить на 1 час?")) {
            if (balanceHours > 0) {
                balanceHours = balanceHours - 1;
                updateDisplay();
                alert("Бронирование продлено!");
                addHistory("Продление", "Продление бронирования", "только что");
            } else {
                alert("Недостаточно часов!");
            }
        }
    }
}

// Отменить бронирование
function cancelBooking() {
    if (hasBooking) {
        if (confirm("Отменить бронирование?")) {
            hasBooking = false;
            localStorage.removeItem("cyberx_booking");
            
            document.getElementById("bookingStatus").innerHTML = "отсутствует";
            document.getElementById("bookingStatus").style.color = "#ff6b6b";
            document.getElementById("activeBooking").style.display = "none";
            
            alert("Бронирование отменено!");
            addHistory("Отмена", "Отмена бронирования", "только что");
        }
    }
}

// Загрузить историю
function loadHistory() {
    var historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    
    // Получаем историю из localStorage 
    var savedHistory = localStorage.getItem("cyberx_history");
    var history = [];
    
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (e) {
            console.log("Ошибка истории: " + e);
        }
    }
    
    // Если история пуста, создаем тестовую
    if (history.length === 0) {
        history = [
            {type: "Пополнение", desc: "Пополнение на 5 часов", date: "05.12.2024"},
            {type: "Игра", desc: "Игра в Dota 2 - 2 часа", date: "04.12.2024"},
            {type: "Бонус", desc: "Бонус 30 минут", date: "03.12.2024"},
            {type: "Бронирование", desc: "Бронирование ПК №12", date: "02.12.2024"}
        ];
        localStorage.setItem("cyberx_history", JSON.stringify(history));
    }
    
    // Отображаем историю
    for (var i = 0; i < history.length; i++) {
        var item = history[i];
        var div = document.createElement("div");
        div.className = "history-item";
        div.dataset.type = item.type;
        
        div.innerHTML = `
            <div class="history-header">
                <div class="history-type">${item.type}</div>
                <div class="history-date">${item.date}</div>
            </div>
            <div class="history-details">${item.desc}</div>
        `;
        
        historyList.appendChild(div);
    }
}

// Добавить в историю
function addHistory(type, desc, date) {
    var historyList = document.getElementById("historyList");
    
    // Создаем новый элемент
    var div = document.createElement("div");
    div.className = "history-item";
    div.dataset.type = type;
    
    div.innerHTML = `
        <div class="history-header">
            <div class="history-type">${type}</div>
            <div class="history-date">${date}</div>
        </div>
        <div class="history-details">${desc}</div>
    `;
    
    // Добавляем в начало
    historyList.insertBefore(div, historyList.firstChild);
    
    // Обновляем localStorage
    updateHistoryStorage(type, desc, date);
}

// Обновить хранилище истории
function updateHistoryStorage(type, desc, date) {
    var savedHistory = localStorage.getItem("cyberx_history");
    var history = [];
    
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (e) {
            console.log("Ошибка: " + e);
        }
    }
    
    // Добавляем новую запись
    history.push({type: type, desc: desc, date: date});
    
    // Ограничиваем количество записей
    if (history.length > 10) {
        history = history.slice(-10);
    }
    
    // Сохраняем
    localStorage.setItem("cyberx_history", JSON.stringify(history));
}

// Показать всю историю
function showAllHistory() {
    var items = document.querySelectorAll(".history-item");
    for (var i = 0; i < items.length; i++) {
        items[i].style.display = "block";
    }
    
    // Обновляем кнопки фильтров
    updateFilterButtons("all");
}

// Показать историю пополнений
function showTopupHistory() {
    var items = document.querySelectorAll(".history-item");
    for (var i = 0; i < items.length; i++) {
        if (items[i].dataset.type === "Пополнение") {
            items[i].style.display = "block";
        } else {
            items[i].style.display = "none";
        }
    }
    
    updateFilterButtons("topup");
}

// Показать историю бронирований
function showBookingHistory() {
    var items = document.querySelectorAll(".history-item");
    for (var i = 0; i < items.length; i++) {
        if (items[i].dataset.type === "Бронирование") {
            items[i].style.display = "block";
        } else {
            items[i].style.display = "none";
        }
    }
    
    updateFilterButtons("booking");
}

// Обновить кнопки фильтров
function updateFilterButtons(active) {
    var buttons = document.querySelectorAll(".history-filter");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    
    // Активируем нужную кнопку
    if (active === "all") {
        buttons[0].classList.add("active");
    } else if (active === "topup") {
        buttons[1].classList.add("active");
    } else if (active === "booking") {
        buttons[2].classList.add("active");
    }
}

function calculateSomething() {
    var x = 10;
    var y = 20;
    var z = x + y;
    console.log("Результат: " + z);
    return z;
}


//функция для отладки
function debugInfo() {
    console.log("Имя: " + userName);
    console.log("Часы: " + balanceHours);
    console.log("Бронирование: " + hasBooking);
}
