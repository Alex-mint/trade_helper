const backeBtn = document.getElementById("backeBtn")
let allowedTickers = []

// Функция для загрузки allowedTickers из JSON файла на GitHub
async function loadAllowedTickers() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Alex-mint/trade_helper/refs/heads/main/levelsData.json');
        allowedTickers = await response.json();
    } catch (error) {
        console.error("Ошибка при загрузке allowedTickers:", error);
    }
}

// Функция для поиска монеты
async function searchCoin(coinName) {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Alex-mint/trade_helper/refs/heads/main/coinsData.json');
        const coins = await response.json();

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
    const tableBody = document.getElementById("cryptoTable");
    tableBody.innerHTML = '';

    for (const row of data) {
        const tr = document.createElement("tr");
        const changeClass = parseFloat(row.priceChangePercent) >= 0 ? "positive" : "negative";

        // Дожидаемся результата поиска монеты
        const coinValue = await searchCoin(row.symbol); 
        const adjustedVolume = coinValue ? (row.quoteVolume / coinValue).toFixed(2) : null;

        // Получаем значение из allowedTickers для текущего символа
        const allowedTickerValue = allowedTickers[row.symbol] || 'N/A';

        tr.innerHTML = `
            <td>
                <p>
                    <span class="cursor" onclick="openSymbolPage('${row.symbol}')">+</span> 
                    <span class="cursor" onclick="newSymbol('BINANCE:${row.symbol}.P')" class="">
                        ${row.symbol} (${allowedTickerValue})
                    </span>
                </p>
            </td>
            <td class="right-align">${(row.count / 1000000).toFixed(1)} M</td>
            <td class="right-align">${adjustedVolume !== null ? adjustedVolume : 'N/A'}</td>
            <td class="${changeClass} right-align">${Number(row.priceChangePercent).toFixed(2)}</td>
        `;

        row.adjustedVolume = adjustedVolume !== null ? parseFloat(adjustedVolume) : null;
        tableBody.appendChild(tr);
    }
}

// Функция для сортировки данных
function sortTable(data, column) {
    let sortOrder = {
        ticker: 'asc',
        deals: 'desc',
        turnover: 'asc',
        change: 'asc'
    };

    data.sort((a, b) => {
        let valA, valB;

        if (column === 'ticker') {
            valA = a.symbol;
            valB = b.symbol;
        } else if (column === 'deals') {
            valA = a.count;
            valB = b.count;
        } else if (column === 'turnover') {
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
async function fetchData() {
    const apiUrl = 'https://fapi.binance.com/fapi/v1/ticker/24hr';
    const excludedTickers = ["OCEANUSDT", "AGIXUSDT", "WAVESUSDT"];

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Фильтрация по обороту больше $50,000,000 и наличию в allowedTickers
        const filteredData = data.filter(item =>
            parseFloat(item.quoteVolume) > 50_000_000 &&
            item.symbol.includes("USDT") &&
            Object.keys(allowedTickers).includes(item.symbol) &&
            !excludedTickers.includes(item.symbol)
        );

        // Изначальная сортировка по количеству сделок (убывание)
        filteredData.sort((a, b) => b.count - a.count);
        renderTable(filteredData);

        document.getElementById("sortTicker").addEventListener("click", () => sortTable(filteredData, 'ticker'));
        document.getElementById("sortDeals").addEventListener("click", () => sortTable(filteredData, 'deals'));
        document.getElementById("sortTurnover").addEventListener("click", () => sortTable(filteredData, 'turnover'));
        document.getElementById("sortPriceChange").addEventListener("click", () => sortTable(filteredData, 'change'));
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Вызов функций для загрузки allowedTickers и данных из API при загрузке страницы
document.addEventListener("DOMContentLoaded", async function() {
    await loadAllowedTickers(); // Загружаем allowedTickers из JSON
    fetchData();  // Получаем данные из API после загрузки allowedTickers
});

// Обработчики для других действий на странице
const newSymbol = (symbol) => {
    updateSymbol(symbol);
    updateSymbol2(symbol);
    document.getElementById('selectedCoint').textContent = symbol.split(':')[1].split('.')[0];
    calculateCorrelation(symbol.split(':')[1].split('.')[0]);
};

const openSymbolPage = (param) => {
    const filePath = "/scalper";
    const params = new URLSearchParams({ param1: param, param2: "1" });
    window.open(`${filePath}?${params.toString()}`, "_blank");
};

window.onload = function() {
    var headerCells = document.querySelectorAll('.table-header .cell');
    var contentCells = document.querySelectorAll('.table-content .row:first-child .cell');

    headerCells.forEach((headerCell, index) => {
        headerCell.style.width = `${contentCells[index].offsetWidth}px`;
    });
};

backeBtn.onclick = function() {
    window.open('https://alex-mint.github.io/trade_helper', '_blank')
}