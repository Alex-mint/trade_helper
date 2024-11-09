import time
import webbrowser

import requests

from get_all_ticket import get_tickets
from grafik import create_and_save_chart as graf

# Определяем параметры запроса
url = "https://fapi.binance.com/fapi/v1/klines"
interval = '1d'
tolerance = 0.2  # 1% допустимая разница
limit = 24
listing = {}
def get_upper_level(highest_prices):

    max_price = max(highest_prices)
    for price in highest_prices:
        if price == max_price:
            continue
        difference = abs(max_price - price) / max_price * 100  # Процентная разница
        count = 0
        if difference <= tolerance:  # Если разница меньше или равна 1%
            return price
        else:
            return False


def get_lover_level(low_prices):

    low_price = min(low_prices)
    # print(highest_prices)
    for price in low_prices:
        if price == low_price:
            continue
        difference = abs(low_price - price) / low_price * 100  # Процентная разница
        count = 0
        if difference <= tolerance:  # Если разница меньше или равна 1%
            # print(f"{params['symbol']} Количество касаний уровня: 1 ценой: {max_price}")
            return price
        else:
            return False


''' Выполняем запрос к API
проверка на наличие уровня '''
def check_symbol(symbol):

    params = {
        "symbol": symbol,  # Пара BTC/USDT
        "interval": interval,     # Интервал - 1 день
        "limit": limit         # Последние 7 свечей
    }
    response = requests.get(url, params=params)

    # Обрабатываем ответ
    if response.status_code == 200:
        klines = response.json()

        if len(klines) < limit:
            listing[symbol] = len(klines)

        highest_prices = [float(kline[2]) for kline in klines[-6:]]  # Список максимальных цен
        low_prices = [float(kline[3]) for kline in klines[-6:]]  # Список максимальных цен

        # Подсчет касаний в пределах 1% от максимальной цены
        a = 2
        for i in range(len(highest_prices) - 1):
            upper_level_response = get_upper_level(highest_prices[-a:])
            lover_level_response = get_lover_level(low_prices[-a:])
            if upper_level_response:
                print(f"{params['symbol'].upper()} Найден верхний уровень ")
                graf(symbol, highest_prices=highest_prices, upper_level=upper_level_response, lower_level=None)
            if lover_level_response:
                print(f"{params['symbol'].upper()} Найден нижний уровень ")
                graf(symbol, highest_prices=low_prices, upper_level=None, lower_level=lover_level_response)
            a += 1
    else:
        print(f"Ошибка: {response.status_code}")





def main(row_tickets):

    tickets = [key for key in row_tickets.keys()]
    for ticket in tickets:
        check_symbol(ticket)
        time.sleep(3)
    return listing


row_tickets, full_tickers = get_tickets()
main(row_tickets)
# check_symbol('TRXUSDT')