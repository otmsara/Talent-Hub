"use server";

import { axiosAuth } from "@/lib/apiService";
import { AxiosError } from "axios";

// import { cookies } from "next/headers";

interface ResponseError {
  error?: string;
}

const axiosPrivate = axiosAuth();

// -------------------------
//        AI request all chats
// -------------------------
export async function aiRequestChats(page: number) {
  try {
    const response = await axiosPrivate.get(
      `/ai/chat/?page=${page.toString()}`
    );
    return { success: true, data: response.data, err: null };
  } catch (error) {
    const err = error as AxiosError<ResponseError>;
    console.error("Request failed:", {
      url: err?.config?.url,
      status: err?.response?.status,
      message: err?.message,
    });
    return { success: false, data: null, err: err?.response?.data.error };
  }
}

// -------------------------
//        AI request  chat by session id
// -------------------------
export async function aiRequestChatById(id: string) {
  try {
    const response = await axiosPrivate.get(`/ai/chat/${id}/`);
    return { success: true, data: response.data, err: null };
  } catch (error) {
    const err = error as AxiosError<ResponseError>;
    console.error("Request failed:", {
      url: err?.config?.url,
      status: err?.response?.status,
      message: err?.message,
    });
    return { success: false, data: null, err: err?.response?.data.error };
  }
}
// -------------------------
//        AI update chat title
// -------------------------
export async function aiUpdateChatTitle(id: string, newTitle: string) {
  try {
    await axiosPrivate.patch(`/ai/chat/${id}/`, { title: newTitle });
    return { success: true, err: null };
  } catch (error) {
    const err = error as AxiosError<ResponseError>;
    console.error("Request failed:", {
      url: err?.config?.url,
      status: err?.response?.status,
      message: err?.message,
    });
    return { success: false, err: err?.response?.data.error };
  }
}
// -------------------------
//        AI delete chat session
// -------------------------
export async function aiDeleteChat(id: string) {
  try {
    await axiosPrivate.delete(`/ai/chat/${id}/`);
    return { success: true, err: null };
  } catch (error) {
    const err = error as AxiosError<ResponseError>;
    console.error("Request failed:", {
      url: err?.config?.url,
      status: err?.response?.status,
      message: err?.message,
    });
    return { success: false, err: err?.response?.data.error };
  }
}
