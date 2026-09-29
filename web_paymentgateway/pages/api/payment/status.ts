    import type { NextApiRequest, NextApiResponse } from "next";
    import dbConnect from "../../../lib/mongodb";
    import Checkout from "../../../models/Checkout";

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
        const { orderId } = req.query;

        if (!orderId || typeof orderId !== "string") {
        return res.status(400).json({
            message: "Order ID is required",
        });
        }

        await dbConnect();

        const checkout = await Checkout.findOne({
        orderId,
        }).lean();

        if (!checkout) {
        return res.status(404).json({
            message: "Order not found",
        });
        }

        return res.status(200).json({
        orderId: checkout.orderId,
        status: checkout.status,
        });
    } catch (error) {
        console.error("Payment status error:", error);

        return res.status(500).json({
        message: "Failed to check payment status",
        });
    }
    }