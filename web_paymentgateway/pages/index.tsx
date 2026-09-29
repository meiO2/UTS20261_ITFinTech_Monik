    import { useEffect, useMemo, useState } from "react";
    import Link from "next/link";
    import Header from "../components/Header";
    import ProductCard from "../components/ProductCard";
    import { SearchIcon } from "../components/Icons";
    import { useCart } from "../context/CartContext";
    import { formatRupiah } from "../lib/format";

    type Product = {
    productId: string;
    name: string;
    category: "Food" | "Drinks" | "Snacks" | "Desserts";
    price: number;
    description: string;
    image?: string;
    };

    export default function MenuPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<string>("All");
    const [products, setProducts] = useState<Product[]>([]);
    const { count, subtotal, ready } = useCart();

    useEffect(() => {
        async function fetchProducts() {
        try {
            const response = await fetch("/api/products");

            if (!response.ok) {
            throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products:", error);
        }
        }

        fetchProducts();
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
        new Set(products.map((product) => product.category))
        );

        return ["All", ...uniqueCategories];
    }, [products]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();

        return products.filter((p) => {
        const inCategory =
            category === "All" || p.category === category;

        const matches =
            !q ||
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);

        return inCategory && matches;
        });
    }, [products, query, category]);

    return (
        <>
        <Header />

        <main className="container">
            <div className="menu-intro">
            <h1>What would you like today?</h1>
            <p>
                Pick your items and we&rsquo;ll bring them to your table.
            </p>
            </div>

            <div className="search">
            <SearchIcon />

            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food or drinks"
                aria-label="Search the menu"
            />
            </div>

            <nav className="tabs" aria-label="Menu categories">
            <div className="tabs__row">
                {categories.map((c) => (
                <button
                    key={c}
                    className="tab"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                >
                    {c}
                </button>
                ))}
            </div>
            </nav>

            <section className="grid" aria-live="polite">
            {visible.length > 0 ? (
                visible.map((p) => (
                <ProductCard
                    key={p.productId}
                    product={p}
                />
                ))
            ) : (
                <div className="empty">
                <strong>
                    Nothing matches &ldquo;{query}&rdquo;
                </strong>
                Try a different word, or switch the category to All.
                </div>
            )}
            </section>
        </main>

        {ready && count > 0 && (
            <div className="basket-bar">
            <Link href="/checkout">
                <span>
                View basket · {count}{" "}
                {count === 1 ? "item" : "items"}
                </span>

                <span>{formatRupiah(subtotal)}</span>
            </Link>
            </div>
        )}
        </>
    );
    }