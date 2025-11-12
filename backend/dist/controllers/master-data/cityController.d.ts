import { Request, Response } from 'express';
export declare const getCities: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCityById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createCity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteCity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleCityStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=cityController.d.ts.map