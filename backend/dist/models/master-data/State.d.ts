import mongoose, { Document } from 'mongoose';
export interface IState extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    country: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const State: mongoose.Model<IState, {}, {}, {}, mongoose.Document<unknown, {}, IState> & IState & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default State;
//# sourceMappingURL=State.d.ts.map