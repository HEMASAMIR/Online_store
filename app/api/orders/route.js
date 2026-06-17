import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

const ORDERS_FILE = "orders.json";

async function readOrders() {
  return readData(ORDERS_FILE, []);
}

async function writeOrders(orders) {
  return writeData(ORDERS_FILE, orders);
}

export async function GET() {
  const orders = await readOrders();
  // Return orders sorted by date descending (newest first)
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  return NextResponse.json(orders);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orders = await readOrders();
    
    // Generate new Order ID (e.g., ORD-XXXX)
    const newId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    
    const newOrder = {
      id: newId,
      customerName: body.customerName || "عميل غير معروف",
      phone: body.phone || "",
      address: body.address || "",
      notes: body.notes || "",
      items: body.items || [],
      total: Number(body.total) || 0,
      date: new Date().toISOString(),
      status: "pending" // pending, completed, cancelled
    };
    
    orders.push(newOrder);
    await writeOrders(orders);
    
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }
    
    const orders = await readOrders();
    const index = orders.findIndex(o => o.id === body.id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    
    orders[index] = {
      ...orders[index],
      status: body.status || orders[index].status
    };
    
    await writeOrders(orders);
    
    return NextResponse.json({ success: true, order: orders[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
