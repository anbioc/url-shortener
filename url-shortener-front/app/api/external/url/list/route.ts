import netClient from "@/lib/AxiosClient";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const url = `${process.env.API_ENDPOINT}/api/url/list`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await netClient.get(url, config);

  return NextResponse.json(await response.data, { status: response.status });
}
