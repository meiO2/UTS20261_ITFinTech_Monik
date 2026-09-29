    import { useState } from "react";

    export default function ProductImage({
    src,
    alt,
    }: {
    src?: string;
    alt: string;
    }) {
    const [failed, setFailed] = useState(false);

    if (failed || !src) {
        return (
        <div className="card__placeholder">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" />
        </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="product-image"
        />
    );
    }