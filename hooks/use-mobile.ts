"use client"

import { useMediaQuery } from "./use-media-query"

export function useMobileMedia(): boolean {
  return useMediaQuery("(max-width: 768px)")
}
