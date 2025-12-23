import { Service, Inject } from "typedi";
import IOperationPlanRepo from "./IRepos/IOperationPlanRepo";
import { OperationPlan } from "../domain/OperationPlan";
import IOperationPlanService from "./IServices/IOperationPlanService";

import { Result } from "../core/logic/Result";
import { OperationPlanDTO } from "../dto/OperationPlanDTO";
import { AuthMechanism } from "mongodb";
import { OperationPlanMap } from "../mappers/OperationPlanMap";
import { VesselVisitNotificationDTO } from "./clients/VesselVisitNotificationClient";


@Service()
export default class OperationPlanService implements IOperationPlanService {
    constructor(
        @Inject("operationPlanRepo") private operationPlanRepo: IOperationPlanRepo,
        @Inject("logger") private logger: any
    ){}

    public async getAllOperationPlans(): Promise<Result<OperationPlanDTO[]>> {
        try {
            const operationPlans = await this.operationPlanRepo.findAll();
            const operationPlanDTOs = operationPlans.map(op => ({
                id: op.id,
                vvn: op.vvn,
                targetDay: op.TargetDay,
                arrivalTime: op.arrivalTime,
                departureTime: op.departureTime,
                operations: op.operations,
                author: op.author,
                algorithm: op.algorithm,
                createdAt: op.createdAt
            }));
            return Result.ok(operationPlanDTOs);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plans.");
        }
  
    }

    public async getOperationPlanById(id: string): Promise<Result<OperationPlanDTO>> {
        try {
            const operationPlan = await this.operationPlanRepo.findById(id);
            if (!operationPlan) {
                return Result.fail("Operation plan not found.");
            }
            const operationPlanDTO: OperationPlanDTO = {
                id: operationPlan.id,
                vvn: operationPlan.vvn,
                targetDay: operationPlan.TargetDay,
                arrivalTime: operationPlan.arrivalTime,
                departureTime: operationPlan.departureTime,
                operations: operationPlan.operations,
                author: operationPlan.author,
                algorithm: operationPlan.algorithm,
                createdAt: operationPlan.createdAt
            };
            return Result.ok(operationPlanDTO);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plan.");
        }
    }


    public async getOperationPlansByVvn(vvn: string): Promise<Result<OperationPlanDTO[]>> {
        try {
            const operationPlan = await this.operationPlanRepo.findByVvn(vvn);
            if (!operationPlan) {
                return Result.ok([]);
            }
            const operationPlanDTOs = Array.isArray(operationPlan) 
                ? operationPlan.map(op => ({
                    id: op.id,
                    vvn: op.vvn,
                    targetDay: op.TargetDay,
                    arrivalTime: op.arrivalTime,
                    departureTime: op.departureTime,
                    operations: op.operations,
                    author: op.author,
                    algorithm: op.algorithm,
                    createdAt: op.createdAt
                }))
                : [{
                    id: operationPlan.id,
                    vvn: operationPlan.vvn,
                    targetDay: operationPlan.TargetDay,
                    arrivalTime: operationPlan.arrivalTime,
                    departureTime: operationPlan.departureTime,
                    operations: operationPlan.operations,
                    author: operationPlan.author,
                    algorithm: operationPlan.algorithm,
                    createdAt: operationPlan.createdAt
                }];
            return Result.ok(operationPlanDTOs);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plans by VVN.");
        }

    }

    public async getOperationPlansByTargetDay(targetDay: Date): Promise<Result<OperationPlanDTO[]>> {
        try {
            const operationPlans = await this.operationPlanRepo.findByTargetDay(targetDay);
            if (!operationPlans) {
                return Result.ok([]);
            }
            const operationPlanDTOs = Array.isArray(operationPlans)
                ? operationPlans.map(op => ({
                    id: op.id,
                    vvn: op.vvn,
                    targetDay: op.TargetDay,
                    arrivalTime: op.arrivalTime,
                    departureTime: op.departureTime,
                    operations: op.operations,
                    author: op.author,
                    algorithm: op.algorithm,
                    createdAt: op.createdAt
                }))
                : [{
                    id: operationPlans.id,
                    vvn: operationPlans.vvn,
                    targetDay: operationPlans.TargetDay,
                    arrivalTime: operationPlans.arrivalTime,
                    departureTime: operationPlans.departureTime,
                    operations: operationPlans.operations,
                    author: operationPlans.author,
                    algorithm: operationPlans.algorithm,
                    createdAt: operationPlans.createdAt
                }];
            return Result.ok(operationPlanDTOs);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plans by target day.");
        }
    }

