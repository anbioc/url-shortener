\import { NextResponse } from 'next/server';
import netClient from '@/lib/AxiosClient';

export async function POST(request: Request, { params }: { params: { path: string[] } }) {
  // const token = (await cookies()).get('access_token')?.value;
const body = await request.json(); // Parse JSON body


  const url = `${process.env.API_ENDPOINT}/api/url/create`;
const config = {
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`,
  },
};

const response = await netClient.post(url, body, config)

return NextResponse.json(response.data, { status: response.status });

//   return NextResponse.json(await response.json(), { status: response.status });
}

// Add POST, etc. as needed