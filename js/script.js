let selectedCoint = document.getElementById('selectedCoint').textContent

window.onload = function() {
    var headerCells = document.querySelectorAll('.table-header .cell');
    var contentCells = document.querySelectorAll('.table-content .row:first-child .cell');

    headerCells.forEach((headerCell, index) => {
        headerCell.style.width = `${contentCells[index].offsetWidth}px`;
    });
};

const newSymbol = (symbol) => {
    updateSymbol(symbol)
    updateSymbol2(symbol)
    document.getElementById('selectedCoint').textContent = symbol.split(':')[1].split('.')[0]
    calculateCorrelation(symbol.split(':')[1].split('.')[0])

    
}

document.addEventListener("DOMContentLoaded", function() {
    let sortOrder = {
        ticker: 'asc',
        deals: 'desc',  // Начальная сортировка по убыванию количества сделок
        turnover: 'asc',
        change: 'asc'
    };

    const tableBody = document.getElementById("cryptoTable");

    // Функция для отображения данных в таблице
    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement("tr");
            const changeClass = parseFloat(row.priceChangePercent) >= 0 ? "positive" : "negative";

            tr.innerHTML = `
                <td><p><span  class="cursor" onclick="openSymbolPage('${row.symbol}')">+</span> <span class="cursor" onclick="newSymbol('BINANCE:${row.symbol}.P')" class="">${row.symbol}</span></p></td>
                <td class="right-align">${(row.count/1000000).toFixed(1)} M</td>
                <td class="right-align">${(row.quoteVolume/1000000000).toFixed(2)} B</td>
                <td class="${changeClass} right-align">${Number(row.priceChangePercent).toFixed(2)}</td>
            `;

            tableBody.appendChild(tr);
        });
    }

    // Функция для сортировки данных
    function sortTable(data, column) {
        data.sort((a, b) => {
            let valA, valB;
            if (column === 'ticker') {
                valA = a.symbol;
                valB = b.symbol;
            } else if (column === 'deals') {
                valA = a.count;
                valB = b.count;
            } else if (column === 'turnover') {
                valA = parseFloat(a.quoteVolume);
                valB = parseFloat(b.quoteVolume);
            } else if (column === 'change') {
                valA = parseFloat(a.priceChangePercent);
                valB = parseFloat(b.priceChangePercent);
            }
            if (sortOrder[column] === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
        sortOrder[column] = sortOrder[column] === 'asc' ? 'desc' : 'asc';
        renderTable(data);
    }

    // Функция для получения данных из API

    function fetchData() {
        const apiUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr'; // Замените на ваш URL API
        const excludedTickers = ["OCEANUSDT", "AGIXUSDT", "AAVEUSDT", "GMXUSDT", "WAVESUSDT"]
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Фильтрация по обороту больше $1,000,000,000
                const filteredData = data.filter(item => 
                    parseFloat(item.quoteVolume) > 50_000_000 && 
                    item.symbol.includes("USDT") &&
                    !excludedTickers.includes(item.symbol)
                )
    
                // Изначальная сортировка по количеству сделок (убывание)
                filteredData.sort((a, b) => b.count - a.count);
                renderTable(filteredData);
                
                document.getElementById("sortTicker").addEventListener("click", () => sortTable(filteredData, 'ticker'));
                document.getElementById("sortDeals").addEventListener("click", () => sortTable(filteredData, 'deals'));
                document.getElementById("sortTurnover").addEventListener("click", () => sortTable(filteredData, 'turnover'));
                document.getElementById("sortPriceChange").addEventListener("click", () => sortTable(filteredData, 'change'));
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }
 

    // Обработчик нажатия на заголовок "Статистика за 24 часа"
    document.getElementById("refreshData").addEventListener("click", fetchData);

    // Вызов функции для получения данных и инициализации таблицы при загрузке страницы
    fetchData();
});

const openSymbolPage = (param) => {
    const filePath = "/trade_helper/symbol"; // Относительный путь к вашему файлу
    const params = new URLSearchParams({ param1: param, param2: "1"});
    window.open(`${filePath}?${params.toString()}`, "_blank");

}




