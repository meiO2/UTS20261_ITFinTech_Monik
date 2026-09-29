    import mongoose, { Schema, Model } from "mongoose";

    const ProductSchema = new Schema(
    {
        productId: {
        type: String,
        required: true,
        unique: true,
        },

        name: {
        type: String,
        required: true,
        },

        category: {
        type: String,
        enum: ["Food", "Drinks", "Snacks", "Desserts"],
        required: true,
        },

        price: {
        type: Number,
        required: true,
        },

        description: {
        type: String,
        required: true,
        },

        image: {
        type: String,
        default: "",
        },
    },
    {
        timestamps: true,
    }
    );

    const Product: Model<any> =
    mongoose.models.Product ||
    mongoose.model("Product", ProductSchema);

    export default Product;