    public async getOperationPlansByArrivalTime(arrivalTime: Date): Promise<Result<OperationPlanDTO[]>> {
        try {
            const operationPlans = await this.operationPlanRepo.findByArrivalTime(arrivalTime);
            const operationPlanDTOs = operationPlans.map(op => ({
                id: op.id,
                vvn: op.vvn,
                targetDay: op.TargetDay,
                arrivalTime: op.arrivalTime,
                departureTime: op.departureTime,
                operations: op.operations,
                author: op.author,
                algorithm: op.algorithm,
                createdAt: op.createdAt
            }));
            return Result.ok(operationPlanDTOs);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plans by arrival time.");
        }

    }

    public async getOperationPlansByDepartureTime(departureTime: Date): Promise<Result<OperationPlanDTO[]>> {
        try {
            const operationPlans = await this.operationPlanRepo.findByDepartureTime(departureTime);
            const operationPlanDTOs = operationPlans.map(op => ({
                id: op.id,
                vvn: op.vvn,
                targetDay: op.TargetDay,
                arrivalTime: op.arrivalTime,
                departureTime: op.departureTime,
                operations: op.operations,
                author: op.author,
                algorithm: op.algorithm,
                createdAt: op.createdAt
            }));
            return Result.ok(operationPlanDTOs);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plans by departure time.");
        }
    }

    public async getOperationPlansByAuthor(author: string): Promise<Result<OperationPlanDTO[]>> {
        try {
            const operationPlans = await this.operationPlanRepo.findByAuthor(author);
            const operationPlanDTOs = operationPlans.map(op => ({
                id: op.id,
                vvn: op.vvn,
                targetDay: op.TargetDay,
                arrivalTime: op.arrivalTime,
                departureTime: op.departureTime,
                operations: op.operations,
                author: op.author,
                algorithm: op.algorithm,
                createdAt: op.createdAt
            }));
            return Result.ok(operationPlanDTOs);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plans by author.");
        }
    }

    public async getOperationPlansByAlgorithm(algorithm: string): Promise<Result<OperationPlanDTO[]>> {
        try {
            const operationPlans = await this.operationPlanRepo.findByAlgorithm(algorithm);
            const operationPlanDTOs = operationPlans.map(op => ({
                id: op.id,
                vvn: op.vvn,
                targetDay: op.TargetDay,
                arrivalTime: op.arrivalTime,
                departureTime: op.departureTime,
                operations: op.operations,
                author: op.author,
                algorithm: op.algorithm,
                createdAt: op.createdAt
            }));
            return Result.ok(operationPlanDTOs);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error retrieving operation plans by algorithm.");
        }
    }

    public async create(dto: OperationPlanDTO): Promise<Result<OperationPlanDTO>> {
        try {
            const exists = await this.operationPlanRepo.findByVvn(dto.vvn);
            if (exists) {
                return Result.fail("Operation plan with the same VVN already exists.");
            }

            const conflictWithTargetDay = await this.operationPlanRepo.findByTargetDay(dto.targetDay);
            if (conflictWithTargetDay) {
                return Result.fail("Operation plan for the same target day already exists.");
            }

            const domain = OperationPlanMap.toDomain({
                vvn: dto.vvn,
                TargetDay: dto.targetDay,
                arrivalTime: dto.arrivalTime,
                departureTime: dto.departureTime,
                operations: dto.operations,
                author: dto.author,
                algorithm: dto.algorithm,
                createdAt: new Date()
            } as any);
            const saved = await this.operationPlanRepo.save(domain);
            if (!saved) {
                return Result.fail("Failed to create operation plan.");
            }
            const createdDTO = OperationPlanMap.toDTO(saved);
            return Result.ok(createdDTO);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error creating operation plan.");
        }
    }

    public async update(vvn: string, dto: OperationPlanDTO): Promise<Result<OperationPlanDTO>> {
        try {
            const operationPlan = await this.operationPlanRepo.findByVvn(vvn);
            if (!operationPlan) {
                return Result.fail("Operation plan not found.");
            }

            if (dto.vvn !== vvn) {
                return Result.fail("Vessel Visit Notification number cannot be changed.");
            }

            const conflictWithTargetDay = await this.operationPlanRepo.findByTargetDay(dto.targetDay);
            if (conflictWithTargetDay && conflictWithTargetDay.id !== operationPlan.id) {
                return Result.fail("Another operation plan for the same target day already exists.");
            }

            try {
                operationPlan.updateTargetDay(dto.targetDay);
                operationPlan.updateArrivalTime(dto.arrivalTime);
                operationPlan.updateDepartureTime(dto.departureTime);
                operationPlan.updateAuthor(dto.author);
                operationPlan.updateAlgorithm(dto.algorithm);
            } catch (error: any) {
                return Result.fail(`Validation error: ${error.message}`);
            }

            const updated = await this.operationPlanRepo.update(operationPlan);
            if (!updated) {
                return Result.fail("Failed to update operation plan.");
            }
            const updatedDTO = OperationPlanMap.toDTO(operationPlan);
            return Result.ok(updatedDTO);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error updating operation plan.");
        }

    }


