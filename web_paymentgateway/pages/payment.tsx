    import { useState } from "react";
    import Image from "next/image";
    import Link from "next/link";
    import PageHeader from "../components/PageHeader";
    import { CheckIcon } from "../components/Icons";
    import { useCart } from "../context/CartContext";
    import { TAX_RATE, formatRupiah } from "../lib/format";

    // Edit this list to match the methods your payment gateway supports.
    const METHODS = [
    { id: "qris", name: "QRIS", desc: "Scan with any banking or e-wallet app" },
    { id: "ewallet", name: "E-wallet", desc: "GoPay, OVO, DANA, ShopeePay" },
    { id: "va", name: "Bank transfer", desc: "Virtual account (BCA, Mandiri, BNI, BRI)" },
    { id: "card", name: "Credit / debit card", desc: "Visa and Mastercard" },
    ];

    export default function PaymentPage() {
    const { ready, items, subtotal, tax, total, table, note, clear } = useCart();
    const [method, setMethod] = useState("qris");
    const [status, setStatus] = useState<"idle" | "processing" | "paid">("idle");
    const [orderRef, setOrderRef] = useState("");

    async function handlePay(): Promise<void> {
        setStatus("processing");

        // ------------------------------------------------------------------
        // TODO: connect your payment gateway here.
        // Typical flow:
        //   1. POST the order to your own API route (e.g. /api/payments) with
        //      { items, table, note, method }.
        //   2. Your server creates the transaction with the gateway and returns
        //      a payment URL / QR string / token.
        //   3. Show that to the customer (or redirect), then confirm the result
        //      through the gateway's webhook.
        //
        // The lines below only SIMULATE a successful payment so you can see
        // the confirmation screen. Delete them when you connect the gateway.
        // ------------------------------------------------------------------
        await new Promise((r) => setTimeout(r, 1200));
        setOrderRef("GUPA-" + Math.floor(1000 + Math.random() * 9000));
        setStatus("paid");
    }

    // Confirmation screen
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
                Order {orderRef} is confirmed. We&rsquo;ll bring it to table {table} shortly.
            </p>
            <Link href="/" className="secondary-btn" onClick={clear}>
                Back to menu
            </Link>
            </main>
        </>
        );
    }

    if (!ready) {
        return <PageHeader title="Payment" backHref="/checkout" backLabel="Back to basket" />;
    }

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

    return (
        <>
        <PageHeader title="Payment" backHref="/checkout" backLabel="Back to basket" />

        <main className="narrow">
            <section className="section" aria-labelledby="order-title">
            <h2 id="order-title">Your order</h2>
            <div className="summary">
                {items.map((i) => (
                <div className="summary__row" key={i.id}>
                    <span>
                    {i.qty} × {i.name}
                    </span>
                    <span>{formatRupiah(i.price * i.qty)}</span>
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
            <p className="hint" style={{ textAlign: "left" }}>
                Table {table}
                {note ? ` · Note: ${note}` : ""}
            </p>
            </section>

            <fieldset
            className="section"
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
            >
            <legend style={{ padding: 0 }}>
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
            </fieldset>

            <p className="notice">
            Your payment is handled securely by our payment partner. We never see
            or store your card details.
            </p>
        </main>

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