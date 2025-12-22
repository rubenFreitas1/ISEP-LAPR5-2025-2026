import { Request, Response, NextFunction } from 'express';

export default interface IComplementaryTaskCategoryController {
    getAllComplementaryTaskCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComplementaryTaskCategoryById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComplementaryTaskCategoryByCode(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComplementaryTaskCategoryByName(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComplementaryTaskCategoriesWithParent(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComplementaryTaskCategoriesByParent(req: Request, res: Response, next: NextFunction): Promise<void>;
    createComplementaryTaskCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateComplementaryTaskCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}