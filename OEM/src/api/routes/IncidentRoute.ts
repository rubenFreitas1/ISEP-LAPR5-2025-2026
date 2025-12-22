import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import IIncidentController from '../../controllers/IControllers/IIncidentController';
import { requireRole } from '../middlewares/RequiredRole';
import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/incidents', route);

  const ctrl = Container.get(config.controllers.incident.name) as IIncidentController;

  /**
   * @swagger
   * /incidents:
   *   post:
   *     tags: [Incidents]
   *     summary: Create a new Incident
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IncidentDTO'
   *     responses:
   *       201:
   *         description: Incident created
   *       400:
   *         description: Validation error
   */
  route.post(
    '',
    requireRole(['Admin', 'LogisticOperator']),
    celebrate({
      body: Joi.object({
        incidentTypeByCode: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null),
        status: Joi.string().valid('Active', 'Resolved').required(),
        description: Joi.string().required(),
        vesselVisitExecutionsCodes: Joi.array().items(Joi.string()).optional().allow(null),
        classification: Joi.string().valid("Minor", "Major", "Critical").required(),
      })
    }),
    (req, res, next) => ctrl.createIncident(req, res, next)
  );

  /**
   * @swagger
   * /incidents/update/{id}:
   *   put:
   *     tags: [Incidents]
   *     summary: Update an Incident
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the Incident to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IncidentDTO'
   *     responses:
   *       200:
   *         description: Updated successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: Incident not found
   */
  route.put(
    '/update/:id',
    requireRole(['Admin', 'PortAuthorityOfficer']),
    celebrate({
      body: Joi.object({
        endDate: Joi.date().optional().allow(null),
        status: Joi.string().valid('Active', 'Resolved').required(),
        description: Joi.string().required(),
        vesselVisitExecutionsCodes: Joi.array().items(Joi.string()).optional().allow(null),
        classification: Joi.string().valid("Minor", "Major", "Critical").required(),
      })
    }),
    (req, res, next) => ctrl.updateIncident(req, res, next)
  );

  /**
   * @swagger
   * /incidents:
   *   get:
   *     tags: [Incidents]
   *     summary: Get all incidents
   *     responses:
   *       200:
   *         description: Array of incidents
   */
  route.get('', (req, res, next) =>
    ctrl.getAllIncidents(req, res, next)
  );

  /**
   * @swagger
   * /incidents/id/{id}:
   *   get:
   *     tags: [Incidents]
   *     summary: Get an incident by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Incident found
   *       404:
   *         description: Not found
   */
  route.get('/id/:id', (req, res, next) =>
    ctrl.getIncidentById(req, res, next)
  );

  /**
   * @swagger
   * /incidents/vessel/{vesselIMO}:
   *   get:
   *     tags: [Incidents]
   *     summary: Get incidents by vessel IMO
   *     parameters:
   *       - in: path
   *         name: vesselIMO
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of incidents
   *       404:
   *         description: No incidents found
   */
  route.get('/vessel/:vesselIMO', (req, res, next) =>
    ctrl.getIncidentByVessel(req, res, next)
  );

  /**
   * @swagger
   * /incidents/date-range:
   *   get:
   *     tags: [Incidents]
   *     summary: Get incidents within a date range
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: endDate
   *         required: false
   *         schema:
   *           type: string
   *           format: date-time
   *     responses:
   *       200:
   *         description: List of incidents
   */
  route.get('/date-range', (req, res, next) =>
    ctrl.getIncidentsByDateRange(req, res, next)
  );

  /**
   * @swagger
   * /incidents/severity/{severity}:
   *   get:
   *     tags: [Incidents]
   *     summary: Get incidents by severity (from incident type)
   *     parameters:
   *       - in: path
   *         name: severity
   *         required: true
   *         schema:
   *           type: string
   *           enum: [Minor, Major, Critical]
   *     responses:
   *       200:
   *         description: List of incidents
   */
  route.get('/severity/:severity', (req, res, next) =>
    ctrl.getIncidentsBySeverity(req, res, next)
  );

  /**
   * @swagger
   * /incidents/status/{status}:
   *   get:
   *     tags: [Incidents]
   *     summary: Get incidents by status
   *     parameters:
   *       - in: path
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [Active, Resolved]
   *     responses:
   *       200:
   *         description: List of incidents
   */
  route.get('/status/:status', (req, res, next) =>
    ctrl.getIncidentsByStatus(req, res, next)
  );
};