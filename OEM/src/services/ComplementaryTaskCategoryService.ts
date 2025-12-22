import { Service, Inject } from "typedi";
import IComplementaryTaskCategoryRepo from "./IRepos/IComplementaryTaskCategoryRepo";
import { ComplementaryTaskCategory } from "../domain/ComplementaryTaskCategory";
import { ComplementaryTaskCategoryDTO } from "../dto/ComplementaryTaskCategoryDTO";
import { ComplementaryTaskCategoryMap } from "../mappers/ComplementaryTaskCategoryMap";
import { Result } from "../core/logic/Result";
import IComplementaryTaskCategoryService from "./IServices/IComplementaryTaskCategoryService";

@Service()
export default class ComplementaryTaskCategoryService implements IComplementaryTaskCategoryService {

    constructor(
        @Inject('complementaryTaskCategoryRepo') private complementaryTaskCategoryRepo:IComplementaryTaskCategoryRepo,
        @Inject('logger') private logger: any
    ) {}

    private async resolveParentCodes(complementaryTaskCategory: ComplementaryTaskCategory[]): Promise<Map<string, string>> {
        const parentIds = [...new Set(
            complementaryTaskCategory.map(i => i.parentComplementaryTaskCategoryId)
            .filter((id): id is string => id !== undefined)
        )];
        if (parentIds.length === 0) {
            return new Map<string, string>();
        }
        const parents = await this.complementaryTaskCategoryRepo.findByIds(parentIds);
        return new Map<string, string>(parents.map((p: ComplementaryTaskCategory) => [p.id, p.code]));
    }
    
    private async getSingleParentCode(parentId?: string): Promise<string | undefined> {
        if (!parentId) return undefined;
    
        const parent = await this.complementaryTaskCategoryRepo.findById(parentId);
        return parent ? parent.code : undefined;
    }
    
    public async getAllComplementaryTaskCategories(): Promise<Result<ComplementaryTaskCategoryDTO[]>> {
        try {
            const complementaryTaskCategories = await this.complementaryTaskCategoryRepo.findAll();
            const parentMap = await this.resolveParentCodes(complementaryTaskCategories);
            const dtos = complementaryTaskCategories.map(i => {
                const parentCode = i.parentComplementaryTaskCategoryId
                    ? parentMap.get(i.parentComplementaryTaskCategoryId)
                    : undefined;
    
                return ComplementaryTaskCategoryMap.toDTO(i, parentCode);
            });
            return Result.ok(dtos);
        } catch (err) {
            this.logger.error(err);
            return Result.fail("Error getting all complementary task categories");
        }
    }
    
    public async getComplementaryTaskCategoryById(id: string): Promise<Result<ComplementaryTaskCategoryDTO>> {
        try{
            const complementaryTaskCategory = await this.complementaryTaskCategoryRepo.findById(id);
            if(!complementaryTaskCategory){
                return Result.fail<ComplementaryTaskCategoryDTO>("Incident type not found");
            }
            const parentCode = await this.getSingleParentCode(complementaryTaskCategory.parentComplementaryTaskCategoryId);
            const dto = ComplementaryTaskCategoryMap.toDTO(complementaryTaskCategory, parentCode);
            return Result.ok<ComplementaryTaskCategoryDTO>(dto);
        }catch(err){
            this.logger.error(err);
            return Result.fail<ComplementaryTaskCategoryDTO>("Error getting complementary task category by ID");
        }
    }
    
    public async getComplementaryTaskCategoryByCode(code: string): Promise<Result<ComplementaryTaskCategoryDTO>> {
        try{
            const complementaryTaskCategory = await this.complementaryTaskCategoryRepo.findByCode(code);
            if(!complementaryTaskCategory){
                return Result.fail<ComplementaryTaskCategoryDTO>("Complementary task category not found");
            }
            const parentCode = await this.getSingleParentCode(complementaryTaskCategory.parentComplementaryTaskCategoryId);
            const dto = ComplementaryTaskCategoryMap.toDTO(complementaryTaskCategory, parentCode);
            return Result.ok<ComplementaryTaskCategoryDTO>(dto);
        }catch(err){
            this.logger.error(err);
            return Result.fail<ComplementaryTaskCategoryDTO>("Error getting complementary task category by code");
        }
    }
    
