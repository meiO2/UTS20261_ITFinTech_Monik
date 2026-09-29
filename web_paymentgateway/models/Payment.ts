    import mongoose, { Schema, Model } from "mongoose";

    const PaymentSchema = new Schema(
    {
        orderId: {
        type: String,
        required: true,
        unique: true,
        },

        transactionId: {
        type: String,
        default: "",
        },

        paymentType: {
        type: String,
        default: "",
        },

        grossAmount: {
        type: Number,
        required: true,
        },

        transactionStatus: {
        type: String,
        default: "pending",
        },

        fraudStatus: {
        type: String,
        default: "",
        },

        statusCode: {
        type: String,
        default: "",
        },

        rawResponse: {
        type: Schema.Types.Mixed,
        default: {},
        },
    },
    {
        timestamps: true,
    }
    );

    const Payment: Model<any> =
    mongoose.models.Payment ||
    mongoose.model("Payment", PaymentSchema);

    export default Payment;