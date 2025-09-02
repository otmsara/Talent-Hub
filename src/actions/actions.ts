"use server";

import { axiosAuth } from "@/src/lib/apiService";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

interface ResponseError {
  error?: string;
}
const axiosPrivate = axiosAuth();

// -------------------------
//         get user
// -------------------------
export async function getUser() {
  try {
    const response = await axiosPrivate.get("/accounts/profile");
    return { success: true, data: response.data, err: null };
  } catch (error) {
    const err = error as AxiosError<ResponseError>;
    console.error(err);
    return { success: false, data: null, err: err.response?.data.error };
  }
}
// -------------------------
//         Logout
// -------------------------
export async function logout() {
  try {
    await axiosPrivate.post("/accounts/logout/");
    const commonOptions = {
      path: "/",
      httpOnly: true,
      maxAge: -1, // Expire immediately
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };
    cookies().set("arya_access_token", "", commonOptions);
    cookies().set("arya_refresh_token", "", commonOptions);

    return { success: true, err: null };
  } catch (error) {
    const err = error as AxiosError<ResponseError>;
    console.error(err);
    return { success: false, err: err.response?.data.error };
  }
}
