 
        // навигация 
        var links = document.getElementsByTagName('a');
        
        for (var i = 0; i < links.length; i++) {
            links[i].onclick = function() {
                // удаляем active у всех ссылок
                for (var j = 0; j < links.length; j++) {
                    links[j].className = links[j].className.replace(' active', '');
                }
                
                // Добавляем active к текущей 
                this.className = this.className + ' active';
                
                // плавная прокрутка 
                if (this.innerHTML === 'Каталог игр') {
                    setTimeout(function() {
                        window.scrollTo(0, 800); // скролл на фиксированную позицию
                    }, 100);
                }
                
                return true;
            };
        }
        

        
        // Ещё один странный кусок кода
        var cards = document.querySelectorAll('.game-card');
        for (var k = 0; k < cards.length; k++) {
            cards[k].onmouseover = function() {
                this.style.backgroundColor = 'rgba(159, 159, 215, 0.1)'; // Просто меняем цвет
            };
            cards[k].onmouseout = function() {
                this.style.backgroundColor = ''; // Возвращаем обратно
            };
        }
        
