let selectedCoint = document.getElementById('selectedCoint').textContent
var listingBtn = document.getElementById("listingBtn")
var levelsBtn = document.getElementById("levelsBtn")
var blauBtn = document.getElementById("blauBtn")

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

    // Функция для поиска монеты
    async function searchCoin(coinName) {
        
        
        try {
            // Загружаем данные из JSON-файла с GitHub
            const response = await fetch('https://raw.githubusercontent.com/Alex-mint/trade_helper/refs/heads/main/coinsData.json');
            const coins = await response.json();
    
            // Проверяем наличие монеты
            const coinValue = coins[coinName];
            if (coinValue !== undefined) {
                return coinValue;
            }
        } catch (error) {
            
            console.error(error);
        }
    }

    // Функция для отображения данных в таблице
async function renderTable(data) {
    tableBody.innerHTML = '';
    
    for (const row of data) {
        const tr = document.createElement("tr");
        const changeClass = parseFloat(row.priceChangePercent) >= 0 ? "positive" : "negative";
        
        // Дожидаемся результата поиска монеты
        const coinValue = await searchCoin(row.symbol); // Асинхронный вызов
        const adjustedVolume = coinValue ? (row.quoteVolume / coinValue).toFixed(2) : null; // Предварительно вычисляем значение

        tr.innerHTML = `
            <td><p><span class="cursor" onclick="openSymbolPage('${row.symbol}')">+</span> <span class="cursor" onclick="newSymbol('BINANCE:${row.symbol}.P')" class="">${row.symbol}</span></p></td>
            <td class="right-align">${(row.count / 1000000).toFixed(1)} M</td>
            <td class="right-align">${adjustedVolume !== null ? adjustedVolume : 'N/A'}</td>
            <td class="${changeClass} right-align">${Number(row.priceChangePercent).toFixed(2)}</td>
        `;

        // Сохраняем вычисленное значение для сортировки
        row.adjustedVolume = adjustedVolume !== null ? parseFloat(adjustedVolume) : null;

        tableBody.appendChild(tr);
    }
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
            // Используем заранее вычисленные значения `adjustedVolume` для сортировки
            valA = a.adjustedVolume !== null ? a.adjustedVolume : 0;
            valB = b.adjustedVolume !== null ? b.adjustedVolume : 0;
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
    renderTable(data); // Обновляем таблицу после сортировки
}


    // Функция для получения данных из API
    function fetchData() {
        const apiUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr'; // Замените на ваш URL API
        const excludedTickers = ["OCEANUSDT", "AGIXUSDT", "WAVESUSDT"];
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Фильтрация по обороту больше $50,000,000
                const filteredData = data.filter(item => 
                    parseFloat(item.quoteVolume) > 50_000_000 && 
                    item.symbol.includes("USDT") &&
                    !excludedTickers.includes(item.symbol)
                );
    
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

    // Вызов функции для получения данных и инициализации таблицы при загрузке страницы
    fetchData();
});

const openSymbolPage = (param) => {
    const filePath = "/scalper"; // Относительный путь к вашему файлу
    const params = new URLSearchParams({ param1: param, param2: "1"});
    window.open(`${filePath}?${params.toString()}`, "_blank");
};

listingBtn.onclick = function() {
    window.open('https://alex-mint.github.io/trade_helper/listing', '_blank')
}

levelsBtn.onclick = function() {
    window.open('https://alex-mint.github.io/trade_helper/level', '_blank')
}

blauBtn.onclick = function() {
    window.open('https://alex-mint.github.io/trade_helper/blau', '_blank')
}





