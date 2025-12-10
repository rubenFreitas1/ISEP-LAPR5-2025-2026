import { Router } from 'express';
import incidentTypeRoute from './routes/IncidentTypeRoute';

export default () => {
    const app = Router();
    incidentTypeRoute(app);
    return app;
}