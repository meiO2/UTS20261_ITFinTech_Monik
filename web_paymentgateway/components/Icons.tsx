    // Small inline SVG icons (no icon library needed)

    const base: React.SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    };

    export const MenuIcon = () => (
    <svg {...base}>
        <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
    );

    export const CloseIcon = () => (
    <svg {...base}>
        <path d="M6 6l12 12M18 6L6 18" />
    </svg>
    );

    export const BasketIcon = () => (
    <svg {...base}>
        <path d="M5 9h14l-1.4 9.1a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5 9z" />
        <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
    );

    export const SearchIcon = () => (
    <svg {...base}>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
    </svg>
    );

    export const BackIcon = () => (
    <svg {...base}>
        <path d="M15 5l-7 7 7 7" />
    </svg>
    );

    export const CheckIcon = () => (
    <svg {...base}>
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
    );