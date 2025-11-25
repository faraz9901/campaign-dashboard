import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios, { AxiosError } from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


export const extractErrorMessage = (error: unknown, fallback: string = "Something went wrong") => {

  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.response?.data?.error || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}