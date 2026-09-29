    import Link from "next/link";
    import { BackIcon } from "./Icons";

    // Simple header for the checkout and payment pages: back arrow + title.
    type PageHeaderProps = {
    title: string;
    backHref: string;
    backLabel: string;
    };

    export default function PageHeader({ title, backHref, backLabel }: PageHeaderProps) {
    return (
        <header className="header header--page">
        <div className="container header__inner">
            <Link href={backHref} className="icon-btn" aria-label={backLabel}>
            <BackIcon />
            </Link>
            <h1 className="page-title">{title}</h1>
        </div>
        </header>
    );
    }