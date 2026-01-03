import "reflect-metadata";
import express from "express";
import request from "supertest";
import bodyParser from "body-parser";
import { Container } from "typedi";
import { errors as celebrateErrors } from "celebrate";

import operationPlanRoutes from "../../src/api/routes/OperationPlanRoute";
import OperationPlanController from "../../src/controllers/OperationPlanController";
import config from "../../config";

// Mock do middleware requireRole
jest.mock("../../src/api/middlewares/RequiredRole", () => ({
  requireRole: () => {
    return (req: any, res: any, next: any) => {
      req.userRole = 'Admin';
      next();
    };
  }
}));

jest.mock("../../config", () => ({
  controllers: {
    operationPlan: {
      name: "OperationPlanController"
    }
  },
  services: {
    operationPlan: {
      name: "operationPlanService"
    }
  },
  env: "development"
}));

// ----------------------------------------------------
// Mock do Service (SUT = Routes + Controller + Validação)
// O Controller é REAL, apenas o Service é mockado
// ----------------------------------------------------
const operationPlanServiceMock = {
  getAllOperationPlans: jest.fn(),
  getOperationPlanById: jest.fn(),
  getOperationPlansByVvn: jest.fn(),
  getOperationPlansByTargetDay: jest.fn(),
  getOperationPlansByAuthor: jest.fn(),
  getOperationPlansByAlgorithm: jest.fn(),
  searchOperationPlans: jest.fn(),
  create: jest.fn(),
  createBatch: jest.fn(),
  update: jest.fn(),
  getVvnsWithoutOperationPlan: jest.fn(),
  regenerateOperationPlansForDay: jest.fn(),
};

// ----------------------------------------------------
// Helper para criar app de teste
// ----------------------------------------------------
function createTestApp() {
  const app = express();
  app.use(bodyParser.json());

  Container.reset();

  // Logger mock
  Container.set("logger", { 
    error: jest.fn(), 
    info: jest.fn(),
    silly: jest.fn()
  });

  // SERVICE MOCK (apenas o service é mockado)
  Container.set(
    config.services.operationPlan.name,
    operationPlanServiceMock
  );

  // CONTROLLER REAL (instância real do controller)
  const controllerInstance = new OperationPlanController(
    operationPlanServiceMock,
    Container.get("logger")
  );
  Container.set(
    config.controllers.operationPlan.name,
    controllerInstance
  );

  // Carregar routes reais
  operationPlanRoutes(app);

  // Error handler do Celebrate (IMPORTANTE para validação)
  app.use(celebrateErrors());

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  return app;
}

// ----------------------------------------------------
// TESTES
// ----------------------------------------------------

