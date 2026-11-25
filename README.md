# Music Store

# Запуск бекенду
```bash
cd backend
npm install
npm start
``` 

## API документація
* Специфікація OpenAPI: [docs/api/openapi.yaml](./docs/api/openapi.yaml)

![Swagger Editor](./docs/api/swagger_screenshot.png)

## Docker — Бекенд (Практична 6)
```bash
docker build -t music-store-api:1.0.0 ./backend
docker run --name music-api --rm -d -p 3000:3000 music-store-api:1.0.0
```
Порт: http://localhost:3000 (перевірка: http://localhost:3000/health)

Зупинка: `docker stop music-api`

## Docker — Перевірка та Фронтенд

### Перевірка встановлення
```bash
docker version
docker run hello-world
