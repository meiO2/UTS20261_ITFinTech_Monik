    import { useEffect, useState } from "react";
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
        name: "GoPay",
        desc: "Pay using GoPay",
    },
    {
        id: "va",
        name: "Bank transfer",
        desc: "Virtual account (BCA, BNI, BRI)",
    },
    ];

    // Banks the customer can choose for bank transfer.
    // The chosen id is sent to /api/payment/create as `bank`.
    const BANKS = [
    { id: "bca", name: "BCA" },
    { id: "bni", name: "BNI" },
    { id: "bri", name: "BRI" },
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
    const { ready, items, subtotal, tax, total, table, note, clear } = useCart();

    const [method, setMethod] = useState("qris");
    const [bank, setBank] = useState("bca");

    const [status, setStatus] = useState<
        "idle" | "processing" | "pending" | "paid"
    >("idle");

    const [orderRef, setOrderRef] = useState("");

    const [paymentData, setPaymentData] = useState<MidtransPayment | null>(null);

    /*
    * AUTOMATIC PAYMENT STATUS CHECK
    *
    * Only runs after a payment transaction has been created.
    * Checks the backend every 3 seconds.
    *
    * MongoDB:
    * PENDING -> LUNAS
    *
    * When LUNAS is detected, the interface automatically
    * changes to the success screen.
    */
    useEffect(() => {
        if (status !== "pending" || !orderRef) {
        return;
        }

        let isActive = true;

        async function checkPaymentStatus() {
        try {
            const response = await fetch(
            `/api/payment/status?orderId=${encodeURIComponent(orderRef)}`,
            {
                cache: "no-store",
            }
            );

            if (!response.ok) {
            return;
            }

            const data = await response.json();

            console.log("Payment status:", data);

            if (isActive && data.status === "LUNAS") {
            setStatus("paid");
            }
        } catch (error) {
            console.error("Failed to check payment status:", error);
        }
        }

        // Check immediately
        checkPaymentStatus();

        // Check every 3 seconds
        const interval = setInterval(checkPaymentStatus, 3000);

        return () => {
        isActive = false;
        clearInterval(interval);
        };
    }, [status, orderRef]);

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
            bank: method === "va" ? bank : undefined,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Payment failed");
        }

        console.log("Payment created:", data);
        console.log("Midtrans payment:", data.payment);

        setOrderRef(data.orderId);

        setPaymentData(data.payment);

        // Transaction created, waiting for customer payment.
        setStatus("pending");
        } catch (error) {
        console.error("Payment error:", error);

        setStatus("idle");

        alert(
            error instanceof Error ? error.message : "Failed to create payment."
        );
        }
    }

    /*
    * PAYMENT SUCCESS
    */
    if (status === "paid") {
        return (
        <>
            <PageHeader title="Payment" backHref="/" backLabel="Back to menu" />

            <main className="center-state">
            <div className="check">
                <CheckIcon />
            </div>

            <h1>Thank you!</h1>

            <p>
                Order {orderRef} is confirmed. We&rsquo;ll bring it to table {table}{" "}
                shortly.
            </p>

            <Link href="/" className="secondary-btn" onClick={clear}>
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

        /*
        * For GoPay, only use the deeplink action.
        * Midtrans returns multiple actions, so we must NOT
        * render all of them as buttons.
        */
        const paymentAction = paymentData?.actions?.find(
        (action) => action.name === "deeplink-redirect"
        );

        // Same QR image is used for QRIS and GoPay
        const qrBox = qrAction ? (
        <div
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 24,
            marginBottom: 24,
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
            src={qrAction.url}
            alt="Payment QR code"
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
        ) : null;

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
                    Scan this QR code using your banking or e-wallet application.
                </p>

                {qrBox}

                <p
                    className="hint"
                    style={{
                    textAlign: "center",
                    }}
                >
                    After completing the payment, the payment status will be
                    updated automatically.
                </p>
                </section>
            )}

            {/* BANK TRANSFER / VIRTUAL ACCOUNT */}
            {method === "va" && vaNumber && (
                <section className="section">
                <h2>Virtual Account</h2>

                <p className="hint">
                    Transfer the exact amount to the virtual account below.
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
                    Pay {formatRupiah(total)} to this virtual account. Your payment
                    status will be updated automatically after Midtrans confirms
                    it.
                </p>
                </section>
            )}

            {/* GOPAY */}
            {method === "ewallet" && (
                <section className="section">
                <h2>Scan with GoPay</h2>

                <p className="hint">
                    Open the GoPay or Gojek app, tap Pay, and scan this QR code.
                </p>

                {qrBox ?? (
                    <p className="hint" style={{ marginTop: 20 }}>
                    QR code is not available yet.
                    </p>
                )}

                {/* Only useful when the customer pays from the same phone */}
                {paymentAction && (
                    <div style={{ textAlign: "center", marginTop: 4 }}>
                    <p className="hint">Paying from this phone?</p>

                    <a
                        href={paymentAction.url}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-btn"
                        style={{ marginTop: 12 }}
                    >
                        Open GoPay app
                    </a>
                    </div>
                )}

                <p
                    className="hint"
                    style={{
                    textAlign: "center",
                    marginTop: 20,
                    }}
                >
                    After completing the payment, your payment status will be
                    updated automatically.
                </p>
                </section>
            )}

            {/* FALLBACK */}
            {method !== "qris" && method !== "va" && method !== "ewallet" && (
                <section className="section">
                <h2>Payment created</h2>

                <p className="hint">Your payment transaction has been created.</p>
                </section>
            )}

            {/* PAYMENT STATUS */}
            <section className="section">
                <p className="notice">
                Your payment is handled securely by Midtrans. Payment status will
                be updated automatically after Midtrans confirms the transaction.
                </p>
            </section>

            <Link href="/" className="secondary-btn" onClick={clear}>
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
            <PageHeader title="Payment" backHref="/" backLabel="Back to menu" />

            <main className="center-state">
            <Image src="/logo.png" alt="" width={498} height={284} />

            <h1>Nothing to pay yet</h1>

            <p>Your basket is empty. Add something from the menu first.</p>

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
            <section className="section" aria-labelledby="order-title">
            <h2 id="order-title">Your order</h2>

            <div className="summary">
                {items.map((item) => (
                <div className="summary__row" key={item.productId}>
                    <span>
                    {item.qty} × {item.name}
                    </span>

                    <span>{formatRupiah(item.price * item.qty)}</span>
                </div>
                ))}

                <div className="summary__row" style={{ marginTop: 6 }}>
                <span>Subtotal</span>

                <span>{formatRupiah(subtotal)}</span>
                </div>

                <div className="summary__row">
                <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>

                <span>{formatRupiah(tax)}</span>
                </div>

                <div className="summary__row summary__row--total">
                <span>Total</span>

                <span>{formatRupiah(total)}</span>
                </div>
            </div>

            <p
                className="hint"
                style={{
                textAlign: "left",
                }}
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
            <legend
                style={{
                padding: 0,
                }}
            >
                <h2>Payment method</h2>
            </legend>

            <div className="methods">
                {METHODS.map((m) => (
                <label className="method" key={m.id}>
                    <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    />

                    <span className="method__dot" aria-hidden="true" />

                    <span>
                    <span className="method__name">{m.name}</span>

                    <br />

                    <span className="method__desc">{m.desc}</span>
                    </span>
                </label>
                ))}
            </div>

            {/* Bank choice, only for bank transfer */}
            {method === "va" && (
                <div style={{ marginTop: 20 }}>
                <p
                    style={{
                    margin: "0 0 10px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    }}
                >
                    Choose your bank
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {BANKS.map((b) => (
                    <button
                        key={b.id}
                        type="button"
                        className="tab"
                        aria-pressed={bank === b.id}
                        onClick={() => setBank(b.id)}
                    >
                        {b.name}
                    </button>
                    ))}
                </div>
                </div>
            )}
            </fieldset>

            <p className="notice">
            Your payment is handled securely by our payment partner.
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
                {status === "processing" ? "Processing…" : `Pay ${formatRupiah(total)}`}
            </button>
            </div>
        </div>
        </>
    );
    }