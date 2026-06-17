import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const reviewsPath = path.join(process.cwd(), "data", "reviews.json");

async function readReviews() {
  try {
    const data = await fs.readFile(reviewsPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeReviews(reviews) {
  try {
    await fs.writeFile(reviewsPath, JSON.stringify(reviews, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function GET(request) {
  const reviews = await readReviews();
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const status = searchParams.get("status");

  let filtered = reviews;
  if (productId) {
    filtered = filtered.filter(r => r.productId === Number(productId));
  }
  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  return NextResponse.json(filtered);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const reviews = await readReviews();

    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    const newReview = {
      id: newId,
      productId: Number(body.productId),
      userName: body.userName || "عميل",
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      comment: body.comment || "",
      date: new Date().toISOString(),
      status: body.status || "pending", // admin-created reviews can be "approved" directly
    };

    reviews.push(newReview);
    await writeReviews(reviews);

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
    }

    const reviews = await readReviews();
    const index = reviews.findIndex(r => r.id === Number(body.id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    reviews[index] = {
      ...reviews[index],
      status: body.status !== undefined ? body.status : reviews[index].status,
      userName: body.userName !== undefined ? body.userName : reviews[index].userName,
      rating: body.rating !== undefined ? Number(body.rating) : reviews[index].rating,
      comment: body.comment !== undefined ? body.comment : reviews[index].comment,
    };

    await writeReviews(reviews);
    return NextResponse.json({ success: true, review: reviews[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
    }

    const reviews = await readReviews();
    const filtered = reviews.filter(r => r.id !== Number(id));

    if (filtered.length === reviews.length) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    await writeReviews(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
