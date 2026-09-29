  "use client";

  import { useMemo, useState } from "react";
  import Link from "next/link";
  import Header from "../components/Header";
  import ProductCard from "../components/ProductCard";
  import { SearchIcon } from "../components/Icons";
  import { categories, products } from "../data/products";
  import { useCart } from "../context/CartContext";
  import { formatRupiah } from "../lib/format";

  export default function MenuPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<string>("All");
    const { count, subtotal, ready } = useCart();

    const visible = useMemo(() => {
      const q = query.trim().toLowerCase();
      return products.filter((p) => {
        const inCategory = category === "All" || p.category === category;
        const matches =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        return inCategory && matches;
      });
    }, [query, category]);

    return (
      <>
        <Header />

        <main className="container">
          <div className="menu-intro">
            <h1>What would you like today?</h1>
            <p>Pick your items and we&rsquo;ll bring them to your table.</p>
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
              visible.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="empty">
                <strong>Nothing matches &ldquo;{query}&rdquo;</strong>
                Try a different word, or switch the category to All.
              </div>
            )}
          </section>
        </main>

        {ready && count > 0 && (
          <div className="basket-bar">
            <Link href="/checkout">
              <span>
                View basket · {count} {count === 1 ? "item" : "items"}
              </span>
              <span>{formatRupiah(subtotal)}</span>
            </Link>
          </div>
        )}
      </>
    );
  }