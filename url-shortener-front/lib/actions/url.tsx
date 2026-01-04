"use server";

import { UrlModel } from "@/types/UrlModel";
import { getToken } from "../cookie.lib";

export type UrlResponse = {
  data?: UrlModel;
  error?: string;
  success: boolean;
};

export type UrlListResponse = {
  data?: UrlModel[];
  error?: string;
  success: boolean;
};

export async function increaseUrlCount(short: string) {
  try {
      const token = await getToken();

    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/url/increase/${short}`, {
      method: "GET",
      cache:'no-store',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
    );
  } catch (e: any) {}
}

export async function getUrlList(): Promise<UrlListResponse> {
  const token = await getToken();
  try {
    const response = await fetch(`${process.env.API_ENDPOINT}/api/url/list`, {
      method: "GET",
      cache:'no-store',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to get data list",
      };
    }

    const d = await response.json();
    return {
      success: true,
      data: d.data,
    };
  } catch (e: any) {
    console.error(`Somethng went wrong getting url list: ${e.message}`);
    return {
      success: false,
      error: e.message || "Failed to get data list",
    };
  }
}

export async function getUrlFromServer(short: string): Promise<UrlResponse> {
  try {
      const token = await getToken();

    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/url/list/${short}`,
      {
        method: "GET",
       headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Sign-in failed",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (e: any) {
    console.log;
  } finally {
  }

  return {
    success: false,
    error: "Sign-in failed",
  };
}
