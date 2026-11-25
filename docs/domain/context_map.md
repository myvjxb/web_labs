# Контекстна карта (Context Map) — Music Store

```mermaid
flowchart LR
    Users["Bounded Context:<br/>Users<br/>(User, Auth)"]
    Catalog["Bounded Context:<br/>Catalog<br/>(Product, Category)"]
    Orders["Bounded Context:<br/>Orders<br/>(Order, OrderItem)"]

    Users -->|Надає дані покупця та роль| Orders
    Catalog -->|Надає список товарів і ціни| Orders
    Orders -->|Повідомляє про списання залишків| Catalog
```

## Взаємодія контекстів
* **Users → Orders:** передає інформацію про авторизованого покупця (`userId`, роль) для оформлення замовлення.
* **Catalog → Orders:** надає актуальні дані про товари (назва, ціна, наявність) при додаванні в замовлення.
* **Orders → Catalog:** після підтвердження замовлення повідомляє каталог про необхідність зменшити залишок (`stock`).
