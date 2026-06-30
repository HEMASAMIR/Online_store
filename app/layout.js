import "./globals.css";

export const metadata = {
  title: "Fayrouza Online Store | متجر فيروزة للمنتجات الألمانية الأصلية",
  description: "Fayrouza Online Store - تشكيلة واسعة من مستحضرات التجميل، الفيتامينات، ومنتجات العناية الشخصية الألمانية الأصلية 100%. شحن لجميع أنحاء مصر.",
  metadataBase: new URL("https://fayrouza-store.com"),
  keywords: [
    "فيروزة",
    "Fayrouza",
    "متجر فيروزة",
    "منتجات ألمانية",
    "مستحضرات تجميل ألمانية",
    "فيتامينات ألمانية",
    "عناية شخصية",
    "منتجات أصلية",
    "تسوق اونلاين مصر",
    "Balea",
    "Doppelherz",
    "Mivolis",
    "German products Egypt",
  ],
  authors: [{ name: "Fayrouza Store" }],
  creator: "Fayrouza Store",
  publisher: "Fayrouza Store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Fayrouza Online Store | متجر فيروزة للمنتجات الألمانية الأصلية",
    description: "تشكيلة واسعة من مستحضرات التجميل، الفيتامينات، ومنتجات العناية الشخصية الألمانية الأصلية 100%. شحن لجميع أنحاء مصر.",
    url: "https://fayrouza-store.com",
    siteName: "متجر فيروزة للمنتجات الألمانية الأصلية",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Fayrouza Store Logo",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fayrouza Online Store | متجر فيروزة",
    description: "تشكيلة واسعة من المنتجات الألمانية الأصلية - مستحضرات تجميل، فيتامينات، ومنتجات عناية شخصية",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://fayrouza-store.com",
  },
  verification: {
    // Google Search Console verification tag will go here
    // After you add the site in Search Console, paste the code here:
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "متجر فيروزة للمنتجات الألمانية الأصلية",
  alternateName: "Fayrouza Online Store",
  url: "https://fayrouza-store.com",
  logo: "https://fayrouza-store.com/logo.png",
  image: "https://fayrouza-store.com/logo.png",
  description:
    "متجر فيروزة - تشكيلة واسعة من مستحضرات التجميل، الفيتامينات، ومنتجات العناية الشخصية الألمانية الأصلية 100%. شحن لجميع أنحاء مصر.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "EG",
    addressRegion: "مصر",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Arabic"],
  },
  sameAs: [
    "https://www.facebook.com/share/1EE3VWigZ3/?mibextid=wwXIfr",
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "متجر فيروزة للمنتجات الألمانية الأصلية",
  alternateName: "Fayrouza Store",
  url: "https://fayrouza-store.com",
  inLanguage: "ar",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://fayrouza-store.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const jsonLdStore = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "متجر فيروزة للمنتجات الألمانية الأصلية",
  image: "https://fayrouza-store.com/logo.png",
  url: "https://fayrouza-store.com",
  description:
    "تشكيلة واسعة من مستحضرات التجميل، الفيتامينات، ومنتجات العناية الشخصية الألمانية الأصلية 100%. شحن لجميع أنحاء مصر.",
  priceRange: "$$",
  servesCuisine: [],
  address: {
    "@type": "PostalAddress",
    addressCountry: "EG",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "23:00",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "منتجات ألمانية أصلية",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "عناية بالبشرة",
        description: "منتجات عناية بالبشرة ألمانية أصلية",
      },
      {
        "@type": "OfferCatalog",
        name: "فيتامينات ومكملات",
        description: "فيتامينات ومكملات غذائية ألمانية",
      },
      {
        "@type": "OfferCatalog",
        name: "عناية بالشعر",
        description: "منتجات عناية بالشعر ألمانية أصلية",
      },
      {
        "@type": "OfferCatalog",
        name: "مستلزمات شخصية",
        description: "مستلزمات العناية الشخصية الألمانية",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="darkreader-lock" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStore) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
