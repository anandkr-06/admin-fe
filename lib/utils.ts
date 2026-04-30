import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  IMAGE_MEDIA_URL: process.env.NEXT_PUBLIC_IMAGE_MEDIA_URL,
  IMAGE_UPLOAD_URL: process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL,
};
