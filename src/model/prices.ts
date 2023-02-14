import {Types, Schema, model, Document} from 'mongoose';

export interface Price {
    price: number,
    createdAt: Date,
};

export interface IPrices extends Document {
    simulator: Types.ObjectId,
    prices: Price[],
    createdAt: Date,
};

const PricesSchema = new Schema<IPrices>({
    simulator: {
        type: Schema.Types.ObjectId,
        ref: 'Simulators'
    },
    prices: [
        {
            price: Number,
            createdAt: Date,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

export default model<IPrices>('Prices', PricesSchema);
