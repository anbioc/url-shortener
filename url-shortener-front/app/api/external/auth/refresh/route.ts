import {  setToken } from "@/lib/cookie.lib";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    // console.log('calling refresh from route')

  // const refreshToken = await getRefreshToken();
  const req =  request.nextUrl.searchParams
  const refreshToken = req.get('token')
  // console.log(`path: ${req.get("token")}`)

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const url = `${process.env.API_ENDPOINT}/api/auth/verify-refresh`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshtoken: refreshToken,
    }),
  });

  if (!response.ok) {
    console.log(`response not OK: ${JSON.stringify(response)}`)
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }

  const data = await response.json();
  await setToken(data.data.accessToken);

  return  NextResponse.json(data, { status: response.status });
}

