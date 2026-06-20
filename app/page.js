import { readData } from "@/lib/dataStore";
import StoreFront from "./StoreFront";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  storeName: "Fayrouza Store",
  whatsappNumber: "+201012345678",
  shippingFee: 0,
  facebookUrl: "https://www.facebook.com/share/1EE3VWigZ3/?mibextid=wwXIfr",
  freeShippingThreshold: 0,
};

async function getProducts() {
  try {
    const products = await readData("products.json", []);
    const reviews = await readData("reviews.json", []);
    const approvedReviews = reviews.filter((r) => r.status === "approved");
    const reviewsByProduct = {};
    approvedReviews.forEach((r) => {
      if (!reviewsByProduct[r.productId]) reviewsByProduct[r.productId] = [];
      reviewsByProduct[r.productId].push(r);
    });
    return products.map((product) => {
      const pReviews = reviewsByProduct[product.id] || [];
      let rating = product.rating || 5.0;
      if (pReviews.length > 0) {
        const sum = pReviews.reduce((acc, r) => acc + r.rating, 0);
        rating = Number((sum / pReviews.length).toFixed(1));
      }
      return { ...product, rating, reviewsCount: pReviews.length };
    });
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    return await readData("settings.json", DEFAULT_SETTINGS);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default async function Home() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);

  return <StoreFront initialProducts={products} initialSettings={settings} />;
}
