import { OperationPlan } from "../../../src/domain/OperationPlan";
import { OperationEntry } from "../../../src/domain/OperationEntry";

describe("OperationPlan (unit tests)", () => {
	const baseOperation = new OperationEntry(
		"op-1",
		"LOAD",
		"CONT-1",
		new Date("2026-01-01T08:00:00Z"),
		new Date("2026-01-01T09:00:00Z"),
		"CRANE-1"
	);

	const validData = {
		id: "plan-1",
		vvn: "VVN-001",
		targetDay: new Date("2026-01-01"),
		arrivalTime: new Date("2026-01-01T07:00:00Z"),
		departureTime: new Date("2026-01-01T19:00:00Z"),
		operations: [baseOperation],
		author: "tester",
		algorithm: "genetic",
		createdAt: new Date("2026-01-01T06:00:00Z"),
	};

	// ------------------------------------------------------------
	// Constructor validation
	// ------------------------------------------------------------

	it("should create an OperationPlan with valid data", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		expect(plan.id).toBe("plan-1");
		expect(plan.vvn).toBe("VVN-001");
		expect(plan.TargetDay).toEqual(validData.targetDay);
		expect(plan.arrivalTime).toEqual(validData.arrivalTime);
		expect(plan.departureTime).toEqual(validData.departureTime);
		expect(plan.operations).toHaveLength(1);
		expect(plan.author).toBe("tester");
		expect(plan.algorithm).toBe("genetic");
		expect(plan.createdAt).toEqual(validData.createdAt);
		expect(plan.changeLog).toEqual([]);
	});

	it("should throw error if VVN is empty", () => {
		expect(() =>
			new OperationPlan(
				validData.id,
				"",
				validData.targetDay,
				validData.arrivalTime,
				validData.departureTime,
				validData.operations,
				validData.author,
				validData.algorithm,
				validData.createdAt
			)
		).toThrow("Vessel Visit Notification cannot be null or empty.");
	});

	it("should throw error if author is empty", () => {
		expect(() =>
			new OperationPlan(
				validData.id,
				validData.vvn,
				validData.targetDay,
				validData.arrivalTime,
				validData.departureTime,
				validData.operations,
				"",
				validData.algorithm,
				validData.createdAt
			)
		).toThrow("Author cannot be null or empty.");
	});

	it("should throw error if algorithm is empty", () => {
		expect(() =>
			new OperationPlan(
				validData.id,
				validData.vvn,
				validData.targetDay,
				validData.arrivalTime,
				validData.departureTime,
				validData.operations,
				validData.author,
				"",
				validData.createdAt
			)
		).toThrow("Algorithm cannot be null or empty.");
	});

	// ------------------------------------------------------------
	// Update methods
	// ------------------------------------------------------------

	it("should update VVN with valid value", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		plan.updateVvn("VVN-002");
		expect(plan.vvn).toBe("VVN-002");
	});

	it("should throw error when updating VVN with empty value", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		expect(() => plan.updateVvn("")).toThrow(
			"Vessel Visit Notification cannot be null or empty."
		);
	});

	it("should update author with valid value", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		plan.updateAuthor("new-author");
		expect(plan.author).toBe("new-author");
	});

	it("should throw error when updating author with empty value", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		expect(() => plan.updateAuthor("")).toThrow(
			"Author cannot be null or empty."
		);
	});

	it("should update algorithm with valid value", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		plan.updateAlgorithm("improved");
		expect(plan.algorithm).toBe("improved");
	});

	it("should throw error when updating algorithm with empty value", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		expect(() => plan.updateAlgorithm("")).toThrow(
			"Algorithm cannot be null or empty."
		);
	});

	it("should update target day, arrival and departure times", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		const newTargetDay = new Date("2026-02-01");
		const newArrival = new Date("2026-02-01T08:00:00Z");
		const newDeparture = new Date("2026-02-01T20:00:00Z");

		plan.updateTargetDay(newTargetDay);
		plan.updateArrivalTime(newArrival);
		plan.updateDepartureTime(newDeparture);

		expect(plan.TargetDay).toEqual(newTargetDay);
		expect(plan.arrivalTime).toEqual(newArrival);
		expect(plan.departureTime).toEqual(newDeparture);
	});

	it("should update operations list", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		const newOperation = new OperationEntry(
			"op-2",
			"UNLOAD",
			"CONT-2",
			new Date("2026-02-01T10:00:00Z"),
			new Date("2026-02-01T11:00:00Z"),
			"CRANE-2"
		);

		plan.updateOperations([newOperation]);
		expect(plan.operations).toHaveLength(1);
		expect(plan.operations[0].id).toBe("op-2");
	});

	// ------------------------------------------------------------
	// Change log
	// ------------------------------------------------------------

	it("should add change log entry with metadata", () => {
		const plan = new OperationPlan(
			validData.id,
			validData.vvn,
			validData.targetDay,
			validData.arrivalTime,
			validData.departureTime,
			validData.operations,
			validData.author,
			validData.algorithm,
			validData.createdAt
		);

		plan.addChangeLogEntry("auditor", "Adjust schedule", "Changed crane order");

		expect(plan.changeLog).toHaveLength(1);
		expect(plan.changeLog[0]).toMatchObject({
			author: "auditor",
			reason: "Adjust schedule",
			changes: "Changed crane order",
		});
		expect(plan.changeLog[0].date).toBeInstanceOf(Date);
	});
});
