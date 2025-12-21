import { cookies } from "next/headers";

export async function getToken() {
  return (await cookies()).get("access_token")?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get("refresh_token")?.value;
}

export async function resetTokens() {
  (await cookies()).delete('access_token');
}

export async function setToken(token: string) {
  (await cookies()).set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",
    maxAge: 60 * 60 * 7, // e.g., 1 day
    path: "/",
  });
}

export async function setRefreshToken(refreshToken: string) {
  (await cookies()).set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 6, // e.g., 6 day
    path: "/",
  });
}
