import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/dataStore";
import crypto from "crypto";

const USERS_FILE = "users.json";
const ADMIN_EMAILS = [
  "mahmoudabdelhakim130@gmail.com",
  "kholoudkhaled1777@gmail.com"
];

const isEmailAdmin = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email.toLowerCase().trim());
};

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "dm_germany_salt_2024").digest("hex");
}

async function getUsers() {
  return readData(USERS_FILE, []);
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "الإيميل وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return NextResponse.json({ success: false, error: "الإيميل أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    if (user.password !== hashPassword(password)) {
      return NextResponse.json({ success: false, error: "الإيميل أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    // Return user without password
    const { password: _, ...safeUser } = user;
    // Ensure isAdmin is current
    safeUser.isAdmin = isEmailAdmin(user.email);

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
