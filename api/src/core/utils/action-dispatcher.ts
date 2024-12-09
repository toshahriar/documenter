import { Request, Response, NextFunction } from 'express';

export const actionDispatch =
  (action: Function) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> =>
    await action(req, res, next).catch(next);
