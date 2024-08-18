const correl = document.getElementById('correl')

async function getPriceData(coinSymbol) {
    //const apiKey = 'ВАШ_API_KEY'; // Если используете CryptoCompare, добавьте свой API ключ здесь
    const apiKey = localStorage.getItem('modalInputValue')
    const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histohour`, {
        params: {
            fsym: coinSymbol,
            tsym: 'USDT',
            limit: 24,
            api_key: apiKey
        }
    });

    // Возвращаем только цены закрытия
    return response.data.Data.Data.map(price => price.close);
}

function calculateCorrelation_(x, y) {
    const meanX = math.mean(x);
    const meanY = math.mean(y);

    const covariance = math.mean(x.map((val, i) => (val - meanX) * (y[i] - meanY)));
    const stdDevX = math.std(x);
    const stdDevY = math.std(y);

    if (stdDevX === 0 || stdDevY === 0) {
        return NaN;
    }

    return covariance / (stdDevX * stdDevY);
}

async function calculateCorrelation(symbol) {
    const resultDiv = document.getElementById('result');
    correl.innerText = 'Загрузка...';

    try {
        const btcPrices = await getPriceData('BTC');
        const solPrices = await getPriceData(symbol.slice(0, -4));
        console.log(btcPrices)

        if (btcPrices.length === solPrices.length) {
            const correlation = calculateCorrelation_(btcPrices, solPrices);

            if (!isNaN(correlation)) {
                //console.log(`Корреляция h12h: ${correlation.toFixed(1)}`)
                correl.innerText = `Кор 12h: ${correlation.toFixed(1)}`;
            } else {
                //console.log(`Корреляция между Биткойном и Solana за последние 12 часов: 2`)

                correl.innerText = 'нет данных.';
            }
        } else {
            //console.log('Ошибка: 2')

            correl.innerText = 'Ошибка: 2';
        }
    } catch (error) {
        console.log(` 12 часов:`, error.message)

        correl.innerText = 'Ошибка: ' + error.message;
    }
}

//calculateCorrelation('BTC')
