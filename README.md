# Установка и запуск

### 1\. Подготовка

1.  Установить зависимости:
    ```bash
    npm install
    ```
2.  Создать два файла `.env.development` и `.env.production` в корне проекта.
3.  Разместить файл с ключами Google API в `.json` формате

-----

### 2\. Запуск локально

1.  Запустить локальный PostgreSQL-сервер.
2.  Выполнить миграции базы данных:
    ```bash
    npm run migrate
    ```
3.  Запустить приложение:
    ```bash
    npm run start:dev
    ```

-----

### 3\. Docker

Запуск:
    ```
    docker-compose up --build
    ```
