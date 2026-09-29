    // Edit this file to change your menu.
    // `image` is a full web link, e.g. "https://images.unsplash.com/photo-....?w=800".
    // Leave it as "" (or if the link breaks) and the card shows a cream
    // placeholder with the Gupa logo instead.
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
    image?: string; // full https:// link to a photo
    };

    export const products: Product[] = [
    // ---------- Food ----------
    {
        id: "classic-beef-burger",
        name: "Classic Beef Burger",
        category: "Food",
        price: 58000,
        description: "Grilled beef patty, cheddar, pickles and house sauce in a toasted bun.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhr18jYhMdi-HIXS8ziOm9GhkEetbqbohmefEopzndKErUwB1uEIjnQIg&s=10", // paste an image link here
    },
    {
        id: "crispy-chicken-burger",
        name: "Crispy Chicken Burger",
        category: "Food",
        price: 52000,
        description: "Buttermilk fried chicken, slaw and honey mustard.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMZicEhqSMp1cakeKCvVVSp7VVeSjeatjISKvrvfR3F1QjkmaynXd_cGrA&s=10", // paste an image link here
    },
    {
        id: "club-sandwich",
        name: "Club Sandwich",
        category: "Food",
        price: 48000,
        description: "Smoked chicken, egg, lettuce and tomato on toasted bread.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKXaoEG-yF8nEYMnacTh4Dai-wHBRIbF1vBsuOI_J6857PcUJMgqbHR2Y&s=10", // paste an image link here
    },
    {
        id: "aglio-olio",
        name: "Spaghetti Aglio Olio",
        category: "Food",
        price: 45000,
        description: "Garlic, chili flakes and olive oil. Add shrimp for Rp 15.000.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGPRqbM03cbFvgU0R-gEhWB_l4LsVhEVfc-1Z9LymoVL3kgUtyxqX_K7Hg&s=10", // paste an image link here
    },

    // ---------- Drinks ----------
    {
        id: "es-kopi-gula-aren",
        name: "Es Kopi Gula Aren",
        category: "Drinks",
        price: 28000,
        description: "Espresso, fresh milk and palm sugar over ice.",
        image: "https://awsimages.detik.net.id/community/media/visual/2024/10/16/es-kopi-susu-gula-aren.jpeg?w=1200", // paste an image link here
    },
    {
        id: "americano",
        name: "Americano",
        category: "Drinks",
        price: 24000,
        description: "Double espresso with hot water. Also available iced.",
        image: "https://assets-a1.kompasiana.com/items/album/2023/01/15/homemade-iced-americano-recipe-1-720x1080-63c3e4d84addee7149048932.jpg?t=o&v=770", // paste an image link here
    },
    {
        id: "cafe-latte",
        name: "Cafe Latte",
        category: "Drinks",
        price: 30000,
        description: "Smooth espresso with steamed milk.",
        image: "https://www.cuisinart.com/dw/image/v2/ABAF_PRD/on/demandware.static/-/Sites-us-cuisinart-sfra-Library/default/dw42dcae51/images/recipe-Images/cafe-latte1-recipe_resized.jpg?sw=1200&sh=1200&sm=fit", // paste an image link here
    },
    {
        id: "matcha-latte",
        name: "Matcha Latte",
        category: "Drinks",
        price: 32000,
        description: "Ceremonial grade matcha whisked with milk.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIzBSL3X5BwZJV0WA3Rp_OGz89pOMVvE5BsQoOjfhDy-Hptv5ESTrDdDw&s=10", // paste an image link here
    },
    {
        id: "lemon-tea",
        name: "Iced Lemon Tea",
        category: "Drinks",
        price: 20000,
        description: "Black tea with fresh lemon. Light and refreshing.",
        image: "https://dcostseafood.id/wp-content/uploads/2021/12/ES-LEMON-TEA.jpg", // paste an image link here
    },

    // ---------- Snacks ----------
    {
        id: "french-fries",
        name: "French Fries",
        category: "Snacks",
        price: 26000,
        description: "Crispy shoestring fries with truffle mayo.",
        image: "https://detoxinista.com/wp-content/uploads/2021/03/best-homemade-fries.jpg", // paste an image link here
    },
    {
        id: "chicken-wings",
        name: "Chicken Wings",
        category: "Snacks",
        price: 38000,
        description: "Six wings, glazed in sweet soy or spicy buffalo.",
        image: "https://www.thecookierookie.com/wp-content/uploads/2024/02/bbq-chicken-wings-recipe-featured-image.jpg", // paste an image link here
    },
    {
        id: "butter-croissant",
        name: "Butter Croissant",
        category: "Snacks",
        price: 22000,
        description: "Flaky, baked fresh every morning.",
        image: "https://homemadehome.com/wp-content/uploads/2017/05/Authentic-All-Butter-Croissants-2-e1634143701147.jpg", // paste an image link here
    },

    // ---------- Desserts ----------
    {
        id: "banana-bread",
        name: "Banana Bread",
        category: "Desserts",
        price: 24000,
        description: "Moist banana loaf with a hint of cinnamon.",
        image: "https://www.allrecipes.com/thmb/fAkQn-FhjF89oTJ5JXpgwvwNf34=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20144-banana-banana-bread-VAT-009-4x3-B-78f1cfc64bfa451e8a0fead814719b9f.jpg", // paste an image link here
    },
    {
        id: "tiramisu",
        name: "Tiramisu",
        category: "Desserts",
        price: 36000,
        description: "Espresso-soaked ladyfingers with mascarpone cream.",
        image: "https://www.bunsenburnerbakery.com/wp-content/uploads/2016/06/easy-tiramisu-square-29-735x735.jpg", // paste an image link here
    },
    ];