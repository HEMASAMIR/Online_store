import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const settingsPath = path.join(process.cwd(), "data", "settings.json");

async function readSettings() {
  try {
    const data = await fs.readFile(settingsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading settings:", error);
    return {
      storeName: "DM Germany",
      whatsappNumber: "01153811346",
      shippingFee: 0,
      facebookUrl: "https://facebook.com/fayrouzastore",
      freeShippingThreshold: 0
    };
  }
}

async function writeSettings(settings) {
  try {
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing settings:", error);
    return false;
  }
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const currentSettings = await readSettings();
    
    const updatedSettings = {
      storeName: body.storeName !== undefined ? body.storeName : currentSettings.storeName,
      whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : currentSettings.whatsappNumber,
      shippingFee: body.shippingFee !== undefined ? Number(body.shippingFee) : currentSettings.shippingFee,
      facebookUrl: body.facebookUrl !== undefined ? body.facebookUrl : currentSettings.facebookUrl,
      freeShippingThreshold: body.freeShippingThreshold !== undefined ? Number(body.freeShippingThreshold) : currentSettings.freeShippingThreshold
    };
    
    await writeSettings(updatedSettings);
    
    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
