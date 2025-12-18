import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: 'Missing access token' });
      }

      // Chamada à API C#
      const response = await axios.get(
        `${process.env.C_API_URL}/api/SystemUser/MyRole`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      const userRole = response.data.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      (req as any).userRole = userRole;

      next();
    } catch (err) {
      console.error('[AUTHZ] Role validation failed', err);
      return res.status(403).json({ message: 'Access denied' });
    }
  };
};
