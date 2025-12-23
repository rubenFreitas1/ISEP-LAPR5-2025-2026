import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import config from '../../config';
import { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import { auth } from 'express-oauth2-jwt-bearer';

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // CORS aligned with API Program.cs
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.cors.origins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Authorization','Content-Type','Origin','Accept'],
    exposedHeaders: ['Authorization']
  }));

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require('method-override')());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  


  // JWT Auth0 middleware configured like .NET API
  // Skip JWT in test mode to allow system tests to run
  if (config.env === 'test') {
    app.use(config.api.prefix, routes());
  } else {
    const checkJwt = auth({
      audience: config.auth0.audience,
      issuerBaseURL: config.auth0.domain ? `https://${config.auth0.domain}/` : undefined,
      tokenSigningAlg: 'RS256'
    });
    app.use(config.api.prefix, checkJwt, routes());
  }


  
  /// catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    interface HttpError extends Error {
      status?: number;
    }

    const err: HttpError = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /// error handlers
  
  // Celebrate validation error handler - must come before general error handlers
  app.use(errors());
  
  app.use((err : any, req: Request, res: Response, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });
  app.use((err : any, req: Request, res: Response, next: NextFunction) => {
    // Log the error for debugging
    console.error('Error details:', err);
    
    res.status(err.status || 500);
    res.json({
      error: err.status === 500 ? 'Internal Server Error' : err.message,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });
};
