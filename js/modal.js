 // Получаем элементы
 var modal = document.getElementById("myModal");
 var btn = document.getElementById("openModalBtn");
 var span = document.getElementById("closeModalBtn");
 var saveBtn = document.getElementById("saveBtn");
 var inputField = document.getElementById("modalInput");
 var savedKey = ''

 const windowOnload = function() {
    savedKey = localStorage.getItem('modalInputValue');
    if (savedKey) {
        document.getElementById('haveKey').innerHTML = 'Ключ сохранён'
    } else {
        document.getElementById('haveKey').innerHTML = 'Нет ключа';
    }
}

 // Когда пользователь нажимает на кнопку, открываем модальное окно
 btn.onclick = function() {
     modal.style.display = "block";
 }

 // Когда пользователь нажимает на <span> (x), закрываем модальное окно
 span.onclick = function() {
     modal.style.display = "none";
 }

 // Когда пользователь нажимает где-то вне модального окна, закрываем его
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }

 // Сохраняем значение из input в localStorage при нажатии на кнопку "Сохранить"
 saveBtn.onclick = function() {
     var inputValue = inputField.value;
     if(inputValue) {
         localStorage.setItem('modalInputValue', inputValue);
         alert('Значение сохранен: ' + inputValue);
         modal.style.display = "none"; // Закрываем модальное окно после сохранения
     } else {
         alert('Введите текст перед сохранением.');
     }
 }
 windowOnload()
