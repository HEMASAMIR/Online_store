import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/dataStore";
import crypto from "crypto";

const USERS_FILE = "users.json";

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
  const users = await readData(USERS_FILE, []);
  
  const ADMIN_DEFAULT_PASSWORDS = {
    "mahmoudabdelhakim130@gmail.com": "8fea2f8b67f9d6c44e78c4c430e54beae50ca1561af1314d696af21d471d4338",
    "kholoudkhaled1777@gmail.com": "e0f36f191297fef2224ca75dc1609f85c6543e494d996889ac81907af4f3a7dd"
  };

  const ADMIN_NAMES = {
    "mahmoudabdelhakim130@gmail.com": "Mahmoud",
    "kholoudkhaled1777@gmail.com": "Kholoud"
  };

  let modified = false;
  for (const email of ADMIN_EMAILS) {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!exists) {
      users.push({
        id: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
        name: ADMIN_NAMES[email] || "Admin",
        email: email.toLowerCase().trim(),
        password: ADMIN_DEFAULT_PASSWORDS[email],
        isAdmin: true,
        createdAt: new Date().toISOString()
      });
      modified = true;
    } else {
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      let userChanged = false;
      if (!existingUser.isAdmin) {
        existingUser.isAdmin = true;
        userChanged = true;
      }
      if (existingUser.password !== ADMIN_DEFAULT_PASSWORDS[email]) {
        existingUser.password = ADMIN_DEFAULT_PASSWORDS[email];
        userChanged = true;
      }
      if (userChanged) {
        modified = true;
      }
    }
  }

  if (modified) {
    await writeData(USERS_FILE, users);
  }

  return users;
}

async function saveUsers(users) {
  return writeData(USERS_FILE, users);
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
