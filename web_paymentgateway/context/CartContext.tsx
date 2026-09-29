    "use client";

    import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
    } from "react";
    import { products, type Product } from "../data/products";
    import { TAX_RATE } from "../lib/format";

    export type CartItem = Product & { qty: number };

    type CartContextValue = {
    ready: boolean;
    items: CartItem[];
    quantities: Record<string, number>;
    count: number;
    subtotal: number;
    tax: number;
    total: number;
    table: string;
    setTable: (value: string) => void;
    note: string;
    setNote: (value: string) => void;
    add: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
    };

    const CartContext = createContext<CartContextValue | null>(null);
    const STORAGE_KEY = "gupa-order-v1";

    export function CartProvider({ children }: { children: ReactNode }) {
    const [quantities, setQuantities] = useState<Record<string, number>>({}); // { productId: qty }
    const [table, setTable] = useState("");
    const [note, setNote] = useState("");
    const [ready, setReady] = useState(false);

    // Load saved basket (so a refresh doesn't empty it)
    useEffect(() => {
        try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            setQuantities(saved.quantities || {});
            setTable(saved.table || "");
            setNote(saved.note || "");
        }
        } catch {}
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ quantities, table, note })
        );
        } catch {}
    }, [quantities, table, note, ready]);

    const add = useCallback((id: string) => {
        setQuantities((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
    }, []);

    const remove = useCallback((id: string) => {
        setQuantities((q) => {
        const next = { ...q };
        if ((next[id] || 0) <= 1) delete next[id];
        else next[id] -= 1;
        return next;
        });
    }, []);

    const clear = useCallback(() => {
        setQuantities({});
        setNote("");
    }, []);

    const value = useMemo<CartContextValue>(() => {
        const items = products
        .filter((p) => quantities[p.id] > 0)
        .map((p): CartItem => ({ ...p, qty: quantities[p.id] }));
        const count = items.reduce((n, i) => n + i.qty, 0);
        const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const tax = Math.round(subtotal * TAX_RATE);
        const total = subtotal + tax;

        return {
        ready,
        items,
        quantities,
        count,
        subtotal,
        tax,
        total,
        table,
        setTable,
        note,
        setNote,
        add,
        remove,
        clear,
        };
    }, [quantities, table, note, ready, add, remove, clear]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
    }

    export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
    }