import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/dataStore";

import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const PRODUCTS_FILE = "products.json";
const REVIEWS_FILE = "reviews.json";

async function readProducts() {
  return readData(PRODUCTS_FILE, []);
}

async function writeProducts(products) {
  return writeData(PRODUCTS_FILE, products);
}

async function readReviews() {
  return readData(REVIEWS_FILE, []);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forceSeed = searchParams.get("seed");

  if (forceSeed === "true") {
    try {
      const filePath = path.join(process.cwd(), "data", PRODUCTS_FILE);
      const raw = await fs.readFile(filePath, "utf-8");
      const localProducts = JSON.parse(raw);
      await writeProducts(localProducts);
      return NextResponse.json({ success: true, message: `Seeded ${localProducts.length} products successfully` });
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  const products = await readProducts();
  const reviews = await readReviews();
  
  // Group approved reviews by productId
  const approvedReviews = reviews.filter(r => r.status === "approved");
  const reviewsByProduct = {};
  approvedReviews.forEach(r => {
    if (!reviewsByProduct[r.productId]) {
      reviewsByProduct[r.productId] = [];
    }
    reviewsByProduct[r.productId].push(r);
  });
  
  // Calculate dynamic ratings and review counts
  const productsWithDynamicRating = products.map(product => {
    const productReviews = reviewsByProduct[product.id] || [];
    let rating = product.rating || 5.0;
    if (productReviews.length > 0) {
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      rating = Number((sum / productReviews.length).toFixed(1));
    }
    return {
      ...product,
      rating: rating,
      reviewsCount: productReviews.length
    };
  });
  
  return NextResponse.json(productsWithDynamicRating);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const products = await readProducts();
    
    // Generate new ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      name: body.name || "منتج جديد",
      description: body.description || "",
      price: Number(body.price) || 0,
      oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
      category: body.category || "عام",
      image: body.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      rating: 5.0,
      stock: Number(body.stock) || 10,
      features: body.features || [],
      sizes: body.sizes || [],
      colors: body.colors || []
    };
    
    products.push(newProduct);
    await writeProducts(products);
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }
    
    const products = await readProducts();
    const index = products.findIndex(p => p.id === Number(body.id));
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    products[index] = {
      ...products[index],
      name: body.name !== undefined ? body.name : products[index].name,
      description: body.description !== undefined ? body.description : products[index].description,
      price: body.price !== undefined ? Number(body.price) : products[index].price,
      oldPrice: body.oldPrice !== undefined ? (body.oldPrice ? Number(body.oldPrice) : null) : products[index].oldPrice,
      category: body.category !== undefined ? body.category : products[index].category,
      image: body.image !== undefined ? body.image : products[index].image,
      stock: body.stock !== undefined ? Number(body.stock) : products[index].stock,
      features: body.features !== undefined ? body.features : products[index].features,
      sizes: body.sizes !== undefined ? body.sizes : products[index].sizes,
      colors: body.colors !== undefined ? body.colors : products[index].colors
    };
    
    await writeProducts(products);
    
    return NextResponse.json({ success: true, product: products[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }
    
    const products = await readProducts();
    const filteredProducts = products.filter(p => p.id !== Number(id));
    
    if (products.length === filteredProducts.length) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    await writeProducts(filteredProducts);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