    private createOperationEntries(
        vvn: string,
        assignedCranes: string[],
        operationTypes: string[],
        containers: string[],
        arrivalTime: Date,
        departureTime: Date
    ): any[] {
        const operations: any[] = [];
        
        // Criar operações com os dados que já vêm do Prolog
        for (let i = 0; i < assignedCranes.length; i++) {
            operations.push({
                id: `${vvn}-OP${i + 1}`,
                operationType: operationTypes[i] || 'LOADING',
                container: containers[i],
                operationStart: new Date(arrivalTime),
                operationEnd: new Date(departureTime),
                craneUsed: assignedCranes[i]
            });
        }

        return operations;
    }

    public async createBatch(
        vvns: string[],
        assignedCranes: string[][],
        staffs: string[][],
        operationTypes: string[][],
        containers: string[][],
        arrivalTimes: string[],
        departureTimes: string[],
        targetDays: string[],
        author: string,
        algorithm: string
    ): Promise<Result<OperationPlanDTO[]>> {
        try {
            console.log('=== SERVICE - CREATE BATCH DEBUG ===');
            console.log('vvns:', vvns);
            console.log('vvns.length:', vvns?.length);
            console.log('assignedCranes:', assignedCranes);
            console.log('assignedCranes.length:', assignedCranes?.length);
            console.log('staffs.length:', staffs?.length);
            console.log('operationTypes.length:', operationTypes?.length);
            console.log('containers.length:', containers?.length);
            console.log('arrivalTimes.length:', arrivalTimes?.length);
            console.log('departureTimes.length:', departureTimes?.length);
            console.log('targetDays.length:', targetDays?.length);
            console.log('author:', author);
            console.log('algorithm:', algorithm);
            
            const createdPlans: OperationPlanDTO[] = [];

            // Validar que todos os arrays têm o mesmo tamanho
            if (vvns.length !== assignedCranes.length ||
                vvns.length !== staffs.length ||
                vvns.length !== operationTypes.length ||
                vvns.length !== containers.length ||
                vvns.length !== arrivalTimes.length ||
                vvns.length !== departureTimes.length ||
                vvns.length !== targetDays.length) {
                this.logger.error('Array length mismatch!');
                return Result.fail("All input arrays must have the same length.");
            }

            // Iterar por cada VVN e criar o operation plan correspondente
            for (let i = 0; i < vvns.length; i++) {
                const vvn = vvns[i];
                const arrivalTime = new Date(arrivalTimes[i]);
                const departureTime = new Date(departureTimes[i]);
                const targetDay = new Date(targetDays[i]);

                console.log(`=== Processing VVN ${i}: ${vvn} ===`);
                console.log('assignedCranes[i]:', assignedCranes[i]);
                console.log('operationTypes[i]:', operationTypes[i]);
                console.log('containers[i]:', containers[i]);

                // Criar as operation entries para este VVN
                const operations = this.createOperationEntries(
                    vvn,
                    assignedCranes[i],
                    operationTypes[i],
                    containers[i],
                    arrivalTime,
                    departureTime
                );

                console.log('Generated operations:', operations);

                // Criar o operation plan (ID será gerado automaticamente pelo MongoDB)
                const domain = OperationPlanMap.toDomain({
                    _id: undefined, // MongoDB gerará um ObjectId único automaticamente
                    vvn: vvn,
                    TargetDay: targetDay,
                    arrivalTime: arrivalTime,
                    departureTime: departureTime,
                    operations: operations,
                    author: author,
                    algorithm: algorithm,
                    createdAt: new Date()
                } as any);

                const saved = await this.operationPlanRepo.save(domain);
                if (!saved) {
                    this.logger.error(`Failed to create operation plan for VVN: ${vvn}`);
                    continue; // Continuar para o próximo
                }

                const createdDTO = OperationPlanMap.toDTO(saved);
                createdPlans.push(createdDTO);
            }

            if (createdPlans.length === 0) {
                return Result.fail("Failed to create any operation plans.");
            }

            return Result.ok(createdPlans);
        } catch (error) {
            this.logger.error(error);
            return Result.fail("Error creating batch operation plans.");
        }
    }


}
