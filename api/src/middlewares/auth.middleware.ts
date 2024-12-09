import { NextFunction, Request, Response } from 'express';
import { AuthenticationError } from '@/core/exceptions';
import { JWTService } from '@/services/jwt.service';

export class AuthMiddleware {
  constructor(private readonly jwtService: JWTService = new JWTService()) {}

  handle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies?.refreshToken || null;

    if (!accessToken) {
      return next(new AuthenticationError(AuthMiddleware.name, 'Authorization token is required.'));
    }

    try {
      const data: any = this.jwtService.verifyAccessToken(accessToken);
      req.user = data.user;
      req.docusign = data.docusign;
      req.accessToken = accessToken;
      req.refreshToken = refreshToken;

      next();
    } catch (error) {
      next(new AuthenticationError(AuthMiddleware.name, 'Invalid or expired token.'));
    }
  };
}
