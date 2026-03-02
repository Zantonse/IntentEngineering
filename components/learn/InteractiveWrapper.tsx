"use client";

import Image from "next/image";
import { type ReactNode } from "react";

interface InteractiveWrapperProps {
  children?: ReactNode;
  texture: string;
}

export function InteractiveWrapper({ children, texture }: InteractiveWrapperProps) {
  return (
    <div className="my-8 card-v2 overflow-hidden">
      <div className="relative h-10 overflow-hidden">
        <Image src={texture} alt="" fill className="object-cover opacity-40" />
        <div className="absolute inset-0 flex items-center px-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Interactive Exercise
          </span>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
