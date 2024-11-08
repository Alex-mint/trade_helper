def add_listing(is_listing):
    file_path = 'js/listing.js'
    new_first_line = f'allowedTickers = {is_listing}\n'

    # Читаем файл, изменяем первую строку и сохраняем
    with open(file_path, 'r', encoding='utf-8') as file:  # указываем кодировку 'utf-8'
        lines = file.readlines()

    # Меняем первую строку
    lines[0] = new_first_line

    # Записываем измененный текст обратно в файл
    with open(file_path, 'w', encoding='utf-8') as file:  # указываем кодировку 'utf-8'
        file.writelines(lines)

