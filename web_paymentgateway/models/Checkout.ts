    import mongoose, { Schema, Model } from "mongoose";

    const CheckoutItemSchema = new Schema(
    {
        productId: {
        type: String,
        required: true,
        },

        name: {
        type: String,
        required: true,
        },

        price: {
        type: Number,
        required: true,
        },

        quantity: {
        type: Number,
        required: true,
        },
    },
    { _id: false }
    );

    const CheckoutSchema = new Schema(
    {
        orderId: {
        type: String,
        required: true,
        unique: true,
        },

        table: {
        type: String,
        required: true,
        },

        items: {
        type: [CheckoutItemSchema],
        required: true,
        },

        subtotal: {
        type: Number,
        required: true,
        },

        tax: {
        type: Number,
        required: true,
        },

        total: {
        type: Number,
        required: true,
        },

        note: {
        type: String,
        default: "",
        },

        status: {
        type: String,
        enum: ["PENDING", "LUNAS", "FAILED"],
        default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
    );

    const Checkout: Model<any> =
    mongoose.models.Checkout ||
    mongoose.model("Checkout", CheckoutSchema);

    export default Checkout;