import { axiosAuth } from "@/lib/apiService";
import { AxiosError } from "axios";
import Cookies from 'js-cookie';

interface ResponseError {
  error?: string;
}

const ACCESS_TOKEN_MAX_AGE = 60 * 100; // 100 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24; // 1 day in seconds

export async function refreshToken(refreshTokenValue: string) {
  try {
    const response = await axiosAuth().post("/accounts/token/refresh/", {
      refresh: refreshTokenValue,
    });
    const data = response.data;

    // Set cookies client-side
    Cookies.set("arya_access_token", data.access, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE * 1000),
    });
    
    Cookies.set("arya_refresh_token", data.refresh, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000),
    });

    return {
      success: true,
      newAccess: data.access,
      newRefresh: data.refresh,
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<ResponseError>;
    console.error('Token refresh failed:', error);
    
    // Clear invalid tokens
    Cookies.remove("arya_access_token", { path: "/" });
    Cookies.remove("arya_refresh_token", { path: "/" });

    return {
      success: false,
      newAccess: null,
      newRefresh: null,
      error: error.response?.data?.error || "Failed to refresh token",
    };
  }
}