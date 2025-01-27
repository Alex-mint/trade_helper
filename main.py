import json
import time
import requests

from get_blau_zone import get_blau_zone
from level import check_level
# from listing import add_listing
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
        blau_zone = get_blau_zone(klines)
        volumes = [float(kline[7]) for kline in klines]
        if len(volumes) < 90:
            listing = str(len(volumes))
        volumes_sorted = sorted(volumes, reverse=True)
        index = len(volumes) // 3
        average_volume = volumes_sorted[-index]
        highest_prices = [float(kline[2]) for kline in klines[-6:]]  # Список максимальных цен
        low_prices = [float(kline[3]) for kline in klines[-6:]]  # Список максимальных цен
        # check_level(highest_prices, low_prices)
        print(average_volume)
        return average_volume, listing, highest_prices, low_prices, blau_zone
    else:
        print(f"Ошибка: {response.status_code}")
        return 0, False, False, False, False



def main():
    average_volumes = {}
    is_listing = {}
    levels = {}
    whit_blau_zone = {}
    tickets = get_tickets()
    for ticket in tickets:
        volume, listing, highest_prices, low_prices, blau_zone = get_average_volume(ticket)
        if listing:
            is_listing[ticket.upper()] = listing
        if volume:
            average_volumes[ticket.upper()] = volume
        with_levels = check_level(highest_prices, low_prices)
        if with_levels:
            levels[ticket.upper()] = with_levels
        if blau_zone:
            whit_blau_zone[ticket.upper()] = blau_zone
        time.sleep(1)

    with open('coinsData.json', 'w') as fp:
        json.dump(average_volumes, fp)

    with open('levelsData.json', 'w') as fp:
        json.dump(levels, fp)

    with open('listingData.json', 'w') as fp:
        json.dump(is_listing, fp)

    with open('blauZoneData.json', 'w') as fp:
        json.dump(whit_blau_zone, fp)
    print('whit_blau_zone', whit_blau_zone)
    # add_listing(is_listing)
    git_add_commit_push('coinsData.json')
    git_add_commit_push('levelsData.json')
    git_add_commit_push('listingData.json')
    git_add_commit_push('blauZoneData.json')
    '''
    страница с уровнями
    --- зелёная зона
    кнопка назад ⚡
    '''



main()

