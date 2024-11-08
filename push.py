import subprocess


# Пример использования функции
file_path = r"C:\Users\soyvi\Downloads\trade_helper\coinsData.json"  # укажите путь к файлу
commit_message = "Обновление файла с помощью скрипта на Python"
  # укажите ветку, обычно это main или master

def git_add_commit_push():
    branch = "main"
    try:
        # Добавление файла в индекс
        subprocess.run(["git", "add", file_path], check=True)

        # Создание коммита
        subprocess.run(["git", "commit", "-m", commit_message], check=True)

        # Пуш изменений на удалённый репозиторий
        subprocess.run(["git", "push", "origin", branch], check=True)

        print("Файл успешно добавлен, закоммичен и отправлен на GitHub.")

    except subprocess.CalledProcessError as e:
        print("Произошла ошибка:", e)





