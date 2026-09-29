    "use client";

    import { useEffect, useState } from "react";
    import Image from "next/image";
    import Link from "next/link";
    import { useCart } from "../context/CartContext";
    import { BasketIcon, CloseIcon, MenuIcon } from "./Icons";

    export default function Header() {
    const [open, setOpen] = useState(false);
    const { count, ready } = useCart();

    // Close the side menu with the Escape key
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
        <header className="header">
            <div className="container header__inner">
            <button
                className="icon-btn"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
            >
                <MenuIcon />
            </button>

            <Link href="/" className="header__logo" aria-label="Gupa Coffee home">
                <Image
                src="/logo.png"
                alt="Gupa Coffee"
                width={498}
                height={284}
                priority
                />
            </Link>

            <Link
                href="/checkout"
                className="icon-btn"
                aria-label={`Basket, ${ready ? count : 0} items`}
            >
                <BasketIcon />
                {ready && count > 0 && <span className="badge">{count}</span>}
            </Link>
            </div>
        </header>

        {open && (
            <>
            <div className="drawer-overlay" onClick={() => setOpen(false)} />
            <aside className="drawer" aria-label="Menu">
                <div className="drawer__top">
                <Image src="/logo.png" alt="Gupa Coffee" width={498} height={284} />
                <button
                    className="icon-btn"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                >
                    <CloseIcon />
                </button>
                </div>

                <Link href="/" className="drawer__link" onClick={() => setOpen(false)}>
                Menu
                </Link>
                <Link
                href="/checkout"
                className="drawer__link"
                onClick={() => setOpen(false)}
                >
                My basket
                {ready && count > 0 && <span className="badge" style={{ position: "static" }}>{count}</span>}
                </Link>
            </aside>
            </>
        )}
        </>
    );
    }