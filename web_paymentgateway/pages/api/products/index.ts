    import type { NextApiRequest, NextApiResponse } from "next";
    import dbConnect from "../../../lib/mongodb";
    import Product from "../../../models/Product";

    export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method !== "GET") {
        return res.status(405).json({
        message: "Method not allowed",
        });
    }

    try {
        await dbConnect();

        const products = await Product.find().sort({ name: 1 });

        return res.status(200).json(products);
    } catch (error) {
        console.error("Products API error:", error);

        return res.status(500).json({
        message: "Failed to fetch products.",
        });
    }
    }