# import requests
#
# # Параметры запроса
# symbol = "FIDAUSDT"  # Пример пары валют
#
# limit = 7  # Количество свечей
#
# # URL для запроса
# url = "https://fapi.binance.com/fapi/v1/klines"
# interval = '1d'
# params = {
#     "symbol": symbol.lower(),  # Пара BTC/USDT
#     "interval": interval,     # Интервал - 1 день
#     "limit": limit         # Последние 7 свечей
# }
# response = requests.get(url, params=params)
# data = response.json()
# print(data)
# Проверка на наличие свечей с ростом больше 8%
growth_threshold = 0.08


def get_blau_zone(candles):
    candles_with_growth = []
    for candle in candles:
        open_price = float(candle[1])
        close_price = float(candle[4])
        growth = (close_price - open_price) / open_price
        if growth > growth_threshold:
            candles_with_growth.append(candle)

    # Вывод результатов
    if candles_with_growth:
        print("Свечи с ростом больше 8%:")
        return len(candles_with_growth)
    else:
        print("Свечи с ростом больше 8% не найдены.")
        return False
