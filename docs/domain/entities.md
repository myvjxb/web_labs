# Аналіз домену та сутності (Music Store)

## Піддомени (Bounded Contexts)

### 1. Каталог (Catalog)
Відповідає за зберігання, перегляд та керування музичними інструментами.
* **Product (Товар)** — `id`, `name`, `category`, `price`, `stock` (кількість на складі).
* **Category (Категорія)** — `id`, `name` (наприклад: Електрогітари, Підсилювачі, Аксесуари).

### 2. Користувачі (Users)
Відповідає за облікові записи та ролі доступу.
* **User (Користувач)** — `id`, `email`, `name`, `role` (`customer` або `admin`).

### 3. Замовлення (Orders)
Відповідає за оформлення покупок та фіксацію позицій замовлення.
* **Order (Замовлення)** — `id`, `userId`, `items` (список `OrderItem`), `status` (`draft`, `confirmed`, `cancelled`), `createdAt`.
* **OrderItem (Позиція замовлення)** — `productId`, `productName`, `unitPrice`, `quantity`.