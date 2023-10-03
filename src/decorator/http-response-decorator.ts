import { Response } from "express";

export const httpResponseDecorator = (res: Response, data: any): void => {
    if ([500, 503, 502, 501, 403, 401, 402].includes(data.code)) {
        res.status(data.code).json({ code: data.code, status: false, message: data.body.stack });
      } else {
        res.status(data.code).json(data);
      }
}