import { NextResponse } from 'next/server';
import netClient from '@/lib/AxiosClient';

export async function POST(request: Request, { params }: { params: { path: string[] } }) {
  // const token = (await cookies()).get('access_token')?.value;
const body = await request.json(); // Parse JSON body
const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/url/analytics/clicstatsks`;


console.log(`url: ${url} \n body : ${JSON.stringify(body)}`)
const config = {
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`,
  },
};


try {
const response = await netClient.post(url, body, config)

return NextResponse.json(response.data, { status: response.status });
} catch(e: any) {
  console.log(`response: ${e.message}`)
return NextResponse.json({}, { status: 500 });
}



}