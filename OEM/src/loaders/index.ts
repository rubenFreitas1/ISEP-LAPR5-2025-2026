import express from 'express';
import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import config from '../../config';
import swaggerLoader from './swagger';
import path from 'path';

export default async ({ expressApp }: { expressApp: express.Application }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const incidentTypeSchema = {
    name: 'incidentTypeSchema',
    schema: '../persistence/schemas/incidentTypeSchema',
  }

  const incidentTypeController = {
    name: config.controllers.incidentType.name,
    path: config.controllers.incidentType.path
  }

  const incidentTypeRepo = {
    name: config.repos.incidentType.name,
    path: config.repos.incidentType.path
  }

  const incidentTypeService = {
    name: config.services.incidentType.name,
    path: config.services.incidentType.path
  }

  const vesselVisitExecutionSchema = {
    name: 'vesselVisitExecutionSchema',
    schema: '../persistence/schemas/vesselVisitExecutionSchema',
  }

  const vesselVisitExecutionController = {
    name: config.controllers.vesselVisitExecution.name,
    path: config.controllers.vesselVisitExecution.path
  }

  const vesselVisitExecutionRepo = {
    name: config.repos.vesselVisitExecution.name,
    path: config.repos.vesselVisitExecution.path
  }

  const vesselVisitExecutionService = {
    name: config.services.vesselVisitExecution.name,
    path: config.services.vesselVisitExecution.path
  }

  //const userSchema = {
    // compare with the approach followed in repos and services
    //name: 'userSchema',
    //schema: '../persistence/schemas/userSchema',
  //}

  //const roleSchema = {
    // compare with the approach followed in repos and services
    //name: 'roleSchema',
    //schema: '../persistence/schemas/roleSchema',
  //}

  //const roleController = {
    //name: config.controllers.role.name,
    //path: config.controllers.role.path
  //}

  //const roleRepo = {
    //name: config.repos.role.name,
    //path: config.repos.role.path
  //}

  //const userRepo = {
    //name: config.repos.user.name,
    //path: config.repos.user.path
  //}

  //const roleService = {
    //name: config.services.role.name,
    //path: config.services.role.path
  //}

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      incidentTypeSchema,
      vesselVisitExecutionSchema
    ],
    controllers: [
      incidentTypeController,
      vesselVisitExecutionController
    ],
    repos: [
      incidentTypeRepo,
      vesselVisitExecutionRepo
    ],
    services: [
      incidentTypeService,
      vesselVisitExecutionService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  swaggerLoader(expressApp);
  Logger.info('✌️ Swagger loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
