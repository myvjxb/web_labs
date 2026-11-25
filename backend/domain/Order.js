export class OrderItem {
  constructor(productId, productName, unitPrice, quantity) {
    this.productId = productId;
    this.productName = productName;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }

  getSubtotal() {
    return this.unitPrice * this.quantity;
  }
}

export class Order {
  constructor(id, userId) {
    this.id = id;
    this.userId = userId;
    this.items = [];
    this.status = "draft";
    this.createdAt = new Date().toISOString();
  }

  addItem(product, quantity = 1) {
    if (!product.isAvailable(quantity)) {
      throw new Error(`Недостатньо товару "${product.name}" на складі`);
    }
    this.items.push(new OrderItem(product.id, product.name, product.price, quantity));
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  confirm() {
    if (this.items.length === 0) throw new Error("Не можна підтвердити порожнє замовлення");
    this.status = "confirmed";
  }
}