    public async getComplementaryTaskCategoryByName(name: string): Promise<Result<ComplementaryTaskCategoryDTO>> {
        try{
            const complementaryTaskCategory = await this.complementaryTaskCategoryRepo.findByName(name);
            if(!complementaryTaskCategory){
                return Result.fail<ComplementaryTaskCategoryDTO>("Complementary task category not found");
            }
            const parentCode = await this.getSingleParentCode(complementaryTaskCategory.parentComplementaryTaskCategoryId);
            const dto = ComplementaryTaskCategoryMap.toDTO(complementaryTaskCategory, parentCode);
            return Result.ok<ComplementaryTaskCategoryDTO>(dto);
        }catch(err){
            this.logger.error(err);
            return Result.fail<ComplementaryTaskCategoryDTO>("Error getting complementary task category by name");
        }
    }
    
    
    public async getComplementaryTaskCategoriesWithParent(hasParent: boolean): Promise<Result<ComplementaryTaskCategoryDTO[]>> {
        try {
            const complementaryTaskCategories = await this.complementaryTaskCategoryRepo.findWithParent(hasParent);
            const parentMap = await this.resolveParentCodes(complementaryTaskCategories);
            const dtos = complementaryTaskCategories.map(i => {
                const parentCode = i.parentComplementaryTaskCategoryId
                    ? parentMap.get(i.parentComplementaryTaskCategoryId)
                    : undefined;
                return ComplementaryTaskCategoryMap.toDTO(i, parentCode);
            });
            return Result.ok(dtos);
        } catch (err) {
            this.logger.error(err);
            return Result.fail("Error getting complementary task categories with parent filter");
        }
    }
    
    public async getComplementaryTaskCategoryByParent(parentCode: string): Promise<Result<ComplementaryTaskCategoryDTO[]>> {
        try {
            const parent = await this.complementaryTaskCategoryRepo.findByCode(parentCode);
            if (!parent) {
                return Result.fail("Parent complementary task category not found");
            }
            const complementaryTaskCategories = await this.complementaryTaskCategoryRepo.findByParent(parent.id);
            const dtos = complementaryTaskCategories.map(i =>
                ComplementaryTaskCategoryMap.toDTO(i, parent.code)
            );
            return Result.ok(dtos);
        } catch (err) {
            this.logger.error(err);
            return Result.fail("Error getting complementary task categories by parent code");
        }
    }
    
    public async create(dto: ComplementaryTaskCategoryDTO): Promise<Result<ComplementaryTaskCategoryDTO>> {
        try {
            const exists = await this.complementaryTaskCategoryRepo.findByCode(dto.code);
            if (exists) {
                return Result.fail(`ComplementaryTaskCategory with code '${dto.code}' already exists.`);
            }
                
            const conflictWithName = await this.complementaryTaskCategoryRepo.findByName(dto.name);
            if (conflictWithName) {
                return Result.fail<ComplementaryTaskCategoryDTO>(`Complementary Task Category name '${dto.name}' is already in use.`);
            }
        
            let parentId: string | undefined = undefined;
            if (dto.parentComplementaryTaskCategoryCode) {
                const parentComplementaryTaskCategory = await this.complementaryTaskCategoryRepo.findByCode(dto.parentComplementaryTaskCategoryCode);
                if (parentComplementaryTaskCategory) {
                    parentId = parentComplementaryTaskCategory.id;
                } else {
                    return Result.fail(`Parent ComplementaryTaskCategory with code '${dto.parentComplementaryTaskCategoryCode}' not found.`);
                }
            }
            const duration = dto.duration ?? null;
            
            const domain = ComplementaryTaskCategoryMap.toDomain({
                code: dto.code,
                name: dto.name,
                description: dto.description,
                duration: duration,
                lastUpdated: new Date(),
                parentComplementaryTaskCategoryId: parentId,
            } as any);
            const saved = await this.complementaryTaskCategoryRepo.save(domain);
            if (!saved) {
                return Result.fail("Failed to create ComplementaryTaskCategory.");
            }
            let parentCode: string | undefined = undefined;
            if(saved.parentComplementaryTaskCategoryId){
                const parentComplementaryTaskCategory = await this.complementaryTaskCategoryRepo.findById(saved.parentComplementaryTaskCategoryId);
                if(parentComplementaryTaskCategory){
                parentCode = parentComplementaryTaskCategory.code;
                }
            }
            const dtoResult = ComplementaryTaskCategoryMap.toDTO(saved, parentCode);
            return Result.ok(dtoResult);
        } catch (e: any) {
            this.logger.error('Error in create service:', e);
            return Result.fail("Unexpected error creating ComplementaryTaskCategory: " + e.message);
        }
    }
    
