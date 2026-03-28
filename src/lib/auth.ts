import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_token";

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "change-me-in-production");
}

export async function signAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function adminLogin(email: string, password: string): Promise<boolean> {
  const ok =
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD;

  if (!ok) return false;

  const token = await signAdminToken();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return true;
}

export async function adminLogout() {
  (await cookies()).delete(COOKIE);
}
