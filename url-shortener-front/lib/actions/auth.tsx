"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PassThrough } from "stream";
import { setRefreshToken, setToken } from "../cookie.lib";
import { da } from "zod/v4/locales";

// Optional: Define a state type for errors/success
type SignupState = {
  error?: string;
  success: boolean;
};

type SignUpModel = {
  email: string;
  password: string;
  fullname?: string;
};

type SignInModel = {
  email: string;
  password: string;
};

export async function signinAction(
  formData: SignUpModel
): Promise<SignupState> {
  const { email, password } = formData;
  // Add other fields like name, etc.

  // Basic validation (or use Zod for more advanced)
  if (!email || !password) {
    return { error: "Missing required fields", success: false };
  }

  try {
    // Call your external "sign-up" API
    console.log('loggin in action')
    const response = await fetch(`${process.env.API_ENDPOINT}/api/auth/login`, {
      // Replace with your actual API URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Sign-in failed", success: false };
    }

    const data = await response.json();

    await setToken(data.data.accessToken);
    await setRefreshToken( data.data.refreshToken);

    return { error: "Sign in succeed", success: true };
  } catch (err) {
    return { error: "Something went wrong. Try again.", success: false };
  }
}

export async function signupAction(
  formData: SignUpModel
): Promise<SignupState> {
  const { email, password, fullname } = formData;
  // Add other fields like name, etc.

  // Basic validation (or use Zod for more advanced)
  if (!email || !password) {
    return { error: "Missing required fields", success: false };
  }

  try {
    // Call your external "sign-up" API
    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/auth/register`,
      {
        // Replace with your actual API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullname }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Sign-up failed", success: false };
    }

    return { error: "Sign up succeed", success: true };

    // On success, redirect (e.g., to login or dashboard)
    // redirect('/login');  // Or '/dashboard' if auto-login
  } catch (err) {
    return { error: "Something went wrong. Try again.", success: false };
  }
}

export async function logout() {
  (await cookies()).delete("access_token")
}
