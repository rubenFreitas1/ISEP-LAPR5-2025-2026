import OperationPlanService from "../../src/services/OperationPlanService";
import { OperationPlan } from "../../src/domain/OperationPlan";
import { OperationEntry } from "../../src/domain/OperationEntry";
import { OperationPlanDTO } from "../../src/dto/OperationPlanDTO";

// -----------------------------------------
// Fake Repository (Aggregated test style)
// -----------------------------------------
class OperationPlanRepoFake {
	public data: OperationPlan[] = [];

	async findAll() {
		return this.data;
	}

	async findById(id: string) {
		return this.data.find(x => x.id === id) ?? null;
	}

	async findByVvn(vvn: string) {
		return this.data.find(x => x.vvn === vvn) ?? null;
	}

	async findByTargetDay(targetDay: Date) {
		return this.data.find(x => x.TargetDay.getTime() === new Date(targetDay).getTime()) ?? null;
	}

	async findByArrivalTime(arrivalTime: Date) {
		return this.data.filter(x => x.arrivalTime.getTime() === new Date(arrivalTime).getTime());
	}

	async findByDepartureTime(departureTime: Date) {
		return this.data.filter(x => x.departureTime.getTime() === new Date(departureTime).getTime());
	}

	async findByAuthor(author: string) {
		return this.data.filter(x => x.author === author);
	}

	async findByAlgorithm(algorithm: string) {
		return this.data.filter(x => x.algorithm === algorithm);
	}

	async findByDateRange(startDate: Date, endDate: Date, vvn?: string) {
		return this.data.filter(x => {
			const inRange = x.TargetDay >= startDate && x.TargetDay <= endDate;
			const matchesVvn = vvn ? x.vvn === vvn : true;
			return inRange && matchesVvn;
		});
	}

	async save(domain: OperationPlan) {
		this.data.push(domain);
		return domain;
	}

	async update(domain: OperationPlan) {
		const idx = this.data.findIndex(x => x.id === domain.id);
		if (idx === -1) return false;
		this.data[idx] = domain;
		return true;
	}
}

// Logger Fake
const loggerFake = {
	error: jest.fn(),
	info: jest.fn(),
};

// Helpers
const makeOperationEntryDTO = (id: string, start: string, end: string) => ({
	id,
	operationType: "LOAD",
	container: "C1",
	operationStart: new Date(start),
	operationEnd: new Date(end),
	craneUsed: "CR1",
});

const makeDomainPlan = (id: string, vvn: string, targetDay: string) => {
	const arrival = new Date("2025-01-01T08:00:00Z");
	const departure = new Date("2025-01-01T12:00:00Z");
	const ops = [new OperationEntry("OP1", "LOAD", "C1", arrival, new Date("2025-01-01T09:00:00Z"), "CR1")];
	return new OperationPlan(id, vvn, new Date(targetDay), arrival, departure, ops, "alice", "GEN", new Date());
};

