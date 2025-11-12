import { Request, Response } from 'express';
export declare const getTicketFields: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTicketFieldById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createTicketField: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTicketField: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTicketField: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const seedDefaultTicketFields: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=ticketFieldController.d.ts.map