// lib/api.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    redirect("/login");
  }

  return response;
}