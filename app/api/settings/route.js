import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

const SETTINGS_FILE = "settings.json";

const DEFAULT_SETTINGS = {
  storeName: "DM Germany",
  whatsappNumber: "01153811346",
  shippingFee: 0,
  facebookUrl: "https://facebook.com/fayrouzastore",
  freeShippingThreshold: 0
};

async function readSettings() {
  return readData(SETTINGS_FILE, DEFAULT_SETTINGS);
}

async function writeSettings(settings) {
  return writeData(SETTINGS_FILE, settings);
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
