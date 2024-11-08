import json
import time
import requests

from listing import add_listing
from push import git_add_commit_push


def get_tickets():
    limit = 2000000
    tickers = []
    url = "https://fapi.binance.com/fapi/v1/ticker/24hr"
    response = requests.get(url)

    if response.status_code == 200:
        response = response.json()
        for ticker in response:
            symbol = ticker['symbol']
            vol = float(ticker['quoteVolume'])
            if vol > limit:
                if 'USDT' in symbol:
                    tickers.append(symbol.lower())


    # print(full_tickers)
    print(tickers)
    print(len(tickers))
    return tickers


def get_average_volume(symbol):
    url = "https://fapi.binance.com/fapi/v1/klines"
    interval = '1d'
    limit = 100
    params = {
        "symbol": symbol,  # Пара BTC/USDT
        "interval": interval,     # Интервал - 1 день
        "limit": limit         # Последние 7 свечей
    }
    response = requests.get(url, params=params)

    # Обрабатываем ответ
    if response.status_code == 200:
        listing = False
        klines = response.json()
        volumes = [float(kline[7]) for kline in klines]
        if len(volumes) < 90:
            listing = True
        volumes_sorted = sorted(volumes, reverse=True)
        index = len(volumes) // 3
        average_volume = volumes_sorted[-index]
        print(average_volume)
        return  average_volume, listing
    else:
        print(f"Ошибка: {response.status_code}")
        return 0, False



def main():
    average_volumes = {}
    is_listing = []
    tickets = get_tickets()
    for ticket in tickets:
        volume, listing = get_average_volume(ticket)
        if listing:
            is_listing.append(ticket)
        if volume:
            average_volumes[ticket.upper()] = volume
        time.sleep(1)

    with open('coinsData.json', 'w') as fp:
        json.dump(average_volumes, fp)
    print(is_listing)
    add_listing(is_listing)
    git_add_commit_push()




main()

