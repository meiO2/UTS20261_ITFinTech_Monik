    import type { AppProps } from "next/app";
    import Head from "next/head";
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
            <meta name="description" content="Order food and drinks from your table at Gupa Coffee." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />
        </Head>
        <div className={`app-root ${display.variable} ${body.variable}`}>
            <Component {...pageProps} />
        </div>
        </CartProvider>
    );
    }