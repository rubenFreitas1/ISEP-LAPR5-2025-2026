import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Environment: development, production, or test
   */
  env: process.env.NODE_ENV || 'development',

  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 3001, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Auth0 configuration
   */
  auth0: {
    domain: process.env.AUTH0_DOMAIN || '',
    audience: process.env.AUTH0_AUDIENCE || '',
  },

  /**
   * CORS configuration
   */
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:4200,http://141.253.198.138').split(','),
  },

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    incidentType: {
      name: "IncidentTypeController",
      path: "../controllers/IncidentTypeController"
    },
    vesselVisitExecution: {
      name: "VesselVisitExecutionController",
      path: "../controllers/VesselVisitExecutionController"
    },
    incident: {
      name: "IncidentController",
      path: "../controllers/IncidentController"
    },
    complementaryTaskCategory: {
      name: "ComplementaryTaskCategoryController",
      path: "../controllers/ComplementaryTaskCategoryController"
    }
  },

  repos: {
    incidentType: {
      name: "incidentTypeRepo",
      path: "../repos/IncidentTypeRepo"
    },
    vesselVisitExecution: {
      name: "vesselVisitExecutionRepo",
      path: "../repos/VesselVisitExecutionRepo"
    },
    incident: {
      name: "incidentRepo",
      path: "../repos/IncidentRepo"
    },
    complementaryTaskCategory: {
      name: "complementaryTaskCategoryRepo",
      path: "../repos/ComplementaryTaskCategoryRepo"
    }
  },

  services: {
    incidentType: {
      name: "incidentTypeService",
      path: "../services/IncidentTypeService"
    },
    vesselVisitExecution: {
      name: "vesselVisitExecutionService",
      path: "../services/VesselVisitExecutionService"
    },
    incident: {
      name: "incidentService",
      path: "../services/IncidentService"
    },
    complementaryTaskCategory: {
      name: "complementaryTaskCategoryService",
      path: "../services/ComplementaryTaskCategoryService"
    }
  }
}
