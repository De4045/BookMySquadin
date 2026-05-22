export interface EditorialArticle {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readTime: string;
  heroImage: string;
  cardImage: string;
  content: Array<{ heading: string; body: string }>;
  highlights: string[];
  gallery: string[];
  relatedSlugs: string[];
}

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    slug: "top-luxury-wedding-venues-in-jaipur",
    category: "Destination Weddings",
    title: "Top Luxury Wedding Venues in Jaipur for Royal Celebrations",
    subtitle: "Explore heritage palaces, luxury resorts, and royal venues redefining destination weddings in Rajasthan.",
    excerpt: "Discover heritage palaces, luxury resorts, and grand venues redefining destination weddings in Rajasthan.",
    date: "May 20, 2026",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "Why Jaipur remains a luxury wedding destination",
        body: "Jaipur still sets the gold standard for destination celebrations. Heritage palaces, private courtyards, and bespoke hospitality create a canvas for ceremonies that feel regal and intimate at once."
      },
      {
        heading: "Palace wedding trends",
        body: "Modern couples are pairing traditional mandaps with cinematic lighting, seasonal florals, and soft jewel tones. This blend of old-world grandeur and contemporary refinement keeps every celebration feeling fresh."
      },
      {
        heading: "Luxury guest experiences",
        body: "From arrival rituals in vintage cars to curated tasting menus and artisanal welcome gifts, the most memorable weddings in Jaipur focus on hospitality that feels personal and polished."
      },
      {
        heading: "Decor inspirations",
        body: "Candlelit pathways, hand-painted murals, and heritage textiles transform even the grandest palace halls into warm, editorial spaces designed for storytelling."
      },
    ],
    highlights: [
      "Best Season: October – February",
      "Ideal Guest Count: 150–500",
      "Style: Royal Heritage",
      "Popular Cities: Jaipur, Udaipur, Jodhpur",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
      "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=80",
    ],
    relatedSlugs: [
      "luxury-goa-weddings",
      "poolside-wedding-inspirations",
      "heritage-wedding-decor-ideas",
    ],
  },
  {
    slug: "poolside-wedding-inspirations",
    category: "Event Styling",
    title: "Elegant Poolside Wedding Inspirations for Modern Couples",
    subtitle: "Explore sophisticated décor themes, lighting concepts, and venue styling ideas for luxury poolside ceremonies.",
    excerpt: "Explore sophisticated décor themes, lighting concepts, and venue styling ideas for luxury poolside ceremonies.",
    date: "May 18, 2026",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1491933382244-1d95d1de5c8f?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "The quiet luxury of poolside styling",
        body: "A refined poolside celebration uses layered textures, candlelight, and sculptural florals to create a scene that is chic and cinematic. Soft reflections on water add a natural shimmer without overwhelming the palette."
      },
      {
        heading: "Lighting and mood",
        body: "Golden hour ceremonies followed by lantern-lit dining feel intimate and editorial. Low-slung seating, floating blooms, and warm ambient glows keep the focus on experience."
      },
      {
        heading: "Bridal styling for resort settings",
        body: "Lightweight couture silhouettes, artisanal jewellery, and flowing veils photograph beautifully against a destination backdrop. The goal is effortless elegance with a luxurious sense of ease."
      },
    ],
    highlights: [
      "Location: Beach resorts & private villas",
      "Mood: Soft gold & mocha tones",
      "Décor: Floating candles, palms, couture florals",
      "Guest Experience: Sunset welcome cocktails",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80",
      "https://images.unsplash.com/photo-1499696011854-1b2deb7f7a4b?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
      "https://images.unsplash.com/photo-1499078405979-23bf5f8b2823?w=1200&q=80",
    ],
    relatedSlugs: [
      "luxury-goa-weddings",
      "modern-wedding-photography-styles",
      "bridal-fashion-trends-defining-2026-weddings",
    ],
  },
  {
    slug: "bridal-fashion-trends-defining-2026-weddings",
    category: "Bridal Inspirations",
    title: "Bridal Fashion Trends Defining 2026 Weddings",
    subtitle: "From timeless couture silhouettes to modern minimalist styling, discover bridal trends shaping contemporary weddings.",
    excerpt: "From timeless couture silhouettes to modern minimalist styling, discover bridal trends shaping contemporary weddings.",
    date: "May 16, 2026",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "Editorial couture for the modern bride",
        body: "2026 bridal fashion blends dramatic silhouettes with careful restraint. Soft embroidery, layered textures, and sculptural draping create looks that feel editorial rather than overly ornate."
      },
      {
        heading: "Cultural detail with contemporary polish",
        body: "Designers are honouring traditions through refined handwork and muted palettes. The result is a wardrobe that reads luxurious, timeless, and beautifully suited for destination celebrations."
      },
      {
        heading: "Jewelry and accessories",
        body: "Statement jewellery is paired with minimalist gowns to balance drama and elegance. Pearl chokers, delicate polkis, and heritage-inspired hairpieces elevate the overall narrative."
      },
    ],
    highlights: [
      "Silhouettes: Cape drapes, layered lehengas, sculpted sarees",
      "Palette: Ivory, gold, blush, deep jewel tones",
      "Accessories: Statement earrings, layered necklaces",
      "Shoes: Embellished heels for editorial portraits",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80",
      "https://images.unsplash.com/photo-1518199266795-7b7a8a1ea7f1?w=1200&q=80",
    ],
    relatedSlugs: [
      "luxury-wedding-decor-ideas",
      "heritage-wedding-decor-ideas",
      "modern-wedding-photography-styles",
    ],
  },
  {
    slug: "inside-indias-most-stunning-heritage-weddings",
    category: "Wedding Trends",
    title: "Inside India’s Most Stunning Heritage Weddings",
    subtitle: "Step inside palace celebrations, floral mandaps, and curated wedding experiences inspired by royal elegance.",
    excerpt: "Step inside palace celebrations, floral mandaps, and curated wedding experiences inspired by royal elegance.",
    date: "May 14, 2026",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1510761140171-4a36e2961c09?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "Why heritage venues feel cinematic",
        body: "Heritage locations offer layers of texture, history, and grand architecture. The most compelling weddings lean into these details while keeping the overall palette restrained and rich."
      },
      {
        heading: "Floral mandaps and tradition",
        body: "Flower designers are combining local blossoms with sculptural mandap shapes and subtle lighting. The result is a traditional ritual space with a journalistically beautiful frame."
      },
      {
        heading: "Curated guest rituals",
        body: "From private tea ceremonies to twilight receptions under ancient arches, every guest moment is designed to feel like part of an intimate yet luxurious narrative."
      },
    ],
    highlights: [
      "Venue Type: Palaces, forts, heritage hotels",
      "Decor: Fresh florals, artisanal canopies",
      "Mood: Warm gold, amber, candlelit",
      "Experience: Curated rituals & hospitality",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d56f9c?w=1200&q=80",
      "https://images.unsplash.com/photo-1515691997608-7416ad0e01c4?w=1200&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
      "https://images.unsplash.com/photo-1495686798-9a17677123f4?w=1200&q=80",
    ],
    relatedSlugs: [
      "top-luxury-wedding-venues-in-jaipur",
      "bridal-fashion-trends-defining-2026-weddings",
      "luxury-wedding-decor-ideas",
    ],
  },
  {
    slug: "luxury-wedding-decor-ideas",
    category: "Décor & Floral Design",
    title: "Luxury Wedding Décor Ideas That Create Cinematic Celebrations",
    subtitle: "Discover floral installations, candlelit aisles, and immersive décor concepts transforming modern wedding spaces.",
    excerpt: "Discover floral installations, candlelit aisles, and immersive décor concepts transforming modern wedding spaces.",
    date: "May 12, 2026",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1495697538036-4a1390e4fc19?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "Candlelight and storytelling",
        body: "Candlelit installations and soft amber glows create the atmosphere of a high-end editorial dinner. Paired with dramatic florals, they feel intimate without losing luxury scale."
      },
      {
        heading: "Floral installations with sculptural form",
        body: "Designers are using large floral arches, suspended gardens, and asymmetric arrangements to create depth and drama. These details photograph like a magazine spread."
      },
      {
        heading: "Minimal palettes, maximum impact",
        body: "Restrained palettes of ivory, gold, and deep green allow the details to stand out. The most premium décor schemes feel effortless, considered, and cinematic."
      },
    ],
    highlights: [
      "Key Elements: Candles, statement florals, textured linens",
      "Tone: Warm gold, ivory, natural green",
      "Best For: Intimate reception dinners",
      "Photography: Soft focus, editorial lighting",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    ],
    relatedSlugs: [
      "top-luxury-wedding-venues-in-jaipur",
      "poolside-wedding-inspirations",
      "inside-indias-most-stunning-heritage-weddings",
    ],
  },
  {
    slug: "luxury-goa-weddings",
    category: "Destination Weddings",
    title: "Best Destination Wedding Resorts in Goa for Premium Celebrations",
    subtitle: "Explore curated luxury resorts across North Goa and South Goa perfect for intimate and grand celebrations.",
    excerpt: "Explore curated luxury resorts across North Goa and South Goa perfect for intimate and grand celebrations.",
    date: "May 10, 2026",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "Goa for refined destination celebrations",
        body: "Goa’s luxury resorts offer a laid-back yet polished setting. Beachfront lawns, candlelit pool decks, and breezy pavilions make every moment feel like a polished travel editorial."
      },
      {
        heading: "Resort experiences with privacy",
        body: "Private villas, bespoke dining menus, and destination-level hospitality keep celebrations feeling intimate even with larger guest lists. It is luxury without the noise."
      },
      {
        heading: "Sunset moments and destination decor",
        body: "A sunset ceremony by the sea, under soft fabric canopies and sculptural florals, captures the dreamlike quality of a premium coastal wedding."
      },
    ],
    highlights: [
      "Region: North Goa & South Goa",
      "Mood: Coastal luxury, warm amber lighting",
      "Venue Type: Beach resorts, private estates",
      "Guest Experience: Welcome cocktails by the sea",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80",
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
    ],
    relatedSlugs: [
      "poolside-wedding-inspirations",
      "luxury-wedding-decor-ideas",
      "modern-wedding-photography-styles",
    ],
  },
  {
    slug: "the-art-of-curating-a-seamless-wedding-experience",
    category: "Planning Guides",
    title: "The Art of Curating a Seamless Wedding Experience",
    subtitle: "From guest hospitality to entertainment experiences, discover how luxury celebrations are thoughtfully designed.",
    excerpt: "From guest hospitality to entertainment experiences, discover how luxury celebrations are thoughtfully designed.",
    date: "May 8, 2026",
    readTime: "4 min read",
    heroImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "A seamless journey from arrival to farewell",
        body: "Luxury celebrations are defined by how effortless they feel. Thoughtful arrival experiences, welcome gestures, and guest flow all contribute to a celebration that feels polished and personal."
      },
      {
        heading: "Entertainment with intention",
        body: "Curated entertainment should feel cinematic without stealing the moment. Acoustic sets, intimate performances, and storytelling through programming make the celebration feel elevated."
      },
      {
        heading: "Hospitality details that matter",
        body: "From personalised welcome notes to bespoke menu cards, small touches create a sense of VIP care that guests remember long after the event."
      },
    ],
    highlights: [
      "Focus: Guest journey & hospitality",
      "Mood: Curated, calm, refined",
      "Style: Bespoke planning & premium details",
      "Benefit: Elevated experience with seamless flow",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1498426089153-c15e634951ac?w=1200&q=80",
      "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=80",
    ],
    relatedSlugs: [
      "top-luxury-wedding-venues-in-jaipur",
      "luxury-wedding-decor-ideas",
      "modern-wedding-photography-styles",
    ],
  },
  {
    slug: "modern-wedding-photography-styles",
    category: "Photography Stories",
    title: "Modern Wedding Photography Styles Couples Love",
    subtitle: "Editorial portraits, cinematic storytelling, and documentary-style photography redefining wedding memories.",
    excerpt: "Editorial portraits, cinematic storytelling, and documentary-style photography redefining wedding memories.",
    date: "May 6, 2026",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1499673610122-01c7122c5dcb?w=1600&q=80&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1518199266795-7b7a8a1ea7f1?w=1200&q=80&fit=crop",
    content: [
      {
        heading: "Editorial portraiture with depth",
        body: "The strongest photography stories feel cinematic and emotional. A premium wedding portfolio uses muted tones, rich textures, and carefully lit portraits to tell a cohesive story."
      },
      {
        heading: "Documentary moments reimagined",
        body: "Lighting, location, and timing are curated to feel natural while still producing striking imagery. Quiet moments between the couple and candid guest interactions are captured with grace."
      },
      {
        heading: "Style direction for couples",
        body: "From dramatic silhouettes to soft candlelit portraits, modern wedding photography leans into fashion-led direction while preserving the authenticity of the day."
      },
    ],
    highlights: [
      "Approach: Editorial, documentary, cinematic",
      "Tone: Soft gold, warm black, natural light",
      "Focus: Intimate portraits & emotional details",
      "Best For: Luxury destination celebrations",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1499673610122-01c7122c5dcb?w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
      "https://images.unsplash.com/photo-1518199266795-7b7a8a1ea7f1?w=1200&q=80",
    ],
    relatedSlugs: [
      "bridal-fashion-trends-defining-2026-weddings",
      "luxury-wedding-decor-ideas",
      "poolside-wedding-inspirations",
    ],
  },
];

export function getEditorialArticle(slug: string) {
  return EDITORIAL_ARTICLES.find((article) => article.slug === slug);
}
