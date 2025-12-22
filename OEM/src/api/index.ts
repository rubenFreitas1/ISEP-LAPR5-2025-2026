import { Router } from 'express';
import incidentTypeRoute from './routes/IncidentTypeRoute';
import vesselVisitExecutionRoute from './routes/VesselVisitExecutionRoute';
import incidentRoute from './routes/IncidentRoute';
import complementaryTaskCategoryRoute from './routes/ComplementaryTaskCategory';

export default () => {
    const app = Router();
    incidentTypeRoute(app);
    vesselVisitExecutionRoute(app);
    incidentRoute(app);
    complementaryTaskCategoryRoute(app);
    return app;
}