        public async update(code: string,dto: ComplementaryTaskCategoryDTO): Promise<Result<ComplementaryTaskCategoryDTO>> {
            try {
                const existing = await this.complementaryTaskCategoryRepo.findByCode(code);
                if (!existing) {
                    this.logger.error(`ComplementaryTaskCategory with code '${code}' not found.`);
                    return Result.fail(`ComplementaryTaskCategory with code '${code}' not found.`);
                }
    
                if(dto.code !== code){
                    return Result.fail("ComplementaryTaskCategory code cannot be changed.");        
                }
    
                const conflictWithName = await this.complementaryTaskCategoryRepo.findByName(dto.name);
                if (conflictWithName && conflictWithName.id !== existing.id) {
                    return Result.fail<ComplementaryTaskCategoryDTO>(`Complementary Task Category name '${dto.name}' is already in use.`);
                }
    
                if(dto.parentComplementaryTaskCategoryCode === dto.code){
                    return Result.fail<ComplementaryTaskCategoryDTO>("A ComplementaryTaskCategory cannot be its own parent.");
                }
    
                let parentId: string | undefined = undefined;
                if (dto.parentComplementaryTaskCategoryCode) {
                    const parentComplementaryTaskCategory = await this.complementaryTaskCategoryRepo.findByCode(dto.parentComplementaryTaskCategoryCode);
                    if(!parentComplementaryTaskCategory){
                        return Result.fail(`Parent ComplementaryTaskCategory with code '${dto.parentComplementaryTaskCategoryCode}' not found.`);
                    }
                    parentId = parentComplementaryTaskCategory.id;
                }
                
                try{
                    existing.updateName(dto.name);
                    existing.updateDescription(dto.description);
                    existing.updateDuration(dto.duration);
                    existing.updateParentComplementaryTaskCategory(parentId);
                }catch(err: any){
                    return Result.fail<ComplementaryTaskCategoryDTO>("Error: " + err.message);
                }
    
                const updated = await this.complementaryTaskCategoryRepo.update(existing);
                if (!updated) {
                    return Result.fail("Failed to update ComplementaryTaskCategory.");
                }
                let parentCode: string | undefined = undefined;
                if(existing.parentComplementaryTaskCategoryId){
                    const parentComplementaryTaskCategory = await this.complementaryTaskCategoryRepo.findById(existing.parentComplementaryTaskCategoryId);
                    if(parentComplementaryTaskCategory){
                    parentCode = parentComplementaryTaskCategory.code;
                    }
                }
                const dtoResult = ComplementaryTaskCategoryMap.toDTO(existing, parentCode);
                return Result.ok(dtoResult);
            } catch (e) {
                this.logger.error(e);
                return Result.fail("Unexpected error updating ComplementaryTaskCategory.");
            }
        }
}