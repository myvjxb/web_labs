# ADR 0003: Стиль API та єдина модель помилок

* **Статус:** Прийнято
* **Дата:** 2026-11-25

## Рішення
* API будується у стилі **REST** із використанням JSON та стандартних HTTP-методів (`GET`, `POST`, `PATCH`, `DELETE`).
* Усі ендпоінти та DTO мають строго відповідати контракту `docs/api/openapi.yaml`.
* **Політика кодів:** `200 OK` (читання/оновлення), `201 Created` (створення), `204 No Content` (видалення), `400 Bad Request` (валідація), `404 Not Found` (сутність не знайдена), `500 Internal Server Error` (непередбачена помилка).
* **Єдиний формат помилки (`ErrorResponse`):**
```json
{
  "error": "ValidationError",
  "code": "INVALID_PRODUCT_DATA",
  "details": [{ "field": "name", "message": "Name is required" }]
}
