    import { useState } from "react";
    import Image from "next/image";
    import Link from "next/link";
    import PageHeader from "../components/PageHeader";
    import { CheckIcon } from "../components/Icons";
    import { useCart } from "../context/CartContext";
    import { TAX_RATE, formatRupiah } from "../lib/format";

    const METHODS = [
    {
        id: "qris",
        name: "QRIS",
        desc: "Scan with any banking or e-wallet app",
    },
    {
        id: "ewallet",
        name: "E-wallet",
        desc: "GoPay, OVO, DANA, ShopeePay",
    },
    {
        id: "va",
        name: "Bank transfer",
        desc: "Virtual account (BCA, Mandiri, BNI, BRI)",
    },
    {
        id: "card",
        name: "Credit / debit card",
        desc: "Visa and Mastercard",
    },
    ];

    type MidtransAction = {
    name: string;
    method?: string;
    url: string;
    };

    type MidtransPayment = {
    transaction_id?: string;
    order_id?: string;
    transaction_status?: string;
    fraud_status?: string;
    payment_type?: string;
    gross_amount?: string;
    actions?: MidtransAction[];
    va_numbers?: {
        bank: string;
        va_number: string;
    }[];
    };

    export default function PaymentPage() {
    const {
        ready,
        items,
        subtotal,
        tax,
        total,
        table,
        note,
        clear,
    } = useCart();

    const [method, setMethod] = useState("qris");

    const [status, setStatus] = useState<
        "idle" | "processing" | "pending" | "paid"
    >("idle");

    const [orderRef, setOrderRef] = useState("");

    const [paymentData, setPaymentData] =
        useState<MidtransPayment | null>(null);

    async function handlePay(): Promise<void> {
        setStatus("processing");

        try {
        const response = await fetch("/api/payment/create", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            items,
            subtotal,
            tax,
            total,
            table,
            note,
            method,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Payment failed");
        }

        console.log("Payment created:", data);
        console.log("Midtrans payment:", data.payment);

        setOrderRef(data.orderId);

        // Save the payment response from Midtrans
        // so we can display QR / VA / payment links.
        setPaymentData(data.payment);

        // The transaction is created, but NOT paid yet.
        setStatus("pending");
        } catch (error) {
        console.error("Payment error:", error);

        setStatus("idle");

        alert(
            error instanceof Error
            ? error.message
            : "Failed to create payment."
        );
        }
    }

    /*
    * PAYMENT SUCCESS
    *
    * This will be used later when the Midtrans webhook
    * confirms that the payment is actually successful.
    */
    if (status === "paid") {
        return (
        <>
            <PageHeader
            title="Payment"
            backHref="/"
            backLabel="Back to menu"
            />

            <main className="center-state">
            <div className="check">
                <CheckIcon />
            </div>

            <h1>Thank you!</h1>

            <p>
                Order {orderRef} is confirmed. We&rsquo;ll bring
                it to table {table} shortly.
            </p>

            <Link
                href="/"
                className="secondary-btn"
                onClick={clear}
            >
                Back to menu
            </Link>
            </main>
        </>
        );
    }

    /*
    * PAYMENT CREATED / WAITING FOR PAYMENT
    */
    if (status === "pending") {
        const qrAction = paymentData?.actions?.find(
        (action) =>
            action.name === "generate-qr-code-v2" ||
            action.name === "generate-qr-code"
        );

        const vaNumber = paymentData?.va_numbers?.[0]?.va_number;
        const vaBank = paymentData?.va_numbers?.[0]?.bank;

        const paymentActions = paymentData?.actions || [];

        return (
        <>
            <PageHeader
            title="Payment"
            backHref="/checkout"
            backLabel="Back to basket"
            />

            <main className="narrow">
            {/* ORDER INFORMATION */}
            <section className="section">
                <h2>Payment created</h2>

                <div className="summary">
                <div className="summary__row">
                    <span>Order ID</span>
                    <strong>{orderRef}</strong>
                </div>

                <div className="summary__row">
                    <span>Total</span>
                    <strong>{formatRupiah(total)}</strong>
                </div>

                <div className="summary__row">
                    <span>Table</span>
                    <span>{table}</span>
                </div>
                </div>
            </section>

            {/* QRIS */}
            {method === "qris" && qrAction && (
                <section className="section">
                <h2>Scan QRIS</h2>

                <p className="hint">
                    Scan this QR code using your banking or
                    e-wallet application.
                </p>

                <div
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 24,
                    marginBottom: 24,
                    }}
                >
                    <img
                    src={qrAction.url}
                    alt="QRIS payment QR code"
                    style={{
                        width: 280,
                        height: 280,
                        objectFit: "contain",
                        border: "1px solid #e5e5e5",
                        borderRadius: 12,
                        padding: 12,
                        background: "#fff",
                    }}
                    />
                </div>

                <p
                    className="hint"
                    style={{ textAlign: "center" }}
                >
                    After completing the payment, the payment
                    status will be updated automatically.
                </p>
                </section>
            )}

            {/* BANK TRANSFER / VIRTUAL ACCOUNT */}
            {method === "va" && vaNumber && (
                <section className="section">
                <h2>Virtual Account</h2>

                <p className="hint">
                    Transfer the exact amount to the virtual
                    account below.
                </p>

                <div
                    style={{
                    marginTop: 20,
                    padding: 20,
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    background: "#fff",
                    }}
                >
                    <p
                    style={{
                        margin: 0,
                        fontSize: 14,
                        opacity: 0.7,
                    }}
                    >
                    Bank
                    </p>

                    <p
                    style={{
                        margin: "4px 0 20px",
                        fontSize: 20,
                        fontWeight: 600,
                        textTransform: "uppercase",
                    }}
                    >
                    {vaBank}
                    </p>

                    <p
                    style={{
                        margin: 0,
                        fontSize: 14,
                        opacity: 0.7,
                    }}
                    >
                    Virtual Account Number
                    </p>

                    <p
                    style={{
                        margin: "4px 0 0",
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: 1,
                    }}
                    >
                    {vaNumber}
                    </p>
                </div>

                <p
                    className="hint"
                    style={{
                    textAlign: "center",
                    marginTop: 20,
                    }}
                >
                    Pay {formatRupiah(total)} to this virtual
                    account. Your payment status will be updated
                    automatically after Midtrans confirms it.
                </p>
                </section>
            )}

            {/* E-WALLET */}
            {method === "ewallet" && (
                <section className="section">
                <h2>Complete your payment</h2>

                <p className="hint">
                    Continue the payment using the available
                    payment option below.
                </p>

                {paymentActions.length > 0 ? (
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        marginTop: 20,
                    }}
                    >
                    {paymentActions.map((action, index) => (
                        <a
                        key={`${action.name}-${index}`}
                        href={action.url}
                        target="_blank"
                        rel="noreferrer"
                        className="primary-btn"
                        style={{
                            textDecoration: "none",
                            textAlign: "center",
                            display: "block",
                        }}
                        >
                        Continue payment
                        </a>
                    ))}
                    </div>
                ) : (
                    <p className="hint">
                    Payment instructions are not available yet.
                    Check the browser console for the Midtrans
                    response.
                    </p>
                )}
                </section>
            )}

            {/* FALLBACK */}
            {method !== "qris" &&
                method !== "va" &&
                method !== "ewallet" && (
                <section className="section">
                    <h2>Payment created</h2>

                    <p className="hint">
                    Your payment transaction has been created.
                    </p>
                </section>
                )}

            {/* PAYMENT STATUS */}
            <section className="section">
                <p className="notice">
                Your payment is handled securely by Midtrans.
                Payment status will be updated automatically
                after Midtrans confirms the transaction.
                </p>
            </section>

            <Link
                href="/"
                className="secondary-btn"
                onClick={clear}
            >
                Back to menu
            </Link>
            </main>
        </>
        );
    }

    /*
    * WAIT FOR CART TO LOAD
    */
    if (!ready) {
        return (
        <PageHeader
            title="Payment"
            backHref="/checkout"
            backLabel="Back to basket"
        />
        );
    }

    /*
    * EMPTY CART
    */
    if (items.length === 0) {
        return (
        <>
            <PageHeader
            title="Payment"
            backHref="/"
            backLabel="Back to menu"
            />

            <main className="center-state">
            <Image
                src="/logo.png"
                alt=""
                width={498}
                height={284}
            />

            <h1>Nothing to pay yet</h1>

            <p>
                Your basket is empty. Add something from the menu
                first.
            </p>

            <Link href="/" className="secondary-btn">
                Browse menu
            </Link>
            </main>
        </>
        );
    }

    /*
    * NORMAL PAYMENT PAGE
    */
    return (
        <>
        <PageHeader
            title="Payment"
            backHref="/checkout"
            backLabel="Back to basket"
        />

        <main className="narrow">
            {/* ORDER SUMMARY */}
            <section
            className="section"
            aria-labelledby="order-title"
            >
            <h2 id="order-title">Your order</h2>

            <div className="summary">
                {items.map((item) => (
                <div
                    className="summary__row"
                    key={item.productId}
                >
                    <span>
                    {item.qty} × {item.name}
                    </span>

                    <span>
                    {formatRupiah(
                        item.price * item.qty
                    )}
                    </span>
                </div>
                ))}

                <div
                className="summary__row"
                style={{ marginTop: 6 }}
                >
                <span>Subtotal</span>

                <span>{formatRupiah(subtotal)}</span>
                </div>

                <div className="summary__row">
                <span>
                    Tax ({Math.round(TAX_RATE * 100)}%)
                </span>

                <span>{formatRupiah(tax)}</span>
                </div>

                <div className="summary__row summary__row--total">
                <span>Total</span>

                <span>{formatRupiah(total)}</span>
                </div>
            </div>

            <p
                className="hint"
                style={{ textAlign: "left" }}
            >
                Table {table}
                {note ? ` · Note: ${note}` : ""}
            </p>
            </section>

            {/* PAYMENT METHOD */}
            <fieldset
            className="section"
            style={{
                border: 0,
                padding: 0,
                margin: 0,
                minWidth: 0,
            }}
            >
            <legend style={{ padding: 0 }}>
                <h2>Payment method</h2>
            </legend>

            <div className="methods">
                {METHODS.map((m) => (
                <label
                    className="method"
                    key={m.id}
                >
                    <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    />

                    <span
                    className="method__dot"
                    aria-hidden="true"
                    />

                    <span>
                    <span className="method__name">
                        {m.name}
                    </span>

                    <br />

                    <span className="method__desc">
                        {m.desc}
                    </span>
                    </span>
                </label>
                ))}
            </div>
            </fieldset>

            <p className="notice">
            Your payment is handled securely by our payment
            partner. We never see or store your card details.
            </p>
        </main>

        {/* PAY BUTTON */}
        <div className="footer-bar">
            <div className="footer-bar__inner">
            <button
                className="primary-btn"
                onClick={handlePay}
                disabled={status === "processing"}
            >
                {status === "processing"
                ? "Processing…"
                : `Pay ${formatRupiah(total)}`}
            </button>
            </div>
        </div>
        </>
    );
    }