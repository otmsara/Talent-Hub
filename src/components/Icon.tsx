"use client";

import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { cn } from "@/lib/utils";

export default function Icon({ icon = "lucide:menu", className = "" }) {
  return (
    <IconifyIcon
      icon={icon}
      className={cn(
        "transition-scale inline h-[1.2rem] min-w-[1.2rem] duration-200 active:scale-75",
        className
      )}
    />
  );
}
