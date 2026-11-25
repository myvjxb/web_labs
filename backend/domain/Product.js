export class Product {
  constructor(id, name, price, stock = 0, category = "General") {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }

  isAvailable(quantity = 1) {
    return this.stock >= quantity;
  }

  updatePrice(newPrice) {
    if (newPrice <= 0) throw new Error("Ціна має бути більшою за 0");
    this.price = newPrice;
  }
}