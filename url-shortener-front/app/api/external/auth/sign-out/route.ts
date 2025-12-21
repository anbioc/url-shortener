import { getRefreshToken, resetTokens, setToken } from "@/lib/cookie.lib";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
    console.log('sign-out called')

    await resetTokens()

  const url = `${process.env.API_ENDPOINT}/api/auth/sign-out`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Can't sign out" },
      { status: 501 }
    );
  }

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

// Add POST, etc. as needed
