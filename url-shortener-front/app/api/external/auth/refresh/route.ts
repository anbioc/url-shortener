import { setRefreshToken, setToken } from "@/lib/cookie.lib";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // console.log('calling refresh from route')

  // const refreshToken = await getRefreshToken();
  const req = request.nextUrl.searchParams;
  const refreshToken = req.get("token");
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
    console.log(`response not OK: ${JSON.stringify(response)}`);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }

  try {
    const data = await response.json();
    await setToken(data.data.accessToken);
    await setRefreshToken(data.data.refreshToken);

    return NextResponse.json(data, { status: response.status });
  } catch (e : any) {
    console.log(`error getting refersh token: ${e.message}`)
    return NextResponse.json({}, { status: response.status });
  }
}
