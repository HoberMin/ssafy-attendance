import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAbsentTime = (category: string): number => {
  switch (category) {
    case "오전":
      return 0;
    case "오후":
      return 1;
    case "종일":
      return 2;
    default:
      return 0;
  }
};

export const getAbsentCategory = (category: string): number => {
  switch (category) {
    case "공가":
      return 0;
    case "사유":
      return 1;
    default:
      return 0;
  }
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const convertBase64ToFile = async (
  base64String: string,
  fileName: string = "appendix.png"
): Promise<File> => {
  const response = await fetch(base64String);
  const blob = await response.blob();
  return new File([blob], fileName, { type: "image/png" });
};

export const formatTwoDigits = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  return numbers.slice(0, 2);
};

export const validateDateInput = (
  type: "year" | "month" | "day",
  value: string
) => {
  const num = parseInt(value);
  switch (type) {
    case "year":
      return num >= 0 && num <= 99;
    case "month":
      return num >= 1 && num <= 12;
    case "day":
      return num >= 1 && num <= 31;
    default:
      return false;
  }
};

export const validateBirthday = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const formattedDate = numbers
    .slice(0, 6)
    .split("")
    .reduce((acc, digit, i) => {
      if (i === 2 || i === 4) return `${acc}-${digit}`;
      return acc + digit;
    }, "");
  return formattedDate;
};
