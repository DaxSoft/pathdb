import { PathRoute } from '@vorlefan/path';

export interface I_PathModel_Args {
    pathRoute?: PathRoute;
    modelName: string;
    routeName?: string;
    backup?: boolean;
    schema?: Function | null;
}

export interface I_PathModel_Data {
    createdAt: number;
    updatedAt: number;
    docs: Array<any>;
}
