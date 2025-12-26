// Массив для корзины 
        var cart = [];
        var total = 0;
        
        // Когда страница загрузится
        window.onload = function() {
            console.log('Страница витрины загружена');
            
            // Назначаем обработчики кнопок "В корзину"
            var addButtons = document.querySelectorAll('.btn-add');
            for (var i = 0; i < addButtons.length; i++) {
                addButtons[i].onclick = function() {
                    addToCart(this);
                };
            }
            
            // Кнопка очистки корзины
            document.getElementById('clearCart').onclick = function() {
                clearCart();
            };
            
            // Кнопка оформления заказа
            document.getElementById('checkoutBtn').onclick = function() {
                checkout();
            };
            
            // Фильтрация по категориям
            var categoryButtons = document.querySelectorAll('.category-btn');
            for (var j = 0; j < categoryButtons.length; j++) {
                categoryButtons[j].onclick = function() {
                    // Убираем активный класс у всех
                    for (var k = 0; k < categoryButtons.length; k++) {
                        categoryButtons[k].classList.remove('active');
                    }
                    // Добавляем текущей
                    this.classList.add('active');
                    
                    // Фильтруем товары
                    filterItems(this.getAttribute('data-category'));
                };
            }
            
            // Проверяем, есть ли товары в корзине из прошлого сеанса
            if (localStorage.getItem('cyberx_cart')) {
                // Восстанавливаем корзину
                try {
                    var savedCart = localStorage.getItem('cyberx_cart');
                    cart = JSON.parse(savedCart);
                    updateCartDisplay();
                } catch (e) {
                    console.log('Ошибка загрузки корзины: ' + e);
                }
            }
        };
        
        // Добавить товар в корзину
        function addToCart(button) {
            var itemName = button.getAttribute('data-name');
            var itemPrice = parseInt(button.getAttribute('data-price'));
            
            // Добавляем товар в массив
            cart.push({
                name: itemName,
                price: itemPrice
            });
            
            // Обновляем общую сумму
            total = total + itemPrice;
            
            // Обновляем отображение
            updateCartDisplay();
            
            // Меняем текст кнопки на секунду
            var oldText = button.innerHTML;
            button.innerHTML = '✓ Добавлено';
            button.disabled = true;
            
            setTimeout(function() {
                button.innerHTML = oldText;
                button.disabled = false;
            }, 1000);
            
            // Сохраняем в localStorage
            localStorage.setItem('cyberx_cart', JSON.stringify(cart));
            
            // Показываем сообщение
            alert('Товар "' + itemName + '" добавлен в корзину!');
        }
        
        // Обновить отображение корзины
        function updateCartDisplay() {
            var cartItemsDiv = document.getElementById('cartItems');
            var cartTotalDiv = document.getElementById('cartTotal');
            var checkoutBtn = document.getElementById('checkoutBtn');
            
            // Обновляем общую сумму
            cartTotalDiv.innerHTML = total + ' P';
            
            // Обновляем список товаров
            if (cart.length > 0) {
                var itemsHTML = '';
                for (var i = 0; i < cart.length; i++) {
                    itemsHTML += '<div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">';
                    itemsHTML += '<div>' + cart[i].name + '</div>';
                    itemsHTML += '<div style="color: #f1c40f;">' + cart[i].price + ' P</div>';
                    itemsHTML += '<button onclick="removeItem(' + i + ')" style="background: red; color: white; border: none; padding: 2px 8px; border-radius: 3px; margin-top: 5px;">Удалить</button>';
                    itemsHTML += '</div>';
                }
                cartItemsDiv.innerHTML = itemsHTML;
                checkoutBtn.disabled = false;
            } else {
                cartItemsDiv.innerHTML = '<div class="cart-empty"><div>🛍️</div><p>Корзина пуста. Добавьте товары из витрины!</p></div>';
                checkoutBtn.disabled = true;
            }
            

            console.log('В корзине ' + cart.length + ' товаров на сумму ' + total + ' руб.');
        }
        
        // Удалить товар из корзины
        function removeItem(index) {
            // Уменьшаем общую сумму
            total = total - cart[index].price;
            
            // Удаляем товар из массива
            cart.splice(index, 1);
            
            // Обновляем отображение
            updateCartDisplay();
            
            // Сохраняем изменения
            localStorage.setItem('cyberx_cart', JSON.stringify(cart));
        }
        
        // Очистить корзину
        function clearCart() {
            if (cart.length > 0) {
                if (confirm('Очистить корзину?')) {
                    cart = [];
                    total = 0;
                    updateCartDisplay();
                    localStorage.removeItem('cyberx_cart');
                    alert('Корзина очищена!');
                }
            } else {
                alert('Корзина уже пуста!');
            }
        }
        
        // Оформить заказ
        function checkout() {
            if (cart.length > 0) {
                // Формируем список товаров
                var orderList = '';
                for (var i = 0; i < cart.length; i++) {
                    orderList += (i+1) + '. ' + cart[i].name + ' - ' + cart[i].price + ' P\n';
                }
                
                // Номер заказа 
                var orderNumber = Math.floor(Math.random() * 9000) + 1000;
                
                // Показываем сообщение
                alert('Заказ #' + orderNumber + ' оформлен!\n\n' + orderList + '\nИтого: ' + total + ' P\n\nСпасибо за заказ!');
                
                // Очищаем корзину
                cart = [];
                total = 0;
                updateCartDisplay();
                localStorage.removeItem('cyberx_cart');
            }
        }
        
        // Фильтрация товаров по категории
        function filterItems(category) {
            var items = document.querySelectorAll('.item-card');
            
            for (var i = 0; i < items.length; i++) {
                var itemCategory = items[i].getAttribute('data-category');
                
                if (category === 'all') {
                    items[i].style.display = 'block';
                } else if (itemCategory.includes(category)) {
                    items[i].style.display = 'block';
                } else {
                    items[i].style.display = 'none';
                }
            }
        }
        

        
        // "горячие" товары 
        setTimeout(function() {
            var allItems = document.querySelectorAll('.item-card');
            if (allItems.length > 0) {
                var randomIndex = Math.floor(Math.random() * allItems.length);
                allItems[randomIndex].style.border = '2px solid yellow';
            }
        }, 2000);
        
        // проверка времени 
        var now = new Date();
        var hour = now.getHours();
        if (hour >= 22 || hour < 8) {
            console.log('Ночное время, доставка может быть медленнее');
        }
