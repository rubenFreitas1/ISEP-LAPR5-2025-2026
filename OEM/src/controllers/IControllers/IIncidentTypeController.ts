import { Request, Response, NextFunction } from 'express';

export default interface IIncidentTypeController {
    getAllIncidentTypes(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentTypeById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentTypeByCode(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentTypeByName(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentTypesWithParent(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentTypesByClassification(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentTypesByParent(req: Request, res: Response, next: NextFunction): Promise<void>;
    createIncidentType(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateIncidentType(req: Request, res: Response, next: NextFunction): Promise<void>;
}