const logo = document.getElementById('logo')
const key = document.getElementById('key')
const secretKey = document.getElementById('sekret-key')
const symbol = document.getElementById('symbolInput')
const btnGetSymbol = document.getElementById('getSymbol')
const btcTrades = document.getElementById('btcTrades')
const cointTrades = document.getElementById('cointTrades')
const btnSave = document.getElementById('btnSave')
const deposit = document.getElementById('deposit')
const risk = document.getElementById('risk')
const stopLoss = document.getElementById('stopLoss')
const btnStopLoss = document.getElementById('btnStopLoss')
const positionSize = document.getElementById('positionSize')

const params = new URLSearchParams(window.location.search);
const param1 = params.get("param1"); // Получаем значение параметра "param1"
const param2 = params.get("param2"); // Получаем значение параметра "param2"

const GetSymbol = (symbol) => {
    //logo.textContent = symbol
    getTradeCount(symbol)
    calculateCorrelation(symbol)
    updateSymbol(`BINANCE:${symbol}.P`)
    updateSymbol2(`BINANCE:${symbol}.P`)
    document.getElementById('symbolInput').value = symbol
}

btnStopLoss.onclick = () => {
    if (deposit.value && risk.value && stopLoss.value) {
        positionSize.textContent = `Размер ставки: ${+deposit.value * (+risk.value / +deposit.value * 100) / +stopLoss.value}`
    }
    else {
        positionSize.textContent = `Заполни поля`
    }
}

btnSave.onclick = () => {
    const positionData = {
        symbol: document.getElementById('symbolInput').value,
        btc: btcTrades.textContent,
        coint: cointTrades.textContent,
        url: document.getElementById('url').value,
        incomePro: document.getElementById('income%').value,
        incomeDol: document.getElementById('income$').value,
        myError: document.getElementById('myError').value,
        conclusion: document.getElementById('conclusion').value,
        comment: document.getElementById('comment').value,
        strategy: document.getElementById('strategy').value,
        mood: document.getElementById('mood').value,
        vol_1d: document.getElementById('vol-1d').checked,
        vol_15m: document.getElementById('vol-15m').checked,
        corel: document.getElementById('correl').textContent,
        baga: document.getElementById('baga').checked
    }
    //console.log(positionData)
    saveText(positionData)
}

async function getTradeCount(tradeSynbol) {

    const url = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${tradeSynbol}`;
    console.log(tradeSynbol)
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const tradeCount = data.count;
        console.log(`Number of trades for ${tradeSynbol} in the last 24 hours: ${tradeCount}`);
        cointTrades.textContent = `${tradeSynbol}: ${(tradeCount / 1000000).toFixed(1)} M`
    } catch (error) {
        console.error('Error fetching trade count:', error);
    }
    const urlBtc = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=BTCUSDT`;

    try {
        const response = await fetch(urlBtc);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const tradeCount = data.count;
        btcTrades.textContent = `BTCUSDT: ${(tradeCount / 1000000).toFixed(1)} M`
    } catch (error) {
        console.error('Error fetching trade count:', error);
    }
}

function openNewPage(url) {
    if (url === 'TV') {
        const tvSymbol = document.getElementById('logo').textContent
        url = `https://ru.tradingview.com/chart/e8I7WHtC/?symbol=BINANCE%3A${tvSymbol}.P`
        window.open(url, '_blank')
    }
    else {
        window.open(url, '_blank')
    }
    
}



console.log('qqqqqqqqqqqqqqq', param1)
if (param1) {
    GetSymbol(param1)
}