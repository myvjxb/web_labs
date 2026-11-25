import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ProductService, AppError } from "./productService.js";

describe("ProductService unit tests", () => {
  it("створює товар при коректних даних", () => {
    const service = new ProductService();
    const created = service.create({
      name: "Boss DS-1 Distortion",
      price: 65,
      stock: 10,
      category: "Pedals"
    });

    assert.ok(created.id.startsWith("prod-"));
    assert.equal(created.name, "Boss DS-1 Distortion");
    assert.equal(created.price, 65);
  });

  it("викидає ValidationError, якщо відсутнє обов'язкове поле name", () => {
    const service = new ProductService();

    assert.throws(
      () => service.create({ price: 100 }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.status, 400);
        assert.equal(err.code, "INVALID_PRODUCT_DATA");
        return true;
      }
    );
  });
    it("викидає NotFoundError (404), якщо товар не знайдено", () => {
    const service = new ProductService();

    assert.throws(
      () => service.getById("non-existent-id"),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.status, 404);
        assert.equal(err.code, "PRODUCT_NOT_FOUND");
        return true;
      }
    );
  });

  it("видаляє існуючий товар", () => {
    const service = new ProductService();
    const created = service.create({ name: "Yamaha Pacifica", price: 320 });
    service.delete(created.id);

    assert.throws(() => service.getById(created.id), AppError);
  });

});