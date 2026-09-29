    // Edit this file to change your menu.
    // `image` points to a file inside /public/products/. If the file is missing,
    // the card shows a cream placeholder with the Gupa logo instead.
    // Prices are in IDR (whole numbers, no dots).

    export type ProductCategory = "Food" | "Drinks" | "Snacks" | "Desserts";

    // The tabs shown under the search bar. "All" is not a real product category.
    export const categories: readonly ("All" | ProductCategory)[] = [
    "All",
    "Food",
    "Drinks",
    "Snacks",
    "Desserts",
    ];

    export type Product = {
    id: string;
    name: string;
    category: ProductCategory;
    price: number; // IDR
    description: string;
    image: string;
    };

    export const products: Product[] = [
    // ---------- Food ----------
    {
        id: "classic-beef-burger",
        name: "Classic Beef Burger",
        category: "Food",
        price: 58000,
        description: "Grilled beef patty, cheddar, pickles and house sauce in a toasted bun.",
        image: "/products/classic-beef-burger.jpg",
    },
    {
        id: "crispy-chicken-burger",
        name: "Crispy Chicken Burger",
        category: "Food",
        price: 52000,
        description: "Buttermilk fried chicken, slaw and honey mustard.",
        image: "/products/crispy-chicken-burger.jpg",
    },
    {
        id: "club-sandwich",
        name: "Club Sandwich",
        category: "Food",
        price: 48000,
        description: "Smoked chicken, egg, lettuce and tomato on toasted bread.",
        image: "/products/club-sandwich.jpg",
    },
    {
        id: "aglio-olio",
        name: "Spaghetti Aglio Olio",
        category: "Food",
        price: 45000,
        description: "Garlic, chili flakes and olive oil. Add shrimp for Rp 15.000.",
        image: "/products/aglio-olio.jpg",
    },

    // ---------- Drinks ----------
    {
        id: "es-kopi-gula-aren",
        name: "Es Kopi Gula Aren",
        category: "Drinks",
        price: 28000,
        description: "Espresso, fresh milk and palm sugar over ice.",
        image: "/products/es-kopi-gula-aren.jpg",
    },
    {
        id: "americano",
        name: "Americano",
        category: "Drinks",
        price: 24000,
        description: "Double espresso with hot water. Also available iced.",
        image: "/products/americano.jpg",
    },
    {
        id: "cafe-latte",
        name: "Cafe Latte",
        category: "Drinks",
        price: 30000,
        description: "Smooth espresso with steamed milk.",
        image: "/products/cafe-latte.jpg",
    },
    {
        id: "matcha-latte",
        name: "Matcha Latte",
        category: "Drinks",
        price: 32000,
        description: "Ceremonial grade matcha whisked with milk.",
        image: "/products/matcha-latte.jpg",
    },
    {
        id: "lemon-tea",
        name: "Iced Lemon Tea",
        category: "Drinks",
        price: 20000,
        description: "Black tea with fresh lemon. Light and refreshing.",
        image: "/products/lemon-tea.jpg",
    },

    // ---------- Snacks ----------
    {
        id: "french-fries",
        name: "French Fries",
        category: "Snacks",
        price: 26000,
        description: "Crispy shoestring fries with truffle mayo.",
        image: "/products/french-fries.jpg",
    },
    {
        id: "chicken-wings",
        name: "Chicken Wings",
        category: "Snacks",
        price: 38000,
        description: "Six wings, glazed in sweet soy or spicy buffalo.",
        image: "/products/chicken-wings.jpg",
    },
    {
        id: "butter-croissant",
        name: "Butter Croissant",
        category: "Snacks",
        price: 22000,
        description: "Flaky, baked fresh every morning.",
        image: "/products/butter-croissant.jpg",
    },

    // ---------- Desserts ----------
    {
        id: "banana-bread",
        name: "Banana Bread",
        category: "Desserts",
        price: 24000,
        description: "Moist banana loaf with a hint of cinnamon.",
        image: "/products/banana-bread.jpg",
    },
    {
        id: "tiramisu",
        name: "Tiramisu",
        category: "Desserts",
        price: 36000,
        description: "Espresso-soaked ladyfingers with mascarpone cream.",
        image: "/products/tiramisu.jpg",
    },
    ];