describe("OperationPlan Routes - Missing Plans Tests (Application Tests)", () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });

  // =========================================
  // GET /operation-plans/missing
  // =========================================
  describe("GET /operation-plans/missing", () => {
    it("should return 200 and list of VVNs without operation plans", async () => {
      // Arrange
      const mockVvns = [
        { 
          code: "2026-PA-000001", 
          vessel: { vesselName: "Vessel A" }, 
          eta: "2026-01-15T10:00:00Z",
          estimatedCargoOperations: 10
        },
        { 
          code: "2026-PA-000002", 
          vessel: { vesselName: "Vessel B" }, 
          eta: "2026-01-15T14:00:00Z",
          estimatedCargoOperations: 15
        }
      ];

      operationPlanServiceMock.getVvnsWithoutOperationPlan.mockResolvedValue({
        isSuccess: true,
        getValue: () => mockVvns
      });

      // Act
      const res = await request(app)
        .get("/operation-plans/missing")
        .expect(200);

      // Assert
      expect(res.body).toEqual(mockVvns);
      expect(operationPlanServiceMock.getVvnsWithoutOperationPlan).toHaveBeenCalledTimes(1);
    });

    it("should return 200 with empty array when all VVNs have plans", async () => {
      // Arrange
      operationPlanServiceMock.getVvnsWithoutOperationPlan.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      // Act
      const res = await request(app)
        .get("/operation-plans/missing")
        .expect(200);

      // Assert
      expect(res.body).toEqual([]);
    });

    it("should return 500 when service fails", async () => {
      // Arrange
      operationPlanServiceMock.getVvnsWithoutOperationPlan.mockResolvedValue({
        isSuccess: false,
        isFailure: true,
        error: "Service Error",
        errorValue: () => "Service Error"
      });

      // Act
      const res = await request(app)
        .get("/operation-plans/missing")
        .expect(500);

      // Assert
      expect(res.body).toHaveProperty("error", "Service Error");
    });

    it("should pass authorization header to service", async () => {
      // Arrange
      const authToken = "Bearer test-token";
      operationPlanServiceMock.getVvnsWithoutOperationPlan.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      // Act
      await request(app)
        .get("/operation-plans/missing")
        .set("Authorization", authToken)
        .expect(200);

      // Assert
      expect(operationPlanServiceMock.getVvnsWithoutOperationPlan).toHaveBeenCalledWith(authToken);
    });
  });

  // =========================================
  // GET /operation-plans
  // =========================================
  describe("GET /operation-plans", () => {
    it("should return 200 with list of plans", async () => {
      operationPlanServiceMock.getAllOperationPlans.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ id: "1", vvn: "VVN-1" }]
      });

      const res = await request(app)
        .get("/operation-plans")
        .expect(200);

      expect(res.body).toEqual([{ id: "1", vvn: "VVN-1" }]);
      expect(operationPlanServiceMock.getAllOperationPlans).toHaveBeenCalledTimes(1);
    });

    it("should return 500 when service fails", async () => {
      operationPlanServiceMock.getAllOperationPlans.mockResolvedValue({
        isSuccess: false,
        error: "Service error"
      });

      const res = await request(app)
        .get("/operation-plans")
        .expect(500);

      expect(res.body).toHaveProperty("error", "Service error");
    });
  });

  // =========================================
  // GET /operation-plans/id/:id
  // =========================================
  describe("GET /operation-plans/id/:id", () => {
    it("should return 200 when found", async () => {
      operationPlanServiceMock.getOperationPlanById.mockResolvedValue({
        isSuccess: true,
        getValue: () => ({ id: "123", vvn: "VVN-1" })
      });

      const res = await request(app)
        .get("/operation-plans/id/123")
        .expect(200);

      expect(res.body.id).toBe("123");
    });

    it("should return 404 when not found", async () => {
      operationPlanServiceMock.getOperationPlanById.mockResolvedValue({
        isSuccess: false,
        error: "not found"
      });

      const res = await request(app)
        .get("/operation-plans/id/NOPE")
        .expect(404);

      expect(res.body).toHaveProperty("error", "not found");
    });
  });

  // =========================================
  // GET /operation-plans/vvn/:vvn
  // =========================================
  describe("GET /operation-plans/vvn/:vvn", () => {
    it("should return 200 when found", async () => {
      operationPlanServiceMock.getOperationPlansByVvn.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ vvn: "VVN-1" }]
      });

      const res = await request(app)
        .get("/operation-plans/vvn/VVN-1")
        .expect(200);

      expect(res.body[0].vvn).toBe("VVN-1");
    });

    it("should return 404 when not found", async () => {
      operationPlanServiceMock.getOperationPlansByVvn.mockResolvedValue({
        isSuccess: false,
        error: "not found"
      });

      const res = await request(app)
        .get("/operation-plans/vvn/NOPE")
        .expect(404);

      expect(res.body).toHaveProperty("error", "not found");
    });
  });

  // =========================================
  // GET /operation-plans/target-day/:targetDay
  // =========================================
  describe("GET /operation-plans/target-day/:targetDay", () => {
    it("should return 200 when found", async () => {
      operationPlanServiceMock.getOperationPlansByTargetDay.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ vvn: "VVN-1" }]
      });

      const res = await request(app)
        .get("/operation-plans/target-day/2026-01-01")
        .expect(200);

      expect(res.body).toHaveLength(1);
    });

    it("should return 404 when not found", async () => {
      operationPlanServiceMock.getOperationPlansByTargetDay.mockResolvedValue({
        isSuccess: false,
        error: "not found"
      });

      const res = await request(app)
        .get("/operation-plans/target-day/2026-01-01")
        .expect(404);

      expect(res.body).toHaveProperty("error", "not found");
    });
  });

  // =========================================
  // GET /operation-plans/author/:author
  // =========================================
  describe("GET /operation-plans/author/:author", () => {
    it("should return 200 when found", async () => {
      operationPlanServiceMock.getOperationPlansByAuthor.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ author: "alice" }]
      });

      const res = await request(app)
        .get("/operation-plans/author/alice")
        .expect(200);

      expect(res.body[0].author).toBe("alice");
    });

    it("should return 404 when not found", async () => {
      operationPlanServiceMock.getOperationPlansByAuthor.mockResolvedValue({
        isSuccess: false,
        error: "not found"
      });

      const res = await request(app)
        .get("/operation-plans/author/missing")
        .expect(404);

      expect(res.body).toHaveProperty("error", "not found");
    });
  });

  // =========================================
  // GET /operation-plans/algorithm/:algorithm
  // =========================================
  describe("GET /operation-plans/algorithm/:algorithm", () => {
    it("should return 200 when found", async () => {
      operationPlanServiceMock.getOperationPlansByAlgorithm.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ algorithm: "genetic" }]
      });

      const res = await request(app)
        .get("/operation-plans/algorithm/genetic")
        .expect(200);

      expect(res.body[0].algorithm).toBe("genetic");
    });

    it("should return 404 when not found", async () => {
      operationPlanServiceMock.getOperationPlansByAlgorithm.mockResolvedValue({
        isSuccess: false,
        error: "not found"
      });

      const res = await request(app)
        .get("/operation-plans/algorithm/missing")
        .expect(404);

      expect(res.body).toHaveProperty("error", "not found");
    });
  });

  // =========================================
  // GET /operation-plans/search
  // =========================================
  describe("GET /operation-plans/search", () => {
    it("should return 200 with filtered plans", async () => {
      operationPlanServiceMock.searchOperationPlans.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ vvn: "VVN-SEARCH" }]
      });

      const res = await request(app)
        .get("/operation-plans/search?startDate=2026-01-01&endDate=2026-01-02&vvn=VVN-SEARCH")
        .expect(200);

      expect(operationPlanServiceMock.searchOperationPlans).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date),
        "VVN-SEARCH"
      );
      expect(res.body[0].vvn).toBe("VVN-SEARCH");
    });

    it("should return 500 when service fails", async () => {
      operationPlanServiceMock.searchOperationPlans.mockResolvedValue({
        isSuccess: false,
        error: "search error"
      });

      const res = await request(app)
        .get("/operation-plans/search")
        .expect(500);

      expect(res.body).toHaveProperty("error", "search error");
    });
  });

  // =========================================
  // POST /operation-plans (create batch)
  // =========================================
  describe("POST /operation-plans", () => {
    it("should create batch and return 201", async () => {
      const payload = {
        vvns: ["VVN-1"],
        assignedCranes: [["CR1"]],
        arrivalTimes: ["2026-01-01T08:00:00Z"],
        departureTimes: ["2026-01-01T10:00:00Z"],
        targetDays: ["2026-01-01"],
        author: "alice",
        algorithm: "genetic"
      };

      operationPlanServiceMock.createBatch.mockResolvedValue({
        isSuccess: true,
        getValue: () => ([{ vvn: "VVN-1" }])
      });

      const res = await request(app)
        .post("/operation-plans")
        .set("Authorization", "Bearer token")
        .send(payload)
        .expect(201);

      expect(res.body[0].vvn).toBe("VVN-1");
      expect(operationPlanServiceMock.createBatch).toHaveBeenCalledWith(
        payload.vvns,
        payload.assignedCranes,
        payload.arrivalTimes,
        payload.departureTimes,
        payload.targetDays,
        payload.author,
        payload.algorithm,
        "Bearer token"
      );
    });

    it("should return 400 when service fails", async () => {
      operationPlanServiceMock.createBatch.mockResolvedValue({
        isSuccess: false,
        error: "fail"
      });

      const res = await request(app)
        .post("/operation-plans")
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty("error", "fail");
    });
  });

  // =========================================
  // PUT /operation-plans/update/:vvn
  // =========================================
  describe("PUT /operation-plans/update/:vvn", () => {
    const payload = {
      id: "1",
      vvn: "VVN-1",
      targetDay: "2026-01-01",
      arrivalTime: "2026-01-01T08:00:00Z",
      departureTime: "2026-01-01T10:00:00Z",
      operations: [
        {
          id: "OP1",
          operationType: "LOAD",
          container: "C1",
          operationStart: "2026-01-01T08:00:00Z",
          operationEnd: "2026-01-01T09:00:00Z",
          craneUsed: "CR1"
        }
      ],
      author: "alice",
      algorithm: "genetic",
      createdAt: "2026-01-01T07:00:00Z",
      changeReason: "Adjust"
    };

    it("should update and return 200", async () => {
      operationPlanServiceMock.update.mockResolvedValue({
        isSuccess: true,
        getValue: () => ({ vvn: "VVN-1" })
      });

      const res = await request(app)
        .put("/operation-plans/update/VVN-1")
        .send(payload)
        .expect(200);

      expect(res.body.vvn).toBe("VVN-1");
      expect(operationPlanServiceMock.update).toHaveBeenCalledWith("VVN-1", expect.objectContaining({ changeReason: "Adjust" }));
    });

    it("should return 400 when service fails", async () => {
      operationPlanServiceMock.update.mockResolvedValue({
        isSuccess: false,
        error: "update error"
      });

      const res = await request(app)
        .put("/operation-plans/update/VVN-1")
        .send(payload)
        .expect(400);

      expect(res.body).toHaveProperty("error", "update error");
    });
  });

  // =========================================
  // POST /operation-plans/regenerate
  // =========================================
  describe("POST /operation-plans/regenerate", () => {
    it("should return 200 and regenerate plans successfully", async () => {
      // Arrange
      const payload = {
        targetDay: "2026-01-15",
        author: "logistics-operator-1",
        algorithm: "genetic"
      };

      const mockRegeneratedPlans = [
        { id: "plan-1", vvn: "2026-PA-000001", algorithm: "genetic" },
        { id: "plan-2", vvn: "2026-PA-000002", algorithm: "genetic" }
      ];

      operationPlanServiceMock.regenerateOperationPlansForDay.mockResolvedValue({
        isSuccess: true,
        getValue: () => mockRegeneratedPlans
      });

      // Act
      const res = await request(app)
        .post("/operation-plans/regenerate")
        .send(payload)
        .expect(200);

      // Assert
      expect(res.body).toHaveProperty("message", "Successfully regenerated 2 operation plans");
      expect(res.body).toHaveProperty("plans", mockRegeneratedPlans);
      expect(operationPlanServiceMock.regenerateOperationPlansForDay).toHaveBeenCalledWith(
        expect.any(Date),
        payload.author,
        payload.algorithm,
        undefined
      );
    });

    it("should return 400 when targetDay is missing", async () => {
      // Arrange
      const payload = {
        author: "user-123",
        algorithm: "default"
      };

      // Act
      const res = await request(app)
        .post("/operation-plans/regenerate")
        .send(payload)
        .expect(400);

      // Assert - Celebrate/Joi validation returns "Bad Request"
      expect(res.body).toHaveProperty("error", "Bad Request");
      expect(operationPlanServiceMock.regenerateOperationPlansForDay).not.toHaveBeenCalled();
    });

    it("should return 400 when author is missing", async () => {
      // Arrange
      const payload = {
        targetDay: "2026-01-15",
        algorithm: "improved"
      };

      // Act
      const res = await request(app)
        .post("/operation-plans/regenerate")
        .send(payload)
        .expect(400);

      // Assert - Celebrate/Joi validation returns "Bad Request"
      expect(res.body).toHaveProperty("error", "Bad Request");
    });

    it("should return 400 when algorithm is missing", async () => {
      // Arrange
      const payload = {
        targetDay: "2026-01-15",
        author: "user-123"
      };

      // Act
      const res = await request(app)
        .post("/operation-plans/regenerate")
        .send(payload)
        .expect(400);

      // Assert - Celebrate/Joi validation returns "Bad Request"
      expect(res.body).toHaveProperty("error", "Bad Request");
    });

    it("should return 500 when service fails", async () => {
      // Arrange
      const payload = {
        targetDay: "2026-01-15",
        author: "user-123",
        algorithm: "automatic"
      };

      operationPlanServiceMock.regenerateOperationPlansForDay.mockResolvedValue({
        isSuccess: false,
        isFailure: true,
        error: "Failed to regenerate plans",
        errorValue: () => "Failed to regenerate plans"
      });

      // Act
      const res = await request(app)
        .post("/operation-plans/regenerate")
        .send(payload)
        .expect(500);

      // Assert
      expect(res.body).toHaveProperty("error", "Failed to regenerate plans");
    });

    it("should parse targetDay as Date correctly", async () => {
      // Arrange
      const payload = {
        targetDay: "2026-01-15T10:00:00.000Z",
        author: "user-123",
        algorithm: "default"
      };

      operationPlanServiceMock.regenerateOperationPlansForDay.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      // Act
      await request(app)
        .post("/operation-plans/regenerate")
        .send(payload)
        .expect(200);

      // Assert
      const callArgs = operationPlanServiceMock.regenerateOperationPlansForDay.mock.calls[0];
      expect(callArgs[0]).toBeInstanceOf(Date);
      expect(callArgs[0].toISOString()).toBe("2026-01-15T10:00:00.000Z");
    });

    it("should pass authorization header to service", async () => {
      // Arrange
      const payload = {
        targetDay: "2026-01-15",
        author: "user-123",
        algorithm: "genetic"
      };
      const authToken = "Bearer test-token";

      operationPlanServiceMock.regenerateOperationPlansForDay.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      // Act
      await request(app)
        .post("/operation-plans/regenerate")
        .set("Authorization", authToken)
        .send(payload)
        .expect(200);

      // Assert
      const callArgs = operationPlanServiceMock.regenerateOperationPlansForDay.mock.calls[0];
      expect(callArgs[3]).toBe(authToken);
    });

    it("should handle different algorithm values", async () => {
      // Arrange
      const algorithms = ["automatic", "default", "improved", "genetic"];
      
      operationPlanServiceMock.regenerateOperationPlansForDay.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      // Act & Assert
      for (const algorithm of algorithms) {
        const payload = {
          targetDay: "2026-01-15",
          author: "user-123",
          algorithm: algorithm
        };

        await request(app)
          .post("/operation-plans/regenerate")
          .send(payload)
          .expect(200);

        expect(operationPlanServiceMock.regenerateOperationPlansForDay).toHaveBeenCalledWith(
          expect.any(Date),
          "user-123",
          algorithm,
          undefined
        );
      }
    });

    it("should return success message with count", async () => {
      // Arrange
      const payload = {
        targetDay: "2026-01-15",
        author: "user-123",
        algorithm: "improved"
      };

      const mockPlans = [
        { id: "1" },
        { id: "2" },
        { id: "3" }
      ];

      operationPlanServiceMock.regenerateOperationPlansForDay.mockResolvedValue({
        isSuccess: true,
        getValue: () => mockPlans
      });

      // Act
      const res = await request(app)
        .post("/operation-plans/regenerate")
        .send(payload)
        .expect(200);

      // Assert
      expect(res.body.message).toBe("Successfully regenerated 3 operation plans");
      expect(res.body.plans).toHaveLength(3);
    });
  });
});
