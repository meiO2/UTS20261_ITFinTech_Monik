    import type { NextApiRequest, NextApiResponse } from "next";
    import crypto from "crypto";
    import dbConnect from "../../../lib/mongodb";
    import Payment from "../../../models/Payment";
    import Checkout from "../../../models/Checkout";

    type MidtransNotification = {
    transaction_time?: string;
    transaction_status?: string;
    transaction_id?: string;
    status_message?: string;
    status_code?: string;
    signature_key?: string;
    settlement_time?: string;
    payment_type?: string;
    order_id?: string;
    merchant_id?: string;
    gross_amount?: string;
    fraud_status?: string;
    currency?: string;
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
        const notification =
        req.body as MidtransNotification;

        const {
        order_id,
        status_code,
        gross_amount,
        signature_key,
        transaction_status,
        transaction_id,
        payment_type,
        fraud_status,
        } = notification;

        /*
        * Make sure the important fields exist.
        */
        if (
        !order_id ||
        !status_code ||
        !gross_amount ||
        !signature_key
        ) {
        return res.status(400).json({
            message: "Invalid Midtrans notification",
        });
        }

        /*
        * Verify that this notification really came from Midtrans.
        *
        * SHA512(
        *   order_id +
        *   status_code +
        *   gross_amount +
        *   server_key
        * )
        */
        const serverKey =
        process.env.MIDTRANS_SERVER_KEY;

        if (!serverKey) {
        console.error(
            "MIDTRANS_SERVER_KEY is not configured"
        );

        return res.status(500).json({
            message: "Midtrans Server Key is not configured",
        });
        }

        const signatureInput =
        order_id +
        status_code +
        gross_amount +
        serverKey;

        const calculatedSignature =
        crypto
            .createHash("sha512")
            .update(signatureInput)
            .digest("hex");

        if (calculatedSignature !== signature_key) {
        console.error(
            "Invalid Midtrans signature"
        );

        return res.status(401).json({
            message: "Invalid signature",
        });
        }

        /*
        * Connect to MongoDB.
        */
        await dbConnect();

        /*
        * Save / update payment information.
        *
        * Because orderId is unique, repeated Midtrans
        * notifications update the same payment instead
        * of creating duplicate payments.
        */
        await Payment.findOneAndUpdate(
        { orderId: order_id },
        {
            orderId: order_id,
            transactionId: transaction_id || "",
            paymentType: payment_type || "",
            grossAmount: Number(gross_amount),
            transactionStatus:
            transaction_status || "pending",
            fraudStatus: fraud_status || "",
            statusCode: status_code,
            rawResponse: notification,
        },
        {
            upsert: true,
            new: true,
        }
        );

        /*
        * Determine whether the payment is successful.
        *
        * Midtrans recommends checking:
        * status_code === "200"
        * fraud_status === "accept"
        * transaction_status === "settlement"
        *
        * Capture is also a successful state for
        * applicable payment types.
        */
        const isPaid =
        status_code === "200" &&
        (fraud_status === "accept" ||
            fraud_status === "ACCEPT") &&
        (transaction_status === "settlement" ||
            transaction_status === "capture");

        if (isPaid) {
        await Checkout.findOneAndUpdate(
            { orderId: order_id },
            {
            status: "LUNAS",
            }
        );

        console.log(
            `Order ${order_id} marked as LUNAS`
        );
        } else if (
        transaction_status === "expire" ||
        transaction_status === "deny" ||
        transaction_status === "cancel" ||
        transaction_status === "failure"
        ) {
        await Checkout.findOneAndUpdate(
            { orderId: order_id },
            {
            status: "FAILED",
            }
        );

        console.log(
            `Order ${order_id} marked as FAILED`
        );
        }

        /*
        * Midtrans expects a successful HTTP response.
        */
        return res.status(200).json({
        message: "Notification processed",
        orderId: order_id,
        transactionStatus: transaction_status,
        paid: isPaid,
        });
    } catch (error) {
        console.error(
        "Midtrans notification error:",
        error
        );

        return res.status(500).json({
        message: "Failed to process notification",
        });
    }
    }