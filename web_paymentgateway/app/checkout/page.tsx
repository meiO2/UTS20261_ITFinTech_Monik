    "use client";

    import Image from "next/image";
    import Link from "next/link";
    import { useRouter } from "next/navigation";
    import PageHeader from "../../components/PageHeader";
    import ProductImage from "../../components/ProductImage";
    import QtyStepper from "../../components/QtyStepper";
    import { useCart } from "../../context/CartContext";
    import { TAX_RATE, formatRupiah } from "../../lib/format";

    export default function CheckoutPage() {
    const router = useRouter();
    const {
        ready,
        items,
        subtotal,
        tax,
        total,
        table,
        setTable,
        note,
        setNote,
        add,
        remove,
    } = useCart();

    const canContinue = items.length > 0 && table.trim().length > 0;

    // Wait for the saved basket to load so we don't flash "empty"
    if (!ready) {
        return <PageHeader title="Your basket" backHref="/" backLabel="Back to menu" />;
    }

    if (items.length === 0) {
        return (
        <>
            <PageHeader title="Your basket" backHref="/" backLabel="Back to menu" />
            <main className="center-state">
            <Image src="/logo.png" alt="" width={498} height={284} />
            <h1>Your basket is empty</h1>
            <p>Add a drink or a bite from the menu to get started.</p>
            <Link href="/" className="secondary-btn">
                Browse menu
            </Link>
            </main>
        </>
        );
    }

    return (
        <>
        <PageHeader title="Your basket" backHref="/" backLabel="Back to menu" />

        <main className="narrow">
            <section className="section" aria-labelledby="items-title">
            <h2 id="items-title">Your items</h2>
            <div>
                {items.map((item) => (
                <div className="line-item" key={item.id}>
                    <div className="line-item__thumb">
                    <ProductImage src={item.image} alt={item.name} />
                    </div>
                    <div className="line-item__info">
                    <p className="line-item__name">{item.name}</p>
                    <p className="line-item__price">
                        {formatRupiah(item.price * item.qty)}
                    </p>
                    </div>
                    <QtyStepper
                    name={item.name}
                    qty={item.qty}
                    onAdd={() => add(item.id)}
                    onRemove={() => remove(item.id)}
                    />
                </div>
                ))}
            </div>
            </section>

            <section className="section">
            <h2>Order details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="field">
                <label htmlFor="table">Table number</label>
                <input
                    id="table"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    inputMode="numeric"
                    placeholder="e.g. 12"
                    autoComplete="off"
                />
                <small>You can find it on the small stand on your table.</small>
                </div>

                <div className="field">
                <label htmlFor="note">Notes for the kitchen (optional)</label>
                <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Less ice, no onions, extra sauce…"
                />
                </div>
            </div>
            </section>

            <section className="section" aria-labelledby="summary-title">
            <h2 id="summary-title">Summary</h2>
            <div className="summary">
                <div className="summary__row">
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
            </section>
        </main>

        <div className="footer-bar">
            <div className="footer-bar__inner">
            <button
                className="primary-btn"
                disabled={!canContinue}
                onClick={() => router.push("/payment")}
            >
                Continue to payment
            </button>
            {!canContinue && (
                <p className="hint">Enter your table number to continue.</p>
            )}
            </div>
        </div>
        </>
    );
    }