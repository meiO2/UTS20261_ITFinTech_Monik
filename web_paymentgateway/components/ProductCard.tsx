    import { useCart } from "../context/CartContext";
    import { formatRupiah } from "../lib/format";
    import ProductImage from "./ProductImage";
    import QtyStepper from "./QtyStepper";

    type Product = {
    productId: string;
    name: string;
    category: "Food" | "Drinks" | "Snacks" | "Desserts";
    price: number;
    description: string;
    image?: string;
    };

    export default function ProductCard({ product }: { product: Product }) {
    const { quantities, add, remove } = useCart();

    const qty = quantities[product.productId] || 0;

    return (
        <article className="card">
        <div className="card__media">
            <ProductImage
            src={product.image}
            alt={product.name}
            />
        </div>

        <div className="card__body">
            <h3 className="card__name">{product.name}</h3>

            <p className="card__desc">
            {product.description}
            </p>

            <div className="card__foot">
            <span className="price">
                {formatRupiah(product.price)}
            </span>

            {qty === 0 ? (
                <button
                className="add-btn"
                onClick={() => add(product.productId)}
                aria-label={`Add ${product.name} to basket`}
                >
                Add
                </button>
            ) : (
                <QtyStepper
                name={product.name}
                qty={qty}
                onAdd={() => add(product.productId)}
                onRemove={() => remove(product.productId)}
                />
            )}
            </div>
        </div>
        </article>
    );
    }