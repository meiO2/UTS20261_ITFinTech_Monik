    import type { AppProps } from "next/app";
    import Head from "next/head";
    import Script from "next/script";
    import { Quicksand, Nunito_Sans } from "next/font/google";
    import "../styles/globals.css";
    import { CartProvider } from "../context/CartContext";

    // Quicksand is a rounded, monoline face close to the Gupa wordmark.
    const display = Quicksand({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-display",
    });

    const body = Nunito_Sans({
    subsets: ["latin"],
    variable: "--font-body",
    });

    export default function App({ Component, pageProps }: AppProps) {
    return (
        <CartProvider>
        <Head>
            <title>Gupa Coffee | Order at your table</title>

            <meta
            name="description"
            content="Order food and drinks from your table at Gupa Coffee."
            />

            <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
            />

            <meta name="theme-color" content="#ffffff" />
        </Head>

        <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            strategy="beforeInteractive"
        />

        <div className={`app-root ${display.variable} ${body.variable}`}>
            <Component {...pageProps} />
        </div>
        </CartProvider>
    );
    }