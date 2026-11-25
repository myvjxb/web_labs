import { randomUUID } from "crypto";
import { Product } from "../domain/Product.js";

export class AppError extends Error {
  constructor(status, error, code, details = []) {
    super(error);
    this.status = status;
    this.error = error;
    this.code = code;
    this.details = details;
  }
}

export class ProductService {
  constructor() {
    this.products = new Map();
    // Початковий товар для прикладу
    this.create({ name: "Fender Stratocaster", price: 850, stock: 3, category: "Guitars" });
  }

  toDTO(product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }

  getAll() {
    return Array.from(this.products.values()).map((p) => this.toDTO(p));
  }

  getById(id) {
    const product = this.products.get(id);
    if (!product) {
      throw new AppError(404, "NotFoundError", "PRODUCT_NOT_FOUND", [
        { field: "id", message: `Product with id '${id}' not found` }
      ]);
    }
    return this.toDTO(product);
  }

  create(dto) {
    const details = [];
    if (!dto?.name || typeof dto.name !== "string" || !dto.name.trim()) {
      details.push({ field: "name", message: "Name is required" });
    }
    if (typeof dto?.price !== "number" || dto.price <= 0) {
      details.push({ field: "price", message: "Price must be a positive number" });
    }
    if (details.length > 0) {
      throw new AppError(400, "ValidationError", "INVALID_PRODUCT_DATA", details);
    }

    const now = new Date().toISOString();
    const product = new Product(
      `prod-${randomUUID().slice(0, 8)}`,
      dto.name.trim(),
      dto.price,
      dto.stock ?? 0,
      dto.category ?? "General"
    );
    product.createdAt = now;
    product.updatedAt = now;

    this.products.set(product.id, product);
    return this.toDTO(product);
  }

  update(id, dto) {
    const product = this.products.get(id);
    if (!product) {
      throw new AppError(404, "NotFoundError", "PRODUCT_NOT_FOUND", [
        { field: "id", message: `Product with id '${id}' not found` }
      ]);
    }

    if (dto.price !== undefined && (typeof dto.price !== "number" || dto.price <= 0)) {
      throw new AppError(400, "ValidationError", "INVALID_PRICE", [
        { field: "price", message: "Price must be a positive number" }
      ]);
    }

    if (dto.name !== undefined) product.name = String(dto.name).trim();
    if (dto.price !== undefined) product.updatePrice(dto.price);
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.category !== undefined) product.category = dto.category;
    product.updatedAt = new Date().toISOString();

    return this.toDTO(product);
  }

  delete(id) {
    if (!this.products.has(id)) {
      throw new AppError(404, "NotFoundError", "PRODUCT_NOT_FOUND", [
        { field: "id", message: `Product with id '${id}' not found` }
      ]);
    }
    this.products.delete(id);
  }
}