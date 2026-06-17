import "./globals.css";

export const metadata = {
  title: "Fayrouza Online Store | متجر فيروزة للمنتجات الألمانية الأصلية",
  description: "Fayrouza Online Store - تشكيلة واسعة من مستحضرات التجميل، الفيتامينات، ومنتجات العناية الشخصية الألمانية الأصلية 100%.",
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Fayrouza Online Store | متجر فيروزة للمنتجات الألمانية الأصلية",
    description: "Fayrouza Online Store - تشكيلة واسعة من مستحضرات التجميل، الفيتامينات، ومنتجات العناية الشخصية الألمانية الأصلية 100%.",
    locale: "ar_EG",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="darkreader-lock" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
