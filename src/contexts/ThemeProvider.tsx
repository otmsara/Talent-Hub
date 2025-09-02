"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// src/context/ThemeProvider.tsx
export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider {...props} defaultTheme="dark" forcedTheme="dark">
      {children}
    </NextThemesProvider>
  );
}
