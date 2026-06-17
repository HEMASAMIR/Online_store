import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

// Admin emails - only these emails can access the admin panel
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
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }

    const users = await getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json({ success: false, error: "هذا الإيميل مسجل بالفعل" }, { status: 409 });
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      isAdmin: isEmailAdmin(email),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await saveUsers(users);

    // Return user without password
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
