import mongoose from 'mongoose';
export declare const helpDeskPermissions: {
    module: string;
    name: string;
    code: string;
    description: string;
    category: string;
}[];
export declare const superAdminPermissions: string[];
export declare const defaultRoles: {
    name: string;
    code: string;
    description: string;
    type: string;
    permissions: string[];
}[];
export declare function seedRolesAndPermissions(): Promise<{
    permissions: mongoose.MergeType<mongoose.Document<unknown, {}, import("../models/Permission").IPermission> & import("../models/Permission").IPermission & {
        _id: mongoose.Types.ObjectId;
    }, Omit<{
        module: string;
        name: string;
        code: string;
        description: string;
        category: string;
    }, "_id">>[];
    roles: mongoose.MergeType<mongoose.Document<unknown, {}, import("../models/Role").IRole> & import("../models/Role").IRole & {
        _id: mongoose.Types.ObjectId;
    }, Omit<{
        permissions: any[];
        name: string;
        code: string;
        description: string;
        type: string;
    }, "_id">>[];
} | undefined>;
//# sourceMappingURL=seedRolesPermissions.d.ts.map