describe("OperationPlanService – Aggregate Tests", () => {
	let repo: OperationPlanRepoFake;
	let service: OperationPlanService;

	beforeEach(() => {
		repo = new OperationPlanRepoFake();
		service = new OperationPlanService(repo as any, loggerFake);
	});

	// ---------------------------------------------
	// CREATE – robust tests
	// ---------------------------------------------
	it("should create a new OperationPlan", async () => {
		const dto: OperationPlanDTO = {
			id: "",
			vvn: "VVN-1",
			targetDay: new Date("2025-01-10"),
			arrivalTime: new Date("2025-01-10T06:00:00Z"),
			departureTime: new Date("2025-01-10T12:00:00Z"),
			operations: [
				makeOperationEntryDTO("OP1", "2025-01-10T06:00:00Z", "2025-01-10T07:00:00Z"),
				makeOperationEntryDTO("OP2", "2025-01-10T07:05:00Z", "2025-01-10T08:00:00Z"),
			],
			author: "alice",
			algorithm: "GEN",
			createdAt: new Date(),
		};

		const result = await service.create(dto as any);

		expect(result.isSuccess).toBe(true);
		const saved = await repo.findByVvn("VVN-1");
		expect(saved).not.toBeNull();
		expect(saved?.vvn).toBe("VVN-1");
	});

	it("should fail to create if VVN already exists", async () => {
		await repo.save(makeDomainPlan("1", "VVN-1", "2025-01-10"));

		const dto: OperationPlanDTO = {
			id: "",
			vvn: "VVN-1",
			targetDay: new Date("2025-01-11"),
			arrivalTime: new Date("2025-01-11T06:00:00Z"),
			departureTime: new Date("2025-01-11T12:00:00Z"),
			operations: [makeOperationEntryDTO("OP1", "2025-01-11T06:00:00Z", "2025-01-11T07:00:00Z")],
			author: "alice",
			algorithm: "GEN",
			createdAt: new Date(),
		};

		const result = await service.create(dto as any);

		expect(result.isFailure).toBe(true);
		expect(result.errorValue()).toContain("already exists");
	});

	it("should fail to create if target day conflicts", async () => {
		await repo.save(makeDomainPlan("1", "VVN-OLD", "2025-01-10"));

		const dto: OperationPlanDTO = {
			id: "",
			vvn: "VVN-NEW",
			targetDay: new Date("2025-01-10"),
			arrivalTime: new Date("2025-01-10T06:00:00Z"),
			departureTime: new Date("2025-01-10T12:00:00Z"),
			operations: [makeOperationEntryDTO("OP1", "2025-01-10T06:00:00Z", "2025-01-10T07:00:00Z")],
			author: "alice",
			algorithm: "GEN",
			createdAt: new Date(),
		};

		const result = await service.create(dto as any);

		expect(result.isFailure).toBe(true);
		expect(result.errorValue()).toContain("same target day");
	});

	// ---------------------------------------------
	// UPDATE – validations and happy path
	// ---------------------------------------------
	it("should update operation plan and append change log", async () => {
		const existing = makeDomainPlan("1", "VVN-1", "2025-01-10");
		await repo.save(existing);

		const dto: OperationPlanDTO = {
			id: "1",
			vvn: "VVN-1",
			targetDay: new Date("2025-01-11"),
			arrivalTime: new Date("2025-01-11T06:00:00Z"),
			departureTime: new Date("2025-01-11T12:00:00Z"),
			operations: [
				makeOperationEntryDTO("OP1", "2025-01-11T06:00:00Z", "2025-01-11T07:00:00Z"),
				makeOperationEntryDTO("OP2", "2025-01-11T07:10:00Z", "2025-01-11T08:00:00Z"),
			],
			author: "bob",
			algorithm: "GEN2",
			createdAt: existing.createdAt,
			changeReason: "Adjust schedule",
		};

		const result = await service.update("VVN-1", dto as any);

		expect(result.isSuccess).toBe(true);
		const updated = await repo.findByVvn("VVN-1");
		expect(updated?.TargetDay.getTime()).toBe(new Date("2025-01-11").getTime());
		expect(updated?.changeLog.length).toBe(1);
		expect(updated?.changeLog[0].reason).toBe("Adjust schedule");
	});

	it("should fail update when change reason is missing", async () => {
		await repo.save(makeDomainPlan("1", "VVN-1", "2025-01-10"));

		const dto: OperationPlanDTO = {
			id: "1",
			vvn: "VVN-1",
			targetDay: new Date("2025-01-10"),
			arrivalTime: new Date("2025-01-10T06:00:00Z"),
			departureTime: new Date("2025-01-10T12:00:00Z"),
			operations: [makeOperationEntryDTO("OP1", "2025-01-10T06:00:00Z", "2025-01-10T07:00:00Z")],
			author: "alice",
			algorithm: "GEN",
			createdAt: new Date(),
			changeReason: "",
		};

		const result = await service.update("VVN-1", dto as any);

		expect(result.isFailure).toBe(true);
		expect(result.errorValue()).toContain("Change reason is required");
	});

	it("should fail when last operation ends after departure", async () => {
		await repo.save(makeDomainPlan("1", "VVN-1", "2025-01-10"));

		const dto: OperationPlanDTO = {
			id: "1",
			vvn: "VVN-1",
			targetDay: new Date("2025-01-10"),
			arrivalTime: new Date("2025-01-10T06:00:00Z"),
			departureTime: new Date("2025-01-10T08:00:00Z"),
			operations: [
				makeOperationEntryDTO("OP1", "2025-01-10T06:00:00Z", "2025-01-10T07:00:00Z"),
				makeOperationEntryDTO("OP2", "2025-01-10T07:10:00Z", "2025-01-10T09:00:00Z"), // ends after departure
			],
			author: "alice",
			algorithm: "GEN",
			createdAt: new Date(),
			changeReason: "Delay",
		};

		const result = await service.update("VVN-1", dto as any);

		expect(result.isFailure).toBe(true);
		expect(result.errorValue()).toContain("last operation cannot end after the departure time");
	});

	it("should fail when an operation has start >= end", async () => {
		await repo.save(makeDomainPlan("1", "VVN-1", "2025-01-10"));

		const dto: OperationPlanDTO = {
			id: "1",
			vvn: "VVN-1",
			targetDay: new Date("2025-01-10"),
			arrivalTime: new Date("2025-01-10T06:00:00Z"),
			departureTime: new Date("2025-01-10T08:00:00Z"),
			operations: [makeOperationEntryDTO("OP1", "2025-01-10T07:00:00Z", "2025-01-10T07:00:00Z")],
			author: "alice",
			algorithm: "GEN",
			createdAt: new Date(),
			changeReason: "Invalid op",
		};

		const result = await service.update("VVN-1", dto as any);

		expect(result.isFailure).toBe(true);
		expect(result.errorValue()).toContain("Start time must be before end time");
	});
});
