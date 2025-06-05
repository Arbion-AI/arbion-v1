import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (
  number: number | string,
  precision = 2,
  fixed = 1
): string => {
  const cleanNumber =
    typeof number === "string" ? Number(number.replace(/,/g, "")) : number;

  if (isNaN(cleanNumber)) return "--";
  const absNumber = Math.abs(cleanNumber);
  if (absNumber < 1) return absNumber.toPrecision(precision);
  else if (absNumber < 1000) {
    return `${absNumber.toFixed(fixed)}`;
  } else if (absNumber < 1000000) {
    return `${(absNumber / 1000).toFixed(fixed)}K`;
  } else if (absNumber < 1000000000) {
    return `${(absNumber / 1000000).toFixed(fixed)}M`;
  } else if (absNumber < 1000000000000) {
    return `${(absNumber / 1000000000).toFixed(fixed)}B`;
  } else if (absNumber < 1000000000000000) {
    return `${(absNumber / 1000000000000).toFixed(fixed)}T`;
  } else {
    return `${(absNumber / 1000000000000000).toFixed(fixed)}Q`;
  }
};
