import "./globals.css";

export const metadata = {
  title: "Fayrouza Online Store | متجر فيروزة للمنتجات الألمانية الأصلية",
  description: "Fayrouza Online Store - تشكيلة واسعة من مستحضرات التجميل، الفيتامينات، ومنتجات العناية الشخصية الألمانية الأصلية 100%. شحن لجميع أنحاء مصر.",
  metadataBase: new URL("https://webapplication-lovat.vercel.app"),
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
    url: "https://webapplication-lovat.vercel.app",
    siteName: "Fayrouza Online Store",
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
    canonical: "https://webapplication-lovat.vercel.app",
  },
  verification: {
    // Google Search Console verification tag will go here
    // After you add the site in Search Console, paste the code here:
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
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
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
