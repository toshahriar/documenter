import 'express';

declare module 'express' {
  export interface Request {
    user?: any;
    docusign?: any;
    accessToken?: any;
    refreshToken?: any;
  }
}
