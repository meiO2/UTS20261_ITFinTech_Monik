    "use client";

    import { useState } from "react";

    // Shows the product photo. If the file doesn't exist yet, shows a cream
    // tile with the Gupa logo so the layout still looks finished.
    export default function ProductImage({ src, alt }: { src?: string; alt: string }) {
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
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    );
    }