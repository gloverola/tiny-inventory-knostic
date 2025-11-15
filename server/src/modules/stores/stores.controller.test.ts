import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import * as controller from "./stores.controller";
import * as storesService from "./stores.service";

// Mock the service module
vi.mock("./stores.service");

describe("Stores Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    next = vi.fn() as unknown as NextFunction;
    vi.clearAllMocks();
  });

  describe("listStores", () => {
    it("should return paginated stores", async () => {
      const mockResult = {
        stores: [
          {
            id: "1",
            name: "Store 1",
            location: "Location 1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      vi.mocked(storesService.getAllStores).mockResolvedValue(mockResult);

      req.query = { page: "1", limit: "10" };
      await controller.listStores(req as Request, res as Response, next);

      expect(storesService.getAllStores).toHaveBeenCalledWith(1, 10);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle validation errors", async () => {
      req.query = { page: "invalid", limit: "10" };
      await controller.listStores(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Invalid query parameters" })
      );
    });
  });

  describe("getStore", () => {
    it("should return a store by id", async () => {
      const mockStore = {
        id: "1",
        name: "Store 1",
        location: "Location 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(storesService.getStoreById).mockResolvedValue(mockStore);

      req.params = { id: "1" };
      await controller.getStore(req as Request, res as Response, next);

      expect(storesService.getStoreById).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockStore);
    });

    it("should return 404 if store not found", async () => {
      vi.mocked(storesService.getStoreById).mockResolvedValue(null as any);

      req.params = { id: "1" };
      await controller.getStore(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Store not found" });
    });
  });

  describe("createStore", () => {
    it("should create a new store", async () => {
      const newStore = { name: "New Store", location: "New Location" };
      const createdStore = {
        id: "1",
        ...newStore,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(storesService.createStore).mockResolvedValue(createdStore);

      req.body = newStore;
      await controller.createStore(req as Request, res as Response, next);

      expect(storesService.createStore).toHaveBeenCalledWith(newStore);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdStore);
    });

    it("should handle validation errors", async () => {
      req.body = { name: "" }; // Invalid data
      await controller.createStore(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Invalid request body" })
      );
    });
  });

  describe("getStoreProducts", () => {
    it("should return store products", async () => {
      const mockStore = {
        id: "1",
        name: "Store 1",
        location: "Location 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockProducts = {
        products: [
          {
            id: "1",
            name: "Product 1",
            storeId: "1",
            categoryId: null,
            category: "Electronics",
            price: "99.99",
            quantity: 10,
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      vi.mocked(storesService.getStoreById).mockResolvedValue(mockStore);
      vi.mocked(storesService.getStoreProducts).mockResolvedValue(mockProducts);

      req.params = { id: "1" };
      req.query = { page: "1", limit: "10" };
      await controller.getStoreProducts(req as Request, res as Response, next);

      expect(storesService.getStoreProducts).toHaveBeenCalledWith(
        "1",
        1,
        10,
        undefined
      );
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should filter by category", async () => {
      const mockStore = {
        id: "1",
        name: "Store 1",
        location: "Location 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(storesService.getStoreById).mockResolvedValue(mockStore);
      vi.mocked(storesService.getStoreProducts).mockResolvedValue({
        products: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });

      req.params = { id: "1" };
      req.query = { page: "1", limit: "10", category: "Electronics" };
      await controller.getStoreProducts(req as Request, res as Response, next);

      expect(storesService.getStoreProducts).toHaveBeenCalledWith(
        "1",
        1,
        10,
        "Electronics"
      );
    });
  });
});
