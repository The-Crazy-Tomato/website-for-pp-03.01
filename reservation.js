// Глобальные переменные 
        var currentDate = new Date();
        var selectedDate = null;
        var selectedTime = null;
        var selectedPC = null;
        
        // Функция для создания календаря 
        function makeCalendar() {
            var monthElement = document.getElementById('currentMonth');
            var grid = document.getElementById('calendarGrid');
            
            // Очищаем дни 
            while (grid.children.length > 7) {
                grid.removeChild(grid.lastChild);
            }
            
            // Месяцы по-русски
            var monthNames = [
                'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ];
            
            monthElement.textContent = monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
            
            // Первый день месяца
            var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            // Последний день месяца
            var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            // День недели первого дня
            var firstDayOfWeek = firstDay.getDay();
            if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Воскресенье = 7
            
            // Пустые дни в начале
            for (var i = 1; i < firstDayOfWeek; i++) {
                var emptyDay = document.createElement('div');
                emptyDay.className = 'day other-month';
                emptyDay.textContent = '';
                grid.appendChild(emptyDay);
            }
            
            // Дни месяца
            for (var day = 1; day <= lastDay.getDate(); day++) {
                var dayElement = document.createElement('div');
                dayElement.className = 'day';
                dayElement.textContent = day;
                
                // Если сегодня, выделяем
                var today = new Date();
                if (currentDate.getFullYear() === today.getFullYear() &&
                    currentDate.getMonth() === today.getMonth() &&
                    day === today.getDate()) {
                    dayElement.classList.add('selected');
                }
                
                // Обработчик клика
                dayElement.onclick = function() {
                    // Снимаем выделение
                    var allDays = document.querySelectorAll('.day');
                    for (var j = 0; j < allDays.length; j++) {
                        allDays[j].classList.remove('selected');
                    }
                    
                    // Выделяем этот день
                    this.classList.add('selected');
                    
                    // Запоминаем дату
                    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(this.textContent));
                    
                    // Переходим к времени
                    goToTime();
                };
                
                grid.appendChild(dayElement);
            }
        }
        
        // Перейти к выбору времени
        function goToTime() {
            // Прячем календарь
            document.getElementById('calendarSection').style.display = 'none';
            document.getElementById('timeSection').style.display = 'block';
            document.getElementById('pcSection').style.display = 'none';
            document.getElementById('confirmationSection').style.display = 'none';
            
            // Обновляем шаги
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.add('active');
            document.getElementById('step3').classList.remove('active');
            
            // Создаем временные слоты
            var timeSlots = document.getElementById('timeSlots');
            timeSlots.innerHTML = '';
            
            // Время с 10 до 22
            for (var hour = 10; hour <= 22; hour++) {
                var timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                timeSlot.textContent = hour + ':00';
                
                timeSlot.onclick = function() {
                    // Снимаем выделение
                    var allSlots = document.querySelectorAll('.time-slot');
                    for (var i = 0; i < allSlots.length; i++) {
                        allSlots[i].classList.remove('selected');
                    }
                    
                    // Выделяем этот слот
                    this.classList.add('selected');
                    
                    // Запоминаем время
                    selectedTime = this.textContent;
                    
                    // Переходим к выбору ПК
                    goToPC();
                };
                
                timeSlots.appendChild(timeSlot);
            }
        }
        
        // Перейти к выбору ПК
        function goToPC() {
            // Прячем все остальное
            document.getElementById('calendarSection').style.display = 'none';
            document.getElementById('timeSection').style.display = 'none';
            document.getElementById('pcSection').style.display = 'block';
            document.getElementById('confirmationSection').style.display = 'none';
            
            // Обновляем шаги
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.add('active');
            
            // Создаем номера ПК
            var pcGrid = document.getElementById('pcGrid');
            pcGrid.innerHTML = '';
            
            // 18 компьютеров
            for (var i = 1; i <= 18; i++) {
                var pcElement = document.createElement('div');
                pcElement.className = 'pc-number';
                pcElement.textContent = i;
                
                // Некоторые заняты
                if (i === 3 || i === 7 || i === 12 || i === 16) {
                    pcElement.classList.add('occupied');
                    pcElement.innerHTML = i + '<br><small>занят</small>';
                } else {
                    pcElement.onclick = function() {
                        // Снимаем выделение
                        var allPCs = document.querySelectorAll('.pc-number');
                        for (var j = 0; j < allPCs.length; j++) {
                            allPCs[j].classList.remove('selected');
                        }
                        
                        // Выделяем этот ПК
                        this.classList.add('selected');
                        
                        // Запоминаем номер
                        selectedPC = parseInt(this.textContent);
                        
                        // Показываем подтверждение
                        showConfirm();
                    };
                }
                
                pcGrid.appendChild(pcElement);
            }
        }
        
        // Показать подтверждение
        function showConfirm() {
            // Прячем все остальное
            document.getElementById('calendarSection').style.display = 'none';
            document.getElementById('timeSection').style.display = 'none';
            document.getElementById('pcSection').style.display = 'none';
            document.getElementById('confirmationSection').style.display = 'block';
            
            // Обновляем данные
            if (selectedDate) {
                var days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
                document.getElementById('summaryDate').textContent = 
                    days[selectedDate.getDay()] + ' ' + selectedDate.getDate();
            }
            
            if (selectedTime) {
                document.getElementById('summaryTime').textContent = selectedTime;
            }
            
            if (selectedPC) {
                document.getElementById('summaryPC').textContent = selectedPC;
            }
            
            // Кнопка подтверждения
            var confirmBtn = document.getElementById('confirmBooking');
            confirmBtn.disabled = false;
            confirmBtn.onclick = function() {
                finishBooking();
            };
        }
        
        // Завершить бронирование
        function finishBooking() {
            if (selectedDate && selectedTime && selectedPC) {
                alert('Бронирование завершено!\n\nДата: ' + selectedDate.toLocaleDateString() + 
                      '\nВремя: ' + selectedTime + 
                      '\nПК: ' + selectedPC + 
                      '\n\nСпасибо!');
                
                // Сброс
                resetAll();
            }
        }
        
        // Сбросить все
        function resetAll() {
            selectedDate = null;
            selectedTime = null;
            selectedPC = null;
            
            // Показать календарь
            document.getElementById('calendarSection').style.display = 'block';
            document.getElementById('timeSection').style.display = 'none';
            document.getElementById('pcSection').style.display = 'none';
            document.getElementById('confirmationSection').style.display = 'none';
            
            // Сбросить шаги
            document.getElementById('step1').classList.add('active');
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.remove('active');
            
            // Отключить кнопку
            document.getElementById('confirmBooking').disabled = true;
            
            // Пересоздать календарь
            makeCalendar();
        }
        
        // Найти клубы поблизости
        function findNearbyClubs() {
            alert('Поиск клубов... (функция в разработке)');
        }
        
        // Когда страница загрузится
        window.onload = function() {
            // Создать календарь
            makeCalendar();
            
            // Кнопки переключения месяца
            document.getElementById('prevMonth').onclick = function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                makeCalendar();
            };
            
            document.getElementById('nextMonth').onclick = function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                makeCalendar();
            };
            
            // Отключить кнопку подтверждения
            document.getElementById('confirmBooking').disabled = true;
            
            // Логирование для отладки 
            console.log('Страница бронирования загружена');
            console.log('Текущая дата: ' + currentDate);
            console.log('Кнопок на странице: ' + document.getElementsByTagName('button').length);
            
            // проверка
            var today = new Date();
            if (today.getDay() === 0 || today.getDay() === 6) {
                console.log('Сегодня выходной!');
            } else {
                console.log('Сегодня будний день');
            }
            
            // анимация 
            setTimeout(function() {
                var cards = document.querySelectorAll('.club-card');
                for (var i = 0; i < cards.length; i++) {
                    cards[i].style.opacity = '0';
                    cards[i].style.transition = 'opacity 0.5s';
                    setTimeout(function(card, index) {
                        return function() {
                            card.style.opacity = '1';
                        };
                    }(cards[i], i), i * 200);
                }
            }, 500);
            
            // Сохранить в cookie 
            document.cookie = "last_visit=" + new Date().toISOString() + "; path=/";
            
            // Проверка на мобильное устройство 
            if (window.innerWidth < 768) {
                console.log('Мобильное устройство обнаружено');

            }
        };
        
        
        function formatDate(date) {
            // Форматирует дату (но не используется)
            return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
        }
