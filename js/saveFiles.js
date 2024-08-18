function saveTextFile(text, filename) {
    // Создание Blob объекта из текста
    const blob = new Blob([text], { type: 'text/plain' });
    


    // Создание ссылки для скачивания
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Клик по ссылке для начала скачивания
    document.body.appendChild(link);
    link.click();

    // Удаление ссылки из документа
    document.body.removeChild(link);
}

// Пример использования
const symboll = 'ETHUSDT';

const saveText = (positionData) => {
    //saveTextFile(symboll, text);
    const now = new Date();
    console.log(positionData.symbol)
    //const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
    const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;

    const filename = `${formattedDateTime} - ${positionData.symbol}.md`
    
    const text = `

deposito:: 100
risk:: 3
stop:: 22 


#### ${formattedDateTime}

#### Монета: ${positionData.symbol}

### По стратегии Бага: ${positionData.baga}
### Стратегия: ${positionData.strategy}

### Число сделок
${positionData.btc}
${positionData.coint}

${positionData.corel}
Повышенные объёмы 1Д:  ${positionData.vol_1d}
Повышенные объёмы 15м:  ${positionData.vol_15m}
Настрой:  ${positionData.mood}
Доход в %:  ${positionData.incomePro}
Доход в $:  ${positionData.incomeDol}
Url:  ${positionData.url}
### Коментарий:
 ${positionData.comment}
### Ошибки:
 ${positionData.myError}
### Вывод: 
${positionData.conclusion}

-------------------

symbol:: ${positionData.symbol}
strategy:: ${positionData.strategy}
btc:: ${positionData.btc}
coint:: ${positionData.coint}
corel:: ${positionData.corel}
vol_1d:: ${positionData.vol_1d}
vol_15m:: ${positionData.vol_15m}
mood:: ${positionData.mood}
incomePro:: ${positionData.incomePro}
incomeDol:: ${positionData.incomeDol}
url:: ${positionData.url}
comment:: ${positionData.comment}
conclusion:: ${positionData.conclusion}
baga:: ${positionData.baga}
myError:: ${positionData.myError}
`

saveTextFile(text, filename)
}
