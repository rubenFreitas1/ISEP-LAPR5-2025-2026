# US 4.1.8

## 1. Context

*This user story addresses the need to accurately deefining the vessel's arrival time and its dock by allowing Logistics Operators to update a pending Vessel Visit Execution (VVE). Building on previously created executions (US4.1.7), the system enables operators to edit the actual berth date and its assigned dock.*

## 2. Requirements

**US 4.1.8** As a Logistics Operator, I want to update an in progress VVE with the
actual berth time and dock used, so that discrepancies from the planned
dock assignment are recorded.

**Acceptance Criteria:**

-  The REST API must support update of berth time and dock ID.

- If the assigned dock differs from the planned one, a warning or note must be automatically
added.

- All updates must be timestamped and logged for auditability.


**Dependencies/References:**

*This user story depends on US4.1.7 because to be able to update Vessel Visit Executions, they already must be created.*


**Forum Insight:**

*No relevant observations were made.*

## 3. Analysis

Vessel Visit Execution Update

![System Sequence Diagram ](images/system-sequence-diagram-US4.1.8.png)

## 4. C4 Model


#### Components - Level 3

![Components](images/components_lvl3.png)

#### Code - Level 4

![Code](images/code_lvl4.png)


## 5. Tests

### Application (controller)
```ts

describe("VesselVisitExecution Routes (Application Tests)", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------
  // GET /vessel-visit-executions
  // -----------------------------
  describe("GET /vessel-visit-executions", () => {
    it("should return 200 with all vessel visit executions when no filters provided", async () => {
      vesselVisitExecutionServiceMock.getAllVesselVisitExecutions.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ code: "2025-PA-000001" }]
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ code: "2025-PA-000001" }]);
      expect(vesselVisitExecutionServiceMock.getAllVesselVisitExecutions).toHaveBeenCalled();
    });

    it("should return 200 with empty array when no executions exist", async () => {
      vesselVisitExecutionServiceMock.getAllVesselVisitExecutions.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 200 with multiple executions", async () => {
      vesselVisitExecutionServiceMock.getAllVesselVisitExecutions.mockResolvedValue({
        isSuccess: true,
        getValue: () => [
          { code: "2025-PA-000001", status: "InProgress" },
          { code: "2025-PA-000002", status: "Completed" },
          { code: "2025-PA-000003", status: "InProgress" }
        ]
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].code).toBe("2025-PA-000001");
    });

    it("should return 200 with filtered results when query params provided", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutions.mockResolvedValue({
        isSuccess: true,
        getValue: () => [{ code: "2025-PA-000001", vesselIMO: "IMO1234567" }]
      });

      const app = createTestApp();

      const res = await request(app)
        .get("/vessel-visit-executions")
        .query({ vesselIMO: "IMO1234567" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ code: "2025-PA-000001", vesselIMO: "IMO1234567" }]);
      expect(vesselVisitExecutionServiceMock.getVesselVisitExecutions).toHaveBeenCalledWith({
        from: undefined,
        to: undefined,
        vesselIMO: "IMO1234567",
        status: undefined
      });
    });

    it("should return 404 when filtered query returns no results", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutions.mockResolvedValue({
        isSuccess: false,
        error: "No vessel visit executions found"
      });

      const app = createTestApp();

      const res = await request(app)
        .get("/vessel-visit-executions")
        .query({ status: "Completed" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("No vessel visit executions found");
    });

    it("should call service with all query parameters", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutions.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      const app = createTestApp();

      await request(app)
        .get("/vessel-visit-executions")
        .query({
          from: "2025-01-01",
          to: "2025-12-31",
          vesselIMO: "IMO1234567",
          status: "InProgress"
        });

      expect(vesselVisitExecutionServiceMock.getVesselVisitExecutions).toHaveBeenCalledWith({
        from: "2025-01-01",
        to: "2025-12-31",
        vesselIMO: "IMO1234567",
        status: "InProgress"
      });
    });
  });

  // -----------------------------
  // GET /vessel-visit-executions/id/:id
  // -----------------------------
  describe("GET /vessel-visit-executions/id/:id", () => {
    it("should return 200 when vessel visit execution found by ID", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionById.mockResolvedValue({
        isSuccess: true,
        getValue: () => ({ 
          id: "123e4567-e89b-12d3-a456-426614174000",
          code: "2025-PA-000001"
        })
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/id/123e4567-e89b-12d3-a456-426614174000");

      expect(res.status).toBe(200);
      expect(res.body.id).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(res.body.code).toBe("2025-PA-000001");
    });

    it("should return 404 when vessel visit execution not found by ID", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionById.mockResolvedValue({
        isSuccess: false,
        error: "Vessel visit execution not found"
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/id/nonexistent-id");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Vessel visit execution not found");
    });

    it("should call service with correct ID parameter", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionById.mockResolvedValue({
        isSuccess: true,
        getValue: () => ({ id: "test-id" })
      });

      const app = createTestApp();

      await request(app).get("/vessel-visit-executions/id/test-id-123");

      expect(vesselVisitExecutionServiceMock.getVesselVisitExecutionById).toHaveBeenCalledWith("test-id-123");
    });
  });

  // -----------------------------
  // GET /vessel-visit-executions/code/:code
  // -----------------------------
  describe("GET /vessel-visit-executions/code/:code", () => {
    it("should return 200 when vessel visit execution found by code", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionByCode.mockResolvedValue({
        isSuccess: true,
        getValue: () => ({ 
          code: "2025-PA-000001",
          vesselVisitNotificationCode: "2025-PA-000005",
          status: "InProgress"
        })
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/code/2025-PA-000001");

      expect(res.status).toBe(200);
      expect(res.body.code).toBe("2025-PA-000001");
    });

    it("should return 404 when vessel visit execution not found by code", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionByCode.mockResolvedValue({
        isSuccess: false,
        error: "Vessel visit execution not found"
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/code/2025-PA-999999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Vessel visit execution not found");
    });

    it("should call service with correct code parameter", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionByCode.mockResolvedValue({
        isSuccess: true,
        getValue: () => ({ code: "2025-PA-000001" })
      });

      const app = createTestApp();

      await request(app).get("/vessel-visit-executions/code/2025-PA-000001");

      expect(vesselVisitExecutionServiceMock.getVesselVisitExecutionByCode).toHaveBeenCalledWith("2025-PA-000001");
    });
  });

  // -----------------------------
  // GET /vessel-visit-executions/status/:status
  // -----------------------------
  describe("GET /vessel-visit-executions/status/:status", () => {
    it("should return 200 with list of executions filtered by InProgress status", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionsByStatus.mockResolvedValue({
        isSuccess: true,
        getValue: () => [
          { code: "2025-PA-000001", status: "InProgress" },
          { code: "2025-PA-000002", status: "InProgress" }
        ]
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/status/InProgress");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].status).toBe("InProgress");
    });

    it("should return 200 with list of executions filtered by Completed status", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionsByStatus.mockResolvedValue({
        isSuccess: true,
        getValue: () => [
          { code: "2025-PA-000003", status: "Completed" }
        ]
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/status/Completed");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].status).toBe("Completed");
    });

    it("should return 404 when no executions found for status", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionsByStatus.mockResolvedValue({
        isSuccess: false,
        error: "No executions found for this status"
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/status/InProgress");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("No executions found for this status");
    });

    it("should call service with correct status parameter", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionsByStatus.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      const app = createTestApp();

      await request(app).get("/vessel-visit-executions/status/Completed");

      expect(vesselVisitExecutionServiceMock.getVesselVisitExecutionsByStatus).toHaveBeenCalledWith("Completed");
    });
  });

  // -----------------------------
  // GET /vessel-visit-executions/vessel-imo/:vesselIMO
  // -----------------------------
  describe("GET /vessel-visit-executions/vessel-imo/:vesselIMO", () => {
    it("should return 200 with list of executions for specific vessel IMO", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionsByVesselIMO.mockResolvedValue({
        isSuccess: true,
        getValue: () => [
          { code: "2025-PA-000001", vesselIMO: "IMO1234567" },
          { code: "2025-PA-000002", vesselIMO: "IMO1234567" }
        ]
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/vessel-imo/IMO1234567");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].vesselIMO).toBe("IMO1234567");
    });

    it("should return 404 when no executions found for vessel IMO", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionsByVesselIMO.mockResolvedValue({
        isSuccess: false,
        error: "No executions found for this vessel"
      });

      const app = createTestApp();

      const res = await request(app).get("/vessel-visit-executions/vessel-imo/IMO9999999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("No executions found for this vessel");
    });

    it("should call service with correct vessel IMO parameter", async () => {
      vesselVisitExecutionServiceMock.getVesselVisitExecutionsByVesselIMO.mockResolvedValue({
        isSuccess: true,
        getValue: () => []
      });

      const app = createTestApp();

      await request(app).get("/vessel-visit-executions/vessel-imo/IMO1234567");

      expect(vesselVisitExecutionServiceMock.getVesselVisitExecutionsByVesselIMO).toHaveBeenCalledWith("IMO1234567");
    });
  });

````