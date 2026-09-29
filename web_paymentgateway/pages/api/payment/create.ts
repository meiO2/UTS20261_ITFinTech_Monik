    import type { NextApiRequest, NextApiResponse } from "next";
    import dbConnect from "../../../lib/mongodb";
    import Checkout from "../../../models/Checkout";

    type Item = {
    productId: string;
    name: string;
    price: number;
    qty: number;
    };

    type RequestBody = {
    items: Item[];
    subtotal: number;
    tax: number;
    total: number;
    table: string;
    note?: string;
    method: string;
    };

    export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method !== "POST") {
        return res.status(405).json({
        message: "Method not allowed",
        });
    }

    try {
        const {
        items,
        subtotal,
        tax,
        total,
        table,
        note,
        method,
        }: RequestBody = req.body;

        if (!items || items.length === 0) {
        return res.status(400).json({
            message: "No items in order",
        });
        }

        if (!total || total <= 0) {
        return res.status(400).json({
            message: "Invalid total amount",
        });
        }

        if (!table || !table.trim()) {
        return res.status(400).json({
            message: "Table number is required",
        });
        }

        const serverKey = process.env.MIDTRANS_SERVER_KEY;

        if (!serverKey) {
        return res.status(500).json({
            message: "Midtrans Server Key is not configured",
        });
        }

        const orderId = `GUPA-${Date.now()}`;

        await dbConnect();

        // Save checkout/order to MongoDB
        await Checkout.create({
        orderId,
        table,
        items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.qty,
        })),
        subtotal,
        tax,
        total,
        note: note || "",
        status: "PENDING",
        });

        // Midtrans item details
        const itemDetails = [
        ...items.map((item) => ({
            id: item.productId,
            price: item.price,
            quantity: item.qty,
            name: item.name,
        })),

        ...(tax > 0
            ? [
                {
                id: "tax",
                price: tax,
                quantity: 1,
                name: "Tax",
                },
            ]
            : []),
        ];

        let chargeBody: Record<string, unknown>;

        if (method === "qris") {
        chargeBody = {
            payment_type: "qris",

            transaction_details: {
            order_id: orderId,
            gross_amount: total,
            },

            item_details: itemDetails,

            qris: {
            acquirer: "gopay",
            },
        };
        } else if (method === "ewallet") {
        chargeBody = {
            payment_type: "gopay",

            transaction_details: {
            order_id: orderId,
            gross_amount: total,
            },

            item_details: itemDetails,
        };
        } else if (method === "va") {
        chargeBody = {
            payment_type: "bank_transfer",

            transaction_details: {
            order_id: orderId,
            gross_amount: total,
            },

            item_details: itemDetails,

            bank_transfer: {
            bank: "bca",
            },
        };
        } else {
        return res.status(400).json({
            message:
            "Card payment will be added separately because it requires card tokenization.",
        });
        }

        const auth = Buffer.from(
        `${serverKey}:`
        ).toString("base64");

        const response = await fetch(
        "https://api.sandbox.midtrans.com/v2/charge",
        {
            method: "POST",

            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
            },

            body: JSON.stringify(chargeBody),
        }
        );

        const data = await response.json();

        console.log("Midtrans response:", data);

        if (!response.ok) {
        return res.status(response.status).json({
            message:
            data?.status_message ||
            data?.error_messages?.[0] ||
            "Midtrans payment failed",

            midtrans: data,
        });
        }

        return res.status(200).json({
        orderId,
        method,
        payment: data,
        });
    } catch (error) {
        console.error("Payment creation error:", error);

        return res.status(500).json({
        message: "Failed to create payment",
        });
    }
    }