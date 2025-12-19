import { Request, Response, NextFunction } from 'express';

export default interface IIncidentController {
    getAllIncidents(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentByVessel(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentsByDateRange(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentsBySeverity(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIncidentsByStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    createIncident(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateIncident(req: Request, res: Response, next: NextFunction): Promise<void>;
}