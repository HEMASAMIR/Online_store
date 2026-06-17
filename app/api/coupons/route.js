import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

const COUPONS_FILE = "coupons.json";

async function readCoupons() {
  return readData(COUPONS_FILE, []);
}

async function writeCoupons(coupons) {
  return writeData(COUPONS_FILE, coupons);
}

export async function GET(request) {
  const coupons = await readCoupons();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  
  if (code) {
    // Validate a specific coupon code (used by storefront)
    const coupon = coupons.find(
      c => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
    if (coupon) {
      return NextResponse.json({ valid: true, coupon });
    } else {
      return NextResponse.json({ valid: false, message: "الكود غير صالح أو غير مفعل" });
    }
  }
  
  return NextResponse.json(coupons);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const coupons = await readCoupons();

    // Check for duplicate code
    const exists = coupons.some(c => c.code.toUpperCase() === body.code.toUpperCase());
    if (exists) {
      return NextResponse.json({ success: false, error: "هذا الكود موجود بالفعل" }, { status: 400 });
    }

    const newId = coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1;
    const newCoupon = {
      id: newId,
      code: body.code.toUpperCase().trim(),
      discountType: body.discountType || "percentage", // "percentage" or "fixed"
      discountValue: Number(body.discountValue) || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    coupons.push(newCoupon);
    await writeCoupons(coupons);

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required" }, { status: 400 });
    }

    const coupons = await readCoupons();
    const index = coupons.findIndex(c => c.id === Number(body.id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    coupons[index] = {
      ...coupons[index],
      code: body.code !== undefined ? body.code.toUpperCase().trim() : coupons[index].code,
      discountType: body.discountType !== undefined ? body.discountType : coupons[index].discountType,
      discountValue: body.discountValue !== undefined ? Number(body.discountValue) : coupons[index].discountValue,
      isActive: body.isActive !== undefined ? body.isActive : coupons[index].isActive,
    };

    await writeCoupons(coupons);
    return NextResponse.json({ success: true, coupon: coupons[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required" }, { status: 400 });
    }

    const coupons = await readCoupons();
    const filtered = coupons.filter(c => c.id !== Number(id));

    if (filtered.length === coupons.length) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    await writeCoupons(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
