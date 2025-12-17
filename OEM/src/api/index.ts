import { Router } from 'express';
import incidentTypeRoute from './routes/IncidentTypeRoute';
import vesselVisitExecutionRoute from './routes/VesselVisitExecutionRoute';

export default () => {
    const app = Router();
    incidentTypeRoute(app);
    vesselVisitExecutionRoute(app);
    